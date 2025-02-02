import * as Minio from 'minio'

import environment from './environment'

export enum BucketNames {
  GRADERS = 'graders',
  SUBMISSIONS = 'submissions',
  MAKEFILES = 'makefiles',
  ASSIGNMENTSATTACHMENTS = 'assignmentattachments'
}

const minioConfiguration: Minio.ClientOptions = {
  endPoint: environment.minioHost,
  port: environment.minioPort,
  useSSL: false,
  accessKey: environment.minioUsername,
  secretKey: environment.minioPassword,
}

export const minioClient = new Minio.Client(minioConfiguration)

export async function initializeMinio(inputBucketName?: string) {
  if (inputBucketName) {
    const bucketExists = await minioClient.bucketExists(inputBucketName)

    if (bucketExists) return

    await minioClient.makeBucket(inputBucketName, 'us-east-1').catch(err => {
      throw new Error(`Error creating MinIO bucket '${inputBucketName}'`)
    })
    return
  } else {
    for (const bucketName of Object.values(BucketNames)) {
      const bucketExists = await minioClient.bucketExists(bucketName)

      if (bucketExists) continue

      minioClient.makeBucket(bucketName, 'us-east-1').catch(err => {
        throw new Error(`Error creating MinIO bucket '${bucketName}'`)
      })
    }
  }
}

export async function uploadFile(bucketName: string, file: Express.Multer.File, filename: string): Promise<string> {
  try {
    const objInfo = await minioClient.putObject(bucketName, filename, file.buffer, file.size)
    return objInfo.etag
  } catch (err: Error | any) {
    if (err) {
      throw new Error('File failed to upload because ' + err)
    } else {
      throw err
    }
  }
}

export async function downloadFile(bucketName: string, filename: string): Promise<Buffer> {
  try {
    const dataStream = await minioClient.getObject(bucketName, filename)
    const fileData: Buffer[] = []
    return new Promise((resolve, reject) => {
      dataStream.on('data', (chunk: Buffer) => {
        fileData.push(chunk)
      })

      dataStream.on('end', () => {
        resolve(Buffer.concat(fileData))
      })

      dataStream.on('error', (err: any) => {
        reject(new Error('File failed to download from MinIO because ' + err))
      })
    })
  } catch (err: Error | any) {
    if (err) {
      throw new Error(filename + " and " + bucketName +' File failed to download because ' + err)
    } else {
      throw err
    }
  }
}
