import React from 'react'
import {Link} from 'react-router-dom'

import DarkModeToggle from 'components/utils/darkModeToggle'
import FaIcon from 'components/shared/icons/faIcon'
import UserOptionsDropdown from 'components/utils/userOptionsDropdown'


import styles from './globalToolbar.scss'

import RoleDispatcher from '../utils/roleDispatcher'

const GlobalToolbar = () => {
 
  return (
    <div className={styles.bar}>
      <Link to='/' className={styles.header}>
        DevU
      </Link>
      <div className={styles.controls}>
        <div className={styles.sidebar}>
          {/* Not visable on smaller screens. Cannot use <FaIconButton /> because it requires a onClick. */}
          <button className={styles.hamburger} aria-label='menu'>
            <FaIcon icon='bars' />
          </button>
          {/* Turns into a sidebar via css on mobile */}
          <div className={styles.menu}>
            <RoleDispatcher/>
            <DarkModeToggle />
            {
            <Link to={`/courses`} className={styles.link} >
              Join a Course
            </Link>
            }     
            {/*<Link to={`/myCourses`} className={styles.link}>*/}
            {/*  My Courses*/}
            {/*</Link>*/}
            {/* <Link to={`/submissions`} className={styles.link}>
              Submissions
            </Link> */}
          </div>
        </div>
        <UserOptionsDropdown />
      </div>
    </div>
  )
}

export default GlobalToolbar
