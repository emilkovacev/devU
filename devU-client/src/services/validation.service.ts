const REQUIRED_ERROR = 'Required field'
const NOT_A_NUMBER = 'Expected a number'
const INVALID_EMAIL = 'Invalid email'
const INVALID_DATE = 'Invalid date'

export type Field = {
  name: string
  required?: boolean
  type: 'email' | 'string' | 'number' | 'boolean' | 'datetime'
  customValidator?: (v: any) => string
}

export type Validator = {
  errors: string[]
  isValid: boolean
}

function emailValidator(value: any): string {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!re.test(String(value).toLowerCase())) return INVALID_EMAIL

  return ''
}

//@ts-ignore
function stringValidator(value: any): string {
  return ''
}

function numberValidator(value: any): string {
  if (isNaN(parseInt(value))) return NOT_A_NUMBER
  return ''
}

function booleanValidator(value: any): string {
  if (!value) return REQUIRED_ERROR
  return ''
}

function datetimeValidator(value: any): string {
  if (!value) return REQUIRED_ERROR
  if (typeof value === 'number') return INVALID_DATE
  if (isNaN(Date.parse(value))) return INVALID_DATE

  return ''
}

function validate(formData: any = {}, formOptions: Field[]): Validator {
  const errors: any = {}

  for (const field of formOptions) {
    const fieldValue = formData[field.name]

    if (field.required && !fieldValue) {
      errors[field.name] = REQUIRED_ERROR
      continue
    }

    let fieldErrors = ''

    if (field.type === 'email') fieldErrors += emailValidator(fieldValue)
    else if (field.type === 'string') fieldErrors += stringValidator(fieldValue)
    else if (field.type === 'number') fieldErrors += numberValidator(fieldValue)
    else if (field.type === 'boolean') fieldErrors += booleanValidator(fieldValue)
    else if (field.type === 'datetime') fieldErrors += datetimeValidator(fieldValue)

    if (field.customValidator) fieldErrors += field.customValidator(fieldValue)

    if (fieldErrors) errors[field.name] = fieldErrors
  }

  return {
    isValid: !Object.keys(errors).length,
    errors,
  }
}

export default validate
