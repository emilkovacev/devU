import React, { useState} from 'react'
import {ExpressValidationError} from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'
import {useHistory, useParams} from 'react-router-dom'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'

import {useActionless} from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from '@mui/material/Button'
import formStyles from './assignmentFormPage.scss'

import {SET_ALERT} from 'redux/types/active.types'
import styles from 'components/shared/inputs/textField.scss'
import { applyStylesToErrorFields, removeClassFromField} from 'utils/textField.utils'




const AssignmentProblemFormPage = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const { courseId, assignmentId } = useParams<{courseId : string ;assignmentId : string}>()
    const history = useHistory()
    const [FormData,setFormData] = useState({
        assignmentId: assignmentId,
        problemName: '',
        maxScore: '',
    })

    const [InvalidFields, setnvalidFields] = useState(new Map<string, string>())

    const handleProblemChange = (value : String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        const newInvalidFields = removeClassFromField(InvalidFields, key)
        setnvalidFields(newInvalidFields)
        setFormData(prevState => ({...prevState,[key] : value}))
    }
    
    const handleSubmit = () => {
        const finalProblemFormData = {
            assignmentId: parseInt(FormData.assignmentId),
            problemName: FormData.problemName,
            maxScore: parseInt(FormData.maxScore),
        }
        RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems/`, finalProblemFormData)
        .then(() => {
            setAlert({ autoDelete: true, type: 'success', message: 'Assignment Problem Added' })
            history.goBack()
        })
        .catch((err: ExpressValidationError[] | Error) => {
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            const newFields = applyStylesToErrorFields(err, FormData, styles.errorField)

            setnvalidFields(newFields)
            setAlert({ autoDelete: false, type: 'error', message })
        })
        .finally(() => {
            setFormData({
                assignmentId: assignmentId,
                problemName: '',
                maxScore: '',
            })
        })
    }

    return(<PageWrapper>
            <div className={formStyles.header}>
                <div className={formStyles.smallLine}></div>
                <h1>Assignment Detail Update</h1>
                <div className={formStyles.largeLine}></div>
            </div>
            <div className={formStyles.form}>
                    <label htmlFor='problemName'>Problem Question *</label>
                    <TextField id='problemName' onChange={handleProblemChange}
                               value={FormData.problemName}
                               className={InvalidFields.get('problemName')}/>

                    <label htmlFor='maxScore'>Max Score *</label>
                    <TextField id='maxScore' onChange={handleProblemChange}
                               value={FormData.maxScore}
                               className={InvalidFields.get('maxScore')}/>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant='contained' onClick={handleSubmit} className={formStyles.submitBtn}>Create Problem</Button>
                    </div>
                </div>
        </PageWrapper>)
}

export default AssignmentProblemFormPage