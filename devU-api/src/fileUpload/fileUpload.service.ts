import { FileUpload } from '../../devu-shared-modules'
import { generateFilename } from '../utils/fileUpload.utils'

import { minioClient, uploadFile, downloadFile } from '../fileStorage'

export async function create(files: Express.Multer.File[], bucketName: string, userId: number) {
  try {
    let fileName: string = ''
    let originalName: string = ''
    let fieldName: string = files[0].fieldname
    let etags: string = ''

    await Promise.all(
      files.map(async file => {
        const generatedFileName = generateFilename(file.originalname, userId)
        const etag = await uploadFile(bucketName, file, generatedFileName)
        etags = etags ? etags + ', ' + etag : etag
        fileName = fileName ? fileName + ', ' + generatedFileName : generatedFileName
        originalName = originalName ? originalName + ', ' + file.originalname : file.originalname
      })
    )

    let fileUpload: FileUpload = {
      fieldName: fieldName,
      originalName: originalName,
      filename: fileName,
      etags: etags,
    }
    return fileUpload
  } catch (error: any) {
    throw new Error('Error uploading files: ' + error.message)
  }
}

export async function retrieve(bucketName: string, fileName: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    downloadFile(bucketName, fileName)
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export async function list(bucketName: string) {
  return new Promise((resolve, reject) => {
    const stream = minioClient.listObjects(bucketName)
    let files: object[] = []

    stream.on('data', function (obj) {
      files.push(obj)
    })

    stream.on('error', function (err) {
      reject(err)
    })

    stream.on('end', function () {
      resolve(files)
    })
  })
}

export default {
  create,
  retrieve,
  list,
}
