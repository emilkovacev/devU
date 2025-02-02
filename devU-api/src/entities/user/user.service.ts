import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import UserModel from './user.model'

import { User } from 'devu-shared-modules'

import UserCourseService from '../userCourse/userCourse.service'

const connect = () => dataSource.getRepository(UserModel)

export async function create(user: User) {
  // check if the first account
  const users = await connect().count({ take: 1 })
  if (users == 0) {
    // make first created account admin
    user.isAdmin = true
  }

  return await connect().save(user)
}

export async function update(user: User) {
  const { id, preferredName } = user

  if (!id) throw new Error('Missing Id')

  return await connect().update(id, { preferredName })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

export async function isAdmin(id: number) {
  return await connect().findOne({
    where: { id, deletedAt: IsNull() },
    select: ['isAdmin'],
  })
}

export async function createAdmin(id: number) {
  return await connect().update(id, { isAdmin: true })
}

// soft deletes an admin
export async function softDeleteAdmin(id: number) {
  let res = await connect().count({ take: 2, where: { isAdmin: true } })
  // check if this deletes the last admin
  // there must always be at least 1 admin
  if (res == 1) {
    throw Error('Unable to delete, only a single admin remains')
  }

  return await connect().update(id, { isAdmin: false })
}

// list all admins
export async function listAdmin() {
  return await connect().findBy({ isAdmin: true, deletedAt: IsNull() })
}


export async function retrieveByEmail(email: string) {
  return await connect().findOneBy({ email: email, deletedAt: IsNull() })
}

export async function list() {
  return await connect().findBy({ deletedAt: IsNull() })
}

export async function listByCourse(courseId: number, userRole?: string) {
  const userCourses = await UserCourseService.listByCourse(courseId)
  const userPromises = userCourses
    // .filter(uc => !userRole || uc.role === userRole)
    .map(uc => connect().findOneBy({ id: uc.userId, deletedAt: IsNull() }))
  return await Promise.all(userPromises)
}

export async function ensure(userInfo: User) {
  const { externalId } = userInfo

  const user = await connect().findOneBy({ externalId })

  if (user) return { user, isNewUser: false }

  const newUser = await create(userInfo)

  return { user: newUser, isNewUser: true }
}

export default {
  create,
  retrieve,
  retrieveByEmail,
  update,
  _delete,
  list,
  isAdmin,
  createAdmin,
  softDeleteAdmin,
  listAdmin,
  ensure,
  listByCourse,
}
