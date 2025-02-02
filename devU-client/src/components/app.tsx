import React, { useState, useEffect } from 'react'
import { Router } from 'react-router-dom'

import { useActionless } from 'redux/hooks'
import { SET_USER } from 'redux/types/user.types'

import Alert from 'components/shared/alerts/alert'
import AuthenticatedRouter from 'components/authenticatedRouter'
import AuthProvider from 'components/pages/authProvider'
import ErrorPage from 'components/pages/errorPage/errorPage'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'

import history from 'services/history.service'

import fetchUser from 'utils/fetchUser.utils'
import { initializeTheme } from 'utils/theme.utils'

const App = () => {
  const [setUser] = useActionless(SET_USER)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    initializeTheme() // Sets the default state for darkMode

    fetchUser()
      .then(setUser)
      .then(() => setAuthenticated(true))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingOverlay delay={100} />
  if (!authenticated) return <AuthProvider />
  if (error) return <ErrorPage error={error} />

  return (
    <Router history={history}>
      <Alert />
      <AuthenticatedRouter />
    </Router>
  )
}

export default App
