import React from 'react'
import {Link} from 'react-router-dom'

import styles from './listItemWrapper.scss'

import ColorHash from 'color-hash'

type Props = {
  to: any
  children: React.ReactNode
  tag?: string
  className?: string
  tagStyle?: string
  containerStyle?: string
}


const colorHash = (input: string) => {
  const hash = new ColorHash({ hue: { min: 90, max: 270 } })

  return hash.hex(input)
}

const ListItemWrapper = ({to, children, tag, className = '', tagStyle, containerStyle}: Props) => (
    <Link to={to} className={containerStyle ? containerStyle : styles.container}>
      {tag && <div className={tagStyle ? tagStyle : styles.tag} style={{backgroundColor: colorHash(tag)}}></div>}
    <div className={className}>{children}</div>
  </Link>
)

export default ListItemWrapper
