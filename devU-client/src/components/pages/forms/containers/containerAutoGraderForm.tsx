import React, {useState} from 'react'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import styles from './containerAutoGraderForm.scss'
import TextField from 'components/shared/inputs/textField'
import {useActionless} from 'redux/hooks'
import {SET_ALERT} from 'redux/types/active.types'
import RequestService from 'services/request.service'
import {ExpressValidationError} from "devu-shared-modules";
import {applyStylesToErrorFields, removeClassFromField} from "../../../../utils/textField.utils";
import textStyles from "../../../shared/inputs/textField.scss";
import {useHistory, useParams} from 'react-router-dom'

import Button from '@mui/material/Button'

const ContainerAutoGraderForm = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const {courseId, assignmentId} = useParams<{ courseId: string, assignmentId: string }>()
    const history = useHistory()
    const [graderFile, setGraderFile] = useState<File | null>()
    const [makefile, setMakefile] = useState<File | null>()
    const [formData,setFormData] = useState({
        assignmentId: assignmentId,
        autogradingImage: '',
        timeout: '',
    })
    const [invalidFields, setInvalidFields] = useState(new Map<string, string>())

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)
        setFormData(prevState => ({...prevState,[key] : value}))
    }
    //This is janky but it works and I'm too tired to come up with a better solution
    //this is done because the files need to be uniquely identified for multer to parse them from the multipart
    const handleGraderfileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setGraderFile(e.target.files?.item(0))
    }
    const handleMakefileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setMakefile(e.target.files?.item(0))
    }

    const handleSubmit = () => {

        const multipart = new FormData
        multipart.append('assignmentId', formData.assignmentId)
        multipart.append('autogradingImage', formData.autogradingImage)
        multipart.append('timeout', String(formData.timeout))
        if (graderFile) multipart.append('graderFile', graderFile)
        if (makefile) multipart.append('makefileFile', makefile)

        RequestService.postMultipart(`/api/course/${courseId}/assignment/${assignmentId}/container-auto-graders/`, multipart)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Container Auto-Grader Added' })
                history.goBack()
            })
        .catch((err: ExpressValidationError[] | Error) => {
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            const newFields = applyStylesToErrorFields(err, formData, textStyles.errorField)
            setInvalidFields(newFields)

            setAlert({autoDelete: false, type: 'error', message: message})
        }).finally(() => {
        })


        setFormData({
            assignmentId: assignmentId,
            autogradingImage: '',
            timeout: '',
        })
    }

    return(
        <PageWrapper>
            <h1>Container Auto Grader Form</h1>
            <div className = {styles.form}>
                <p>Required Field *</p>

                <label htmlFor='autogradingImage'>Autograding Image *</label>
                <TextField id='autogradingImage' onChange={handleChange}
                           value={formData.autogradingImage}
                           className={invalidFields.get('autogradingImage')}></TextField>

                <label htmlFor='timeout'>Timeout *</label>
                <TextField id='timeout' onChange={handleChange} value={formData.timeout}
                           className={invalidFields.get('timeout')}></TextField>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <label htmlFor="graderFile">Graderfile *</label>
                    <input type="file" id='graderFile'  onChange={handleGraderfileChange} /> <br/>
                </div>

                <br/>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <label htmlFor="makefileFile">Makefile *</label>
                    <input type="file" id='makefileFile' onChange={handleMakefileChange} /> <br/>
                </div>

                <br/>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained' onClick= { handleSubmit } >Add Problem</Button>
                </div>
            </div>
            <div className = {styles.rightColumn}>
                <h1>Existing Problems</h1>
            </div>
        </PageWrapper>
    )
}

export default ContainerAutoGraderForm