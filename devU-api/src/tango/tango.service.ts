import './tango.types'
import fetch from 'node-fetch'

const tangoHost = `http://tango:3000`
const tangoKey = process.env.TANGO_KEY ?? 'test'

// for more info https://docs.autolabproject.com/tango-rest/

/**
 * Opens a directory for a given course.
 * @param course - The course name.
 */
export async function createCourse(course: string): Promise<OpenResponse | null> {
  const url = `${tangoHost}/open/${tangoKey}/${course}/`
  const response = await fetch(url, { method: 'GET' })
  return response.ok ? ((await response.json()) as OpenResponse) : null
}

/**
 * Uploads a file to the server for a given course.
 * @param course - The course name.
 * @param fileName - The file name, used to identify the file when uploaded
 * @param file - The file to be uploaded.
 */
export async function uploadFile(course: string, file: Buffer, fileName: string): Promise<UploadResponse | null> {
  const url = `${tangoHost}/upload/${tangoKey}/${course}/`
  const response = await fetch(url, { method: 'POST', body: file, headers: { filename: fileName } })
  return response.ok ? ((await response.json()) as UploadResponse) : null
}

/**
 * Adds a job to the server for a given course.
 * @param course - The course name.
 * @param job - The job request object.
 */
export async function addJob(course: string, job: AddJobRequest): Promise<AddJobResponse | null> {
  const url = `${tangoHost}/addJob/${tangoKey}/${course}/`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
  })
  return response.ok ? ((await response.json()) as AddJobResponse) : null
}

/**
 * Polls the server for the status of a job.
 * @param course - The course name.
 * @param outputFile - The name of the output file.
 */
export async function pollJob(course: string, outputFile: string): Promise<PollSuccessResponse | PollFailureResponse> {
  //PollSuccessResponse
  const url = `${tangoHost}/poll/${tangoKey}/${course}/${outputFile}/`
  const response = await fetch(url, { method: 'GET' })

  return response.headers.get('Content-Type')?.includes('application/json')
    ? ((await response.json()) as PollFailureResponse)
    : ((await response.text()) as PollSuccessResponse)
}

/**
 * Pings the tango server.
 */
export async function tangoHelloWorld(): Promise<boolean> {
  const url = `${tangoHost}/`
  const response = await fetch(url, { method: 'GET' })
  return response.ok
}

/**
 * Retrieves information about the Tango service.
 */
export async function getInfo(): Promise<InfoResponse | null> {
  const url = `${tangoHost}/info/${tangoKey}/`
  const response = await fetch(url, { method: 'GET' })
  return response.ok ? ((await response.json()) as InfoResponse) : null
}

/**
 * Retrieves information about the pool of instances for a given image.
 * @param image - The name of the image.
 */
export async function getPoolInfo(image: string): Promise<Object | null> {
  const url = `${tangoHost}/pool/${tangoKey}/${image}/`
  const response = await fetch(url, { method: 'GET' })
  return response.ok ? ((await response.json()) as Object) : null
}

/**
 * Pre-allocates a pool of instances for a given image.
 * @param image - The name of the image.
 * @param num - The number of instances to pre-allocate.
 * @param request - The request object.
 */
export async function preallocateInstances(
  image: string,
  num: number,
  request: PreallocRequest
): Promise<PreallocResponse | null> {
  const url = `${tangoHost}/prealloc/${tangoKey}/${image}/${num}/`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  return response.ok ? ((await response.json()) as PreallocResponse) : null
}

/**
 * Retrieves information about jobs.
 * @param deadjobs - A flag to indicate whether to retrieve dead jobs (1) or running jobs (0).
 * @returns Empty response on successful request
 */
export async function getJobs(deadjobs: number): Promise<{} | null> {
  const url = `${tangoHost}/jobs/${tangoKey}/${deadjobs}/`
  const response = await fetch(url, { method: 'POST' })
  return response.ok ? {} : null
}
