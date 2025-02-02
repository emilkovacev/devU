import React from 'react'
import {Link} from 'react-router-dom'

import FaIcon from 'components/shared/icons/faIcon'

import {useAppSelector} from 'redux/hooks'

import RequestService from 'services/request.service'

import styles from './userOptionsDropdown.scss'

const UserOptionsDropdown = () => {
  const name = useAppSelector((state) => state.user.preferredName || state.user.email)
  const userId = useAppSelector((state) => state.user.id)

  const handleLogout = async () => {
    // Clears refreshToken httpOnly cookie - requires cookie credentials to be included for them to be reset
    // window.location.reload is not a normal function an cannot be invoked within a function chain
    RequestService.get(`/api/logout`, { credentials: 'include' }, true).finally(() => window.location.reload())
  }

  return (
    // Tab index here allows this dropdown to work in safari
    <div className={styles.dropdown} tabIndex={1}>
      {/* Opening and closing dropdown handled via CSS -  unfocusing dropdown will force close*/}
      <button className={styles.trigger}>
        {/* Name vs icon dislpay controlled via CSS */}
        <label className={styles.name}>{name}</label>
        <FaIcon icon='user-circle' className={styles.userIcon} />
        <FaIcon icon='caret-down' className={styles.caret} />
      </button>

      {/* Menu open closed controlled via CSS */}
      <div className={styles.menu}>
        <Link to={`/user/${userId}/update`} className={styles.option}>
          Account
        </Link>
        <button onClick={handleLogout} className={styles.option}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default UserOptionsDropdown
