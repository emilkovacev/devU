export type FileUpload = {
  id?: number
  userId?: number
  assignmentId?: number
  courseId?: number
  fieldName: string
  originalName: string
  filename: string
  etags: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

/*
  This file contains the types for file uploads, if there is a new type of file upload, it should be added here
  so that routers do not have to hard code the file types. But not sure if this should relate to minio bucketName,
  so that each type of file upload can have its own bucketName or just a single bucketName for studentSubmission

  Marked for discussion.
 */
export const fileUploadTypes = ['studentSubmission', 'graderFile', 'makefileFile','files'] as const
