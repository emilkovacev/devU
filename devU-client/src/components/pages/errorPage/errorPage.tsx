import React from 'react'
import PageWrapper from 'components/shared/layouts/pageWrapper'

import styles from './errorPage.scss'

type Props = {
  error: Error | null
}

const ErrorPage = ({ error }: Props) => (
  <PageWrapper>
    <div className={styles.errorBackground}>
      <div className={styles.errorContainer}>
        <h1 className={styles.error}>Error</h1>
        <p className={styles.errorMessage}>{error?.message || 'Something went wrong'}</p>
      </div>
    </div>
  </PageWrapper>
)

export default ErrorPage
