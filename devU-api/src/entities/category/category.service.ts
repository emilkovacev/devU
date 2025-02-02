import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import CategoryModel from './category.model'

import { Category } from 'devu-shared-modules'

const connect = () => dataSource.getRepository(CategoryModel)

export async function create(category: Category) {
  return await connect().save(category)
}

export async function update(category: Category) {
  const { id, name } = category
  if (!id) throw new Error('Missing Id')
  return await connect().update(id, { name })
}

export async function _delete(id: number) {
  return await connect().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await connect().findOneBy({ id, deletedAt: IsNull() })
}

export async function list() {
  return await connect().findBy({ deletedAt: IsNull() })
}

export async function listByCourse(courseId: number) {
  // TODO?
  return await connect().findBy({ courseId, deletedAt: IsNull() })
}

export default {
  create,
  retrieve,
  update,
  _delete,
  list,
  listByCourse,
}
