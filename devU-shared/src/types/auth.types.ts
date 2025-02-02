// Shape of response when requesting access token
export type Token = {
  accessToken: string
}

// Shape of provider options (when selecting login options)
export type AuthProvider = {
  name: string
  route: string
  description: string
  method: 'get' | 'post'
  body?: string[]
}

// Will be applied to middleware for use in authenticated endpoints
export type AccessToken = { userId: number; email: string } & JWTClaims
export type RefreshToken = { userId: number; isRefreshToken: true } & JWTClaims

type JWTClaims = {
  iat?: number
  exp?: number
  aud?: string[]
  iss?: string
  sub?: string
}
