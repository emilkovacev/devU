import { IsNull } from 'typeorm'
import { dataSource } from '../../database'

import SubmissionModel from '../submission/submission.model'
import FileModel from '../../fileUpload/fileUpload.model'
import CourseModel from '../course/course.model'

import { FileUpload, Submission } from 'devu-shared-modules'
import { uploadFile } from '../../fileStorage'

const submissionConn = () => dataSource.getRepository(SubmissionModel)
const fileConn = () => dataSource.getRepository(FileModel)

export async function create(submission: Submission, file?: Express.Multer.File | undefined) {
  if (file) {
    const bucket: string = await dataSource
      .getRepository(CourseModel)
      .findOneBy({ id: submission.courseId })
      .then(course => {
        if (course) {
          return (course.number + course.semester + course.id).replace(/ /g, '-').toLowerCase()
        }
        return 'submission'
      })

    const filename: string = file.originalname
    const Etag: string = await uploadFile(bucket, file, filename)
    const fileModel: FileUpload = {
      userId: submission.userId,
      assignmentId: submission.assignmentId,
      courseId: submission.courseId,
      etags: Etag,
      fieldName: bucket,
      originalName: file.originalname,
      filename: filename,
    }
    const content = JSON.parse(submission.content)
    if (!content.filepaths) {
      content.filepaths = []
    }
    content.filepaths.push(`${bucket}/${filename}`)
    submission.content = JSON.stringify(content)

    await fileConn().save(fileModel)
  }
  return await submissionConn().save(submission)
}

export async function _delete(id: number) {
  return await submissionConn().softDelete({ id, deletedAt: IsNull() })
}

export async function retrieve(id: number) {
  return await submissionConn().findOneBy({ id, deletedAt: IsNull() })
}

export async function list(query: any, id: number) {

  return await submissionConn().findBy({ ...query, submittedBy: id, deletedAt: IsNull() })
}

export async function listByAssignment(assignmentId: number, id: number) {
  return await submissionConn().find({ where: { assignmentId, submittedBy: id, deletedAt: IsNull() } })
}

export default {
  create,
  retrieve,
  _delete,
  list,
  listByAssignment,
}
