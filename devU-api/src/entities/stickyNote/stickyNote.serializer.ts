import {StickyNote} from 'devu-shared-modules'

import StickyNoteModel from './stickyNote.model'

export function serialize(stickyNote: StickyNoteModel): StickyNote {
  return {
    id: stickyNote.id,
    submissionId: stickyNote.submissionId,
    content: stickyNote.content,
  }
}