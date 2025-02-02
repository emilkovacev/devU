import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { User } from 'devu-shared-modules'

import { useActionless } from 'redux/hooks'
import { UPDATE_USER } from 'redux/types/user.types'

import RequestService from 'services/request.service'

import ErrorPage from 'components/pages/errorPage/errorPage'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import EditUserForm from 'components/forms/editUserForm'

import styles from './userDetailPage.scss'

type UrlParams = {
  userId: string
}

const UserDetailPage = ({}) => {
  const { userId } = useParams() as UrlParams
  const [updateUser] = useActionless(UPDATE_USER)

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({} as User)
  const [error, setError] = useState(null)

  useEffect(() => {
    RequestService.get<User>(`/api/users/${userId}`)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingOverlay delay={250} />
  if (error) return <ErrorPage error={error} />

  return (
    <PageWrapper className={styles.container}>
      <EditUserForm user={user} onSubmit={updateUser} />
    </PageWrapper>
  )
}

export default UserDetailPage
