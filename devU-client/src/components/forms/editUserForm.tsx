import React, { useState } from 'react'

import { User, ExpressValidationError } from 'devu-shared-modules'

import { useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'

import RequestService from 'services/request.service'

import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'

type Props = {
  user: User
  onSubmit?: (user: User) => void
}

const EditUserForm = ({ user, onSubmit }: Props) => {
  const [setAlert] = useActionless(SET_ALERT)

  const [formData, setFormData] = useState<User>(user)
  const [loading, setLoading] = useState(false)

  const handleUpdatePreferredName = (preferredName: string) => setFormData({ ...formData, preferredName })

  const handleSubmit = () => {
    setLoading(true)

    RequestService.put(`/api/users/${user.id}`, formData)
      .then(() => {
        if (onSubmit) onSubmit(formData)

        setAlert({ autoDelete: true, type: 'success', message: 'User Preferences Updated' })
      })
      .catch((err: ExpressValidationError[] | Error) => {
        const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message

        setAlert({ autoDelete: false, type: 'error', message })
      })
      .finally(() => setLoading(false))
  }

  return (
    <div>
      <h1>User Information</h1>
      <TextField
        onChange={handleUpdatePreferredName}
        label='Preferred Name'
        id='preferredName'
        defaultValue={user.preferredName}
      />
      <TextField type='email' label="Email" id='email' placeholder={user.email} disabled={true} />
      <TextField label='Person Number' id='externalId' placeholder={user.externalId} disabled={true} />
      <Button onClick={handleSubmit} loading={loading}>
        Update
      </Button>
    </div>
  )
}

export default EditUserForm
