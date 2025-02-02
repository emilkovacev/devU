import { NextFunction, Request, Response } from 'express'
import { NotFound, GenericResponse, Unauthorized } from '../utils/apiResponse.utils'
import AssignmentService from '../entities/assignment/assignment.service'
import UserCourseService from '../entities/userCourse/userCourse.service'
import RoleService from '../entities/role/role.service'
import { serialize } from '../entities/role/role.serializer'
import { Role } from '../../devu-shared-modules'
import UserService from '../entities/user/user.service'

/**
 * Are you authorized to access this endpoint?
 *
 * @param permission if the user has this permission, they are authorized
 * @param permissionIfSelf if the user does not have the first 'permission', but they have the 'permissionIfSelf' and
 * 'expectedSelfId' matches their user id, then they are authorized
 * @param ownerId id that must match the user id if using a self permission
 */
export function isAuthorized(permission: string, permissionIfSelf?: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const courseId = parseInt(req.params.courseId)
    const userId = req.currentUser?.userId

    if (!courseId || !userId) {
      return res.status(404).json(NotFound)
    }

    // check if admin
    const user = await UserService.isAdmin(userId!)
    if (user && user.isAdmin!) {
      // no role checks needed
      // user is admin !
      return next()
    }

    // Pull userCourse
    const userCourse = await UserCourseService.retrieveByCourseAndUser(courseId, userId)

    // If the course doesn't exist or the user is not enrolled, return the same error, so we don't leak information
    // about what courses exist
    if (!userCourse || userCourse.dropped) {
      return res.status(404).json(NotFound)
    }

    // Pull role
    let role: Role | undefined
    const roleModel = await RoleService.retrieveByCourseAndName(courseId, userCourse.role)

    if (!roleModel) {
      role = RoleService.retrieveDefaultByName(userCourse.role)
    } else {
      role = serialize(roleModel) as Role
    }

    if (!role) {
      return res.status(403).json(new GenericResponse('Invalid role: ' + userCourse.role))
    }

    const x = role[permission as keyof typeof role]
    console.log(x)
    // check for permission
    if (role[permission as keyof typeof role]) {
      // authorized!
      return next()
    }

    if (permissionIfSelf && req.ownerId && role[permissionIfSelf as keyof typeof role]) {
      // can access if they are the owner
      if (req.currentUser?.userId && req.currentUser?.userId === parseInt(req.ownerId)) {
        // authorized to access their own content
        return next()
      }
    }

    return res.status(403).json(Unauthorized)
  }
}

/**
 * Checks if the user is authorized to view a specific assignment. If the assignment is released, check if they have
 * the 'assignmentViewReleased' permission. If the assignment is not released, check if they have the
 * 'assignmentViewAll' permission
 *
 * Assumes the request has the assignment id as a request param named 'assignmentId'. The id is verified to be an int,
 * but not checked to be a valid assignment id
 */
export async function isAuthorizedByAssignmentStatus(req: Request, res: Response, next: NextFunction) {
  const assignmentId = parseInt(req.params.assignmentId)
  const isAssignmentReleased = await AssignmentService.isReleased(assignmentId)
  const permissionString = isAssignmentReleased ? 'assignmentViewReleased' : 'assignmentViewAll'
  await isAuthorized(permissionString)(req, res, next)
  // TODO: Authorization based on released status. This way is bad. It has hard-coded permission strings and won't
  //       work for sub-entities (eg. submissionProblemScores shouldn't be viewable if the assignment is not released)
  // TODO: check if scores are released
  // TODO: rework this to be proper middleware, if keeping this at all
}

// Maybe do this instead
// export async function extractAssignmentStatus(req: Request, res: Response, next: NextFunction) {
//     const assignmentId = parseInt(req.params['assignmentId'])
//     const isAssignmentReleased = await AssignmentService.isReleased(assignmentId)
//
//     next()
// }

export function extractOwnerByPathParam(ownerParam: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    req.ownerId = req.params[ownerParam]
    next()
  }
}

export function extractOwnerByBodyParam(ownerBodyParam: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    req.ownerId = req.body[ownerBodyParam]
    next()
  }
}

export function extractOwnerOfCourseContentByResourceField<T>(
  serviceFunction: (resourceId: number, courseId: number) => Promise<T>,
  extractOwnerId: (resource: T) => string,
  resourceIdParam: string
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const resourceId = parseInt(req.params[resourceIdParam])
    const courseId = parseInt(req.params.courseId)

    const resource = await serviceFunction(resourceId, courseId)
    req.ownerId = extractOwnerId(resource)

    next()
  }
}
