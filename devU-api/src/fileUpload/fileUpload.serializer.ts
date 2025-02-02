import { FileUpload } from '../../devu-shared-modules'

export function serialize(file: FileUpload): FileUpload {
  return {
    id: file.id,
    fieldName: file.fieldName,
    originalName: file.originalName,
    filename: file.filename,
    etags: file.etags,
  }
}
