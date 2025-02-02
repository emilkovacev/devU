import React, { useState, useEffect } from 'react'

import {TextField as MuiTextField} from '@mui/material'
import { SxProps, Theme } from '@mui/material'

import { getCssVariables } from 'utils/theme.utils'
import styles from './textField.scss'

type Props = {
  type?: 'text' | 'email' | 'password' | 'search'
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  className?: string
  placeholder?: string
  id?: string
  disabled?: boolean
  defaultValue?: string
  value?: string
  invalidated?: boolean
  helpText?: string
  variant?: 'outlined' | 'standard' | 'filled'
  sx?: SxProps<Theme>
  multiline?: boolean
  rows?: number
}

const TextField = ({
  onChange,
  className = '',
  label,
  placeholder,
  id,
  disabled,
  defaultValue,
  value,
  invalidated,
  helpText,
  variant = 'outlined',
  sx,
  multiline,
  rows,
}: Props) => {
  const [theme, setTheme] = useState(getCssVariables())

  // Needs a custom observer to force an update when the css variables change
  // Custom observer will update the theme variables when the bodies classes change
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getCssVariables()))

    observer.observe(document.body, { attributes: true })

    return () => observer.disconnect()
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.value, e)
  }

  // const { textColor } = theme

  return (
    <div className={`${styles.textField} ${className}`}>
      <MuiTextField {...invalidated && {error: true}}
                    disabled={disabled}
                    helperText={helpText}
                    id={id}
                    className={styles.input}
                    placeholder={placeholder}
                    variant={variant}
                    label={label}
                    defaultValue={defaultValue}
                    value={value}
                    onChange={handleChange}
                    sx={{
                      ...sx,
                      // input field text
                      "& .MuiOutlinedInput-input" : {
                        color: theme.textColor,
                        backgroundColor: theme.inputFieldBackground,
                        borderRadius: '10px',
                        // padding: '0.625rem 1rem',
                        marginBottom: '0px'
                      },
                      // label text
                      "& .MuiInputLabel-outlined" : {
                        color: theme.inputFieldLabel,
                        "&.Mui-focused": {
                          color: theme.focus, // Define this color in your theme
                        },
                      },
                      // border
                      "& .MuiOutlinedInput-notchedOutline" : {
                        border: 'none',
                      },

                    }}
                    {...multiline && { multiline: true }}
                    {...multiline && rows && { minRows: rows }}
                    {...multiline && rows && { maxRows: rows }}
                    />
    </div>
  )
}

export default TextField
