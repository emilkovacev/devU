/**
 * Represents the response body for the `/open` request.
 */
interface OpenResponse {
  statusMsg: string
  statusId: number
  files: { [fileName: string]: string }
}

/**
 * Represents the response body for the `/upload` request.
 */
interface UploadResponse {
  statusMsg: string
  statusId: number
}

/**
 * Represents a single file information object with `localFile` and `destFile` properties.
 */
interface FileInfo {
  localFile: string
  destFile: string
}

/**
 * Represents the request body for the `/addJob` request.
 */
interface AddJobRequest {
  image: string
  files: FileInfo[]
  jobName: string
  output_file: string
  timeout?: number
  max_kb?: number
  callback_url?: string
}

/**
 * Represents the response body for the `/addJob` request.
 */
interface AddJobResponse {
  statusMsg: string
  statusId: number
  jobId: number
}

/**
 * Represents the response body for the `/poll` request when the job is completed.
 */
interface PollSuccessResponse {
  // The autograder output file content ???
}

/**
 * Represents the response body for the `/poll` request when the job is not completed.
 */
interface PollFailureResponse {
  statusMsg: string
  statusId: number
}

/**
 * Represents the response body for the `/info` request.
 */
interface InfoResponse {
  info: {
    num_threads: number
    job_requests: number
    waitvm_timeouts: number
    runjob_timeouts: number
    elapsed_secs: number
    runjob_errors: number
    job_retries: number
    copyin_errors: number
    copyout_errors: number
  }
  statusMsg: string
  statusId: number
}

/**
 * Represents the request body for the `/prealloc` request.
 */
interface PreallocRequest {
  vmms: string
  cores: number
  memory: number
}

/**
 * Represents the response body for the `/prealloc` request.
 */
interface PreallocResponse {
  status: string
}

/**
 * Represents the request body for the `/jobs` request.
 */
interface JobsRequest {
  deadjobs: number
}
