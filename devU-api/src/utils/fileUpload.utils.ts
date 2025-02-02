import { BucketNames } from '../fileStorage'
import { fileUploadTypes } from '../../devu-shared-modules'
import crypto from 'crypto'

/*
 * generateFilename currently only use sha256 to hash the originalName with a timestamp
 * This can be updated to use a different hashing algorithm in the future
 * Marking for discussion
 */
export function generateFilename(originalName: string, id: number): string {
  const hash = crypto.createHash('sha256')
  const timestamp = Date.now()
  hash.update(originalName + id + timestamp)
  return hash.digest('hex')
}

/*
  This function is deciding which bucket to upload the file
  however, it only specifies the bucket for graderFile and makefileFile
  It can be updated to support multiple buckets in the future

  Marking for discussion

 */
export type fileUploadType = typeof fileUploadTypes[number]
export function mappingFieldWithBucket(input: fileUploadType) {
  const specialPair: Partial<Record<fileUploadType, BucketNames>> = {
    graderFile: BucketNames.GRADERS,
    makefileFile: BucketNames.MAKEFILES,
  }
  return specialPair[input] || BucketNames.SUBMISSIONS
}
