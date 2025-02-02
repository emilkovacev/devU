import config from 'config'

type Keys = {
  privateKey: string
  publicKey: string
}

type Certificate = {
  certificate: string
  privateKey: string
}

type Saml = {
  name: string
  enabled: boolean
  attributeMap: Record<string, string>
  entryPoint: string
  idpCerts: string[]
  encryption: Certificate
  signing: Certificate
  acceptedClockSkewSeconds: number
}

type DevAuth = {
  enabled: boolean
}

type Providers = {
  saml: Saml
  devAuth: DevAuth
}

function load(path: string): any {
  if (!config.has(path)) return false

  return config.get(path)
}

const scheme = (load('api.scheme') || 'http') as string
const host = (load('api.host') || 'localhost') as string
const port = (process.env.PORT || load('api.port') || 3001) as number

const apiUrl = `${scheme}://${host}:${port}`

// prettier-ignore
const refreshTokenExp = load('auth.jwt.refreshTokenValiditySeconds') || 864000
const accessTokenExp = load('auth.jwt.accessTokenValiditySeconds') || 600
const refreshTokenBuffer = load('auth.jwt.refreshTokenExpirationBufferSeconds') || 864000

// if the dev env exists then file is running inside docker
// if it is undefined it is running on dev machine
const isDocker = !(process.env.IS_DOCKER === undefined)

if (isDocker && process.env.TANGO_KEY === undefined) {
  throw Error(
    'Tango key not found.\nMake sure to set environment variable TANGO_KEY in the api service in docker-compose'
  )
}

const environment = {
  port,
  apiUrl,
  clientUrl: (process.env.CLIENT_URL || load('api.clientUrl') || 'http://localhost:9000') as string,

  // Database settings
  dbHost: isDocker ? load('database.host') : ('localhost' as string),
  dbUsername: (load('database.username') || 'typescript_user') as string,
  dbPassword: (load('database.password') || 'password') as string,
  database: (load('database.name') || 'typescript_api') as string,
  // environment info
  isDocker: isDocker,
  // the below one is for local migration, due to some issues with command will not running load function nor 'localhost'

  // dbHost: ('localhost') as string,
  // dbUsername: ('typescript_user') as string,
  // dbPassword: ('password') as string,
  // database: ('typescript_api') as string,

  // MinIO setting
  minioHost: isDocker ? load('minio.host') : ('localhost' as string),
  minioPort: isDocker ? load('minio.port') : (9002 as number),
  minioUsername: (load('minio.username') || 'typescript_user') as string,
  minioPassword: (load('minio.password') || 'changeMe') as string,

  // Logging
  logDB: (process.env.LOG_DB !== undefined || load('logging.db')) as boolean, // logs all sql commands for gut/fact checking endpoints

  // Auth Settings
  activeKeyId: config.get('auth.jwt.activeKeyId') as string,
  keys: config.get('auth.jwt.keys') as Record<string, Keys>,
  accessTokenValiditySeconds: parseInt(accessTokenExp),
  refreshTokenValiditySeconds: parseInt(refreshTokenExp),
  refreshTokenExpirationBufferSeconds: parseInt(refreshTokenBuffer),

  // BE CAREFUL WITH PROVIDERS - THEY'RE NOT TOTALLY TYPE SAFE UNLESS PROPERLY CONFIGURED
  providers: config.get('auth.providers') as Providers
}

export default environment
