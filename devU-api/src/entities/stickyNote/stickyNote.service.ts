import {IsNull} from 'typeorm'
import {dataSource} from '../../database'

import StickyNotesModel from './stickyNote.model'
import {StickyNote} from 'devu-shared-modules'

const StickyNoteConn = () => dataSource.getRepository(StickyNotesModel)

export async function create(stickyNote: StickyNote) {
  return await StickyNoteConn().save(stickyNote)
}

export async function update(id : number,stickyNote: StickyNote) {
  const {submissionId, content} = stickyNote
  if (!id) throw new Error('Missing Id')
  return await StickyNoteConn().update(id, {submissionId, content})
}

export async function _delete(id: number) {
    return await StickyNoteConn().softDelete({id, deletedAt: IsNull()})
}

export async function retrieve(id: number) {
    return await StickyNoteConn().findOneBy({id, deletedAt: IsNull()})
}

export async function listBySubmission(submissionId: number) {
    return await StickyNoteConn().findBy({submissionId: submissionId , deletedAt: IsNull()})
}

export default {
    create,
    update,
    _delete,
    retrieve,
    listBySubmission,
}