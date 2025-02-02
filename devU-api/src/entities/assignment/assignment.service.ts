import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import AssignmentModel from './assignment.model'

import { Assignment } from 'devu-shared-modules'
import { Request } from 'express'
import { generateFilename } from '../../utils/fileUpload.utils'
import { BucketNames, uploadFile } from '../../fileStorage'

const connect = () => dataSource.getRepository(AssignmentModel)

export async function create(assignment: Assignment) {
  return await connect().save(assignment)
}

export async function update(assignment: Assignment) {
  const {
    id,
    name,
    startDate,
    dueDate,
    endDate,
    categoryName,
    description,
    maxFileSize,
    maxSubmissions,
    disableHandins,
    attachmentsHashes,
    attachmentsFilenames,
  } = assignment

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, {
    name,
    startDate,
    dueDate,
    endDate,
    categoryName,
    description,
    maxFileSize,
    maxSubmissions,
    disableHandins,
    attachmentsHashes,
    attachmentsFilenames,
  })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number, courseId: number) {
  return await connect().findOneBy({ id: id, courseId: courseId, deletedAt: IsNull() })
}

export async function list() {
  return await connect().findBy({ deletedAt: IsNull() })
}

export async function listByCourse(courseId: number) {
  return await connect().findBy({ courseId: courseId, deletedAt: IsNull() })
}

export async function listByCourseReleased(courseId: number) {
  // TODO: filter by start date after current time
  // const now = new Date(Date.now())
  const allAssignments = await connect().findBy({ courseId: courseId, /*startDate: MoreThanOrEqual(now),*/ deletedAt: IsNull() })

  // console.log("ASSIGNMENTS WITH FILTER: ", allAssignments)

  return allAssignments;
}

export async function isReleased(id: number) {
  const assignment = await connect().findOneBy({ id, deletedAt: IsNull() })

  if (!assignment) {
    return false
  }

  const startDate = assignment?.startDate
  const currentDate = new Date(Date.now())

  return startDate && startDate < currentDate
}

async function getMaxSubmissionsAndDeadline(id: number) {
  return await connect().findOne({ where: { id: id, deletedAt: IsNull() }, select: ['maxSubmissions', 'maxFileSize', 'disableHandins', 'endDate'] })
}

async function processFiles(req: Request) {
  let fileHashes: string[] = []
  let fileNames: string[] = []

  // save files
  if (req.files) {
    console.log()
    if (Array.isArray(req.files)) {
      for (let index = 0; index < req.files.length; index++) {
        const item = req.files[index]
        const filename = generateFilename(item.originalname, item.size)
        await uploadFile(BucketNames.ASSIGNMENTSATTACHMENTS, item, filename)
        fileHashes.push(filename)
        fileNames.push(item.originalname)
      }
    } else {
      console.warn(`Files where not in array format ${req.files}`)
    }
  } else {
    console.warn(`No files where processed`)
  }

  return { fileHashes, fileNames }
}


export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  listByCourse,
  listByCourseReleased,
  isReleased,
  getMaxSubmissionsForAssignment: getMaxSubmissionsAndDeadline,
  processFiles,
}
