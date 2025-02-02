import config from '../config'

import { getToken } from 'utils/authentication.utils'

const proxiedUrls = {
  '/api': `${config.apiUrl}`,
}

/**
 * Checks the front of the user supplied URL and changes the font of it to use our API_HOST
 * If the supplied URL doesn't match any of our proxies, return the provided URL
 */
function _replaceUrl(userUrl: string) {
  const proxy: string | undefined = Object.keys(proxiedUrls).find((key) => {
    if (userUrl.startsWith(key)) return true
    return false
  })

  if (!proxy) return userUrl

  return userUrl.replace(proxy, proxiedUrls[proxy as keyof typeof proxiedUrls])
}

function _handleResponse(res: Response) {
  // unfulfilled promise & error handling for non json response bodies
  const body = res.json().catch((err) => _handleNonJsonResponse(err, res))

  // One off header check for /login
  // if we see this header, we force our user to relogin
  if (res.headers.get('x-nearing-expiration') === 'true') throw new Error('Forced token expiration')

  if (res.ok) return body

  return body.then((err) => {
    throw err
  })
}

function _handleNonJsonResponse(err: Error, res: Response) {
  if (!res.ok || res.status >= 400) throw err
  if (err instanceof SyntaxError) return res

  throw err
}

function _handleError(err: Error) {
  // TODO report error
  console.error(err)
  throw err
}

function _fetchWrapper(url: string, request: any) {
  return fetch(url, request).then(_handleResponse).catch(_handleError)
}

async function get<T = any>(url: string, options: RequestInit = {}, unauthenticated = false): Promise<T> {
  const proxy = _replaceUrl(url)

  const request: any = {
    method: 'GET',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    ...options, // Provieds users a way to override everything
  }

  if (!unauthenticated) {
    const authToken = await getToken()
    if (authToken) request.headers['authorization'] = `Bearer ${authToken}`
  }

  return _fetchWrapper(proxy, request)
}

async function post<T = any>(
  url: string,
  body: Record<string, any>,
  options: RequestInit = {},
  unauthenticated = false,
): Promise<T> {
  const proxy = _replaceUrl(url)


  const request: any = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify(body),
    ...options,
  }

  if (!unauthenticated) {
    const authToken = await getToken()

    if (authToken) request.headers['authorization'] = `Bearer ${authToken}`
  }

  return _fetchWrapper(proxy, request)
}

async function postMultipart<T = any>(
  url: string,
  body: FormData,
  options: RequestInit = {},
): Promise<T> {
  const proxy = _replaceUrl(url)
  const authToken = await getToken()

  const request: any = {
    method: 'POST',
    headers: { authorization: `Bearer ${authToken}` },
    body: body,
    ...options,
  }

  return _fetchWrapper(proxy, request)
}

async function put<T = any>(url: string, body: Record<string, any>, options: RequestInit = {}): Promise<T> {
  const token = await getToken()
  const proxy = _replaceUrl(url)

  return _fetchWrapper(proxy, {
    method: 'PUT',
    headers: { accept: 'application/json', 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    ...options,
  })
}

async function putMultipart<T = any>(url: string, body: FormData, options: RequestInit = {}): Promise<T> {
  const proxy = _replaceUrl(url)
  const authToken = await getToken()

  const request: any = {
    method: 'PUT',
    headers: { authorization: `Bearer ${authToken}` },
    body: body,
    ...options,
  }

  return _fetchWrapper(proxy, request)
}

async function deleteRequest<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const authToken = await getToken()
  const proxy = _replaceUrl(url)

  return _fetchWrapper(proxy, {
    method: 'DELETE',
    headers: { accept: 'application/json', 'content-type': 'application/json', authorization: `Bearer ${authToken}` },
    ...options,
  })
}

async function upload<T = any>(url: string, file: File, options: RequestInit = {}): Promise<T> {
  const token = await getToken()
  const proxy = _replaceUrl(url)

  return _fetchWrapper(proxy, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: file,
    ...options,
  })
}

export default {
  get,
  post,
  put,
  delete: deleteRequest,

  postMultipart,
  putMultipart,

  upload,
}
