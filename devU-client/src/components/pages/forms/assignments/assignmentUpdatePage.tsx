import React, { useEffect, useState } from 'react'
import { ExpressValidationError, Assignment, AssignmentProblem } from 'devu-shared-modules'
import 'react-datepicker/dist/react-datepicker.css'
import { useHistory, useParams } from 'react-router-dom'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import RequestService from 'services/request.service'
import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import Button from '../../../shared/inputs/button'
import styles from './assignmentUpdatePage.scss'
import DragDropFile from 'components/utils/dragDropFile'
import { SET_ALERT } from 'redux/types/active.types'
import { applyMessageToErrorFields, removeClassFromField } from 'utils/textField.utils'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { getCssVariables } from 'utils/theme.utils'

type UrlParams = { assignmentId: string }

const AssignmentUpdatePage = () => {
  const { assignmentId } = useParams() as UrlParams
  const { courseId } = useParams<{ courseId: string }>()
  const [setAlert] = useActionless(SET_ALERT)
  const [currentAssignmentId, setCurrentAssignmentId] = useState(parseInt(assignmentId))
  const [assignmentsList, setAssignmentsList] = useState<Assignment[]>([])
  const [assignmentProblems, setAssignmentProblems] = useState<AssignmentProblem[]>([])
  const [allAssignmentProblems, setAllAssignmentProblems] = useState<Map<number, AssignmentProblem[]>>(new Map<number, AssignmentProblem[]>())
  const [invalidFields, setInvalidFields] = useState(new Map<string, string>())
  const [openModal, setOpenModal] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const history = useHistory()

  const [theme, setTheme] = useState(getCssVariables())

  // Needs a custom observer to force an update when the css variables change
  // Custom observer will update the theme variables when the bodies classes change
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getCssVariables()))

    observer.observe(document.body, { attributes: true })

    return () => observer.disconnect()
  })

  const [formData, setFormData] = useState<Assignment>({
    courseId: parseInt(courseId),
    name: '',
    categoryName: '',
    description: '',
    maxFileSize: 0,
    maxSubmissions: 0,
    disableHandins: false,
    dueDate: '',
    endDate: '',
    startDate: '',
  })

  const [assignmentProblemData, setAssignmentProblemData] = useState<AssignmentProblem>({
    assignmentId: currentAssignmentId,
    problemName: '',
    maxScore: -1,
  })

  const handleOpenModal = (problem : AssignmentProblem) => {
    if(problem === assignmentProblemData) {
      setOpenModal(true)
    } else {    
      setAssignmentProblemData(problem)
    }
  }
  const handleCloseModal = () => {setOpenModal(false)}
  useEffect(() => {
    if (assignmentProblemData.maxScore !== -1) { setOpenModal(true) }
  }, [assignmentProblemData])

  const handleChange = (value: String, e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id
    const newInvalidFields = removeClassFromField(invalidFields, key)
    setInvalidFields(newInvalidFields)

    setFormData(prevState => ({ ...prevState, [key]: value }))
  }
  const handleProblemChange = (value: String, e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id
    setAssignmentProblemData(prevState => ({ ...prevState, [key]: value }))
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, disableHandins: e.target.checked }))}
  const handleStartDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, startDate: e.target.value }))}
  const handleEndDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, endDate: e.target.value }))}
  const handleDueDateChange = (e : React.ChangeEvent<HTMLInputElement>) => {setFormData(prevState => ({ ...prevState, dueDate: e.target.value }))}

  const handleFile = (file: File) => {
    if(files.length < 5) {
      setFiles([...files, file])
    }
  }

  const fetchAssignmentProblems = () => {
    RequestService.get(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems`)
      .then((res) => { setAssignmentProblems(res) })
  }

  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignments/${assignmentId}`).then((res) => { setFormData(res) })}, [])
  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems`).then((res) => { setAssignmentProblems(res) })}, [])
  useEffect(() => {RequestService.get(`/api/course/${courseId}/assignments`).then((res) => { setAssignmentsList(res) })}, [])
  useEffect(() => {
    for(let i : number = 0; i < assignmentsList.length; i++) {
      RequestService.get(`/api/course/${courseId}/assignment/${assignmentsList[i].id}/assignment-problems`)
      .then((res) => {
        setAllAssignmentProblems(prevState => {
          const newMap = new Map(prevState);
          newMap.set(Number(assignmentsList[i].id), res);
          return newMap;
        });
      })
    }
  },[assignmentsList])

  const handleAssignmentUpdate = () => {
    const finalFormData = {
      courseId: formData.courseId,
      name: formData.name,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      endDate: formData.endDate,
      categoryName: formData.categoryName,
      description: formData.description,
      maxFileSize: formData.maxFileSize,
      maxSubmissions: formData.maxSubmissions,
      disableHandins: formData.disableHandins,
    }

    const multipart = new FormData()
    multipart.append('courseId', finalFormData.courseId.toString())
    multipart.append('name', finalFormData.name)
    multipart.append('startDate', finalFormData.startDate)
    multipart.append('dueDate', finalFormData.dueDate)
    multipart.append('endDate', finalFormData.endDate)
    multipart.append('categoryName', finalFormData.categoryName)
    if(finalFormData.description !== null) {
      multipart.append('description', finalFormData.description)
    }
    multipart.append('maxFileSize', finalFormData.maxFileSize.toString())
    if(finalFormData.maxSubmissions !== null) {
      multipart.append('maxSubmissions', finalFormData.maxSubmissions.toString())
    }
    multipart.append('disableHandins', finalFormData.disableHandins.toString())
    
    for(let i = 0; i < files.length; i++) {
      multipart.append('files', files[i])
    }

    RequestService.putMultipart(`/api/course/${courseId}/assignments/${currentAssignmentId}`, multipart)
      .then(() => {
        setAlert({ autoDelete: true, type: 'success', message: 'Assignment Updated' })
        history.goBack()
      })
      .catch((err: ExpressValidationError[] | Error) => {
        const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
        const newFields = new Map<string, string>()
        Array.isArray(err) ? err.map((e) => applyMessageToErrorFields(newFields, e.param, e.msg)) : newFields
        setInvalidFields(newFields)
        setAlert({ autoDelete: false, type: 'error', message })
      })
      .finally(() => {
      })
  }

  const handleProblemUpdate = () => {
    const finalFormData = {
      assignmentId: assignmentProblemData.assignmentId,
      problemName: assignmentProblemData.problemName,
      maxScore: assignmentProblemData.maxScore,
    }

    RequestService.put(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems/${assignmentProblemData.id}`, finalFormData)
      .then(() => {
        setAlert({ autoDelete: true, type: 'success', message: 'Problem Updated' })
        setOpenModal(false)
        fetchAssignmentProblems()
    })
  }

  const handleAssignmentChange = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const assignmentDetails = assignmentsList.find((assignment) => assignment.id === parseInt(e.currentTarget.id))
    if (assignmentDetails !== undefined && assignmentDetails.id !== undefined) {
      setAssignmentProblems(allAssignmentProblems.get(assignmentDetails.id) || [])
      setCurrentAssignmentId(assignmentDetails.id)
    } 
    if (assignmentDetails !== undefined) {
      setFormData(assignmentDetails)
    }
  }

  const [addProblemModal, setAddProblemModal] = useState(false)
  const [addProblemForm, setAddProblemForm] = useState({
    assignmentId: currentAssignmentId,
    problemName: '',
    maxScore: 0,
  })
  const openAddProblemModal = () => {setAddProblemModal(true)}
  const handleCloseAddProblemModal = () => {setAddProblemModal(false)}

  const handleAddProblemChange = (value: String, e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.id
    setAddProblemForm(prevState => ({ ...prevState, [key]: value }))
  }
  const handleAddProblem = () => {
    RequestService.post(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems`, addProblemForm)
      .then(() => {
        setAlert({ autoDelete: true, type: 'success', message: 'Problem Added' })
        setAddProblemModal(false)
        setAddProblemForm({
          assignmentId: currentAssignmentId,
          problemName: '',
          maxScore: 0,
        })
        fetchAssignmentProblems()
    })
  }

  const handleDeleteProblem = (problemId: number) => {
    RequestService.delete(`/api/course/${courseId}/assignment/${currentAssignmentId}/assignment-problems/${problemId}`)
      .then(() => {
        setAlert({ autoDelete: true, type: 'success', message: 'Problem Deleted' })
        fetchAssignmentProblems()
    })
  }
  
  return (

    <PageWrapper className={styles.pageWrapper}>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogContent sx={{bgcolor:theme.listItemBackground}}>
        <h3 className={styles.header}>Edit Problem</h3>
          <TextField id="problemName" label={'Problem Name'} onChange={handleProblemChange} value={assignmentProblemData ? assignmentProblemData.problemName : ''}/>
          <TextField id="maxScore" label={'Max Score'} onChange={handleProblemChange} value={assignmentProblemData ? assignmentProblemData.maxScore.toString() : ''}/>
          <DialogActions>
            <Button onClick={handleProblemUpdate}>Save</Button>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={addProblemModal} onClose={handleCloseAddProblemModal}>
        <DialogContent sx={{bgcolor:theme.listItemBackground}}>
          <h3 className={styles.header}>Add Problem</h3>
          <TextField id="problemName" label={'Problem Name'} onChange={handleAddProblemChange}/>
          <TextField id="maxScore" label={'Max Score'} onChange={handleAddProblemChange}/>
          <DialogActions>
            <Button onClick={handleAddProblem}>Add</Button>
            <Button onClick={handleCloseAddProblemModal}>Close</Button>
        </DialogActions>
        </DialogContent>
      </Dialog>

      <h2>Edit Assignment</h2>
      <div className={styles.grid}>
        <div className={styles.assignmentsList}>
          <h2 className={styles.header}>Assignments</h2>
          {assignmentsList.map((assignment) => (
            <div id={assignment.id ? assignment.id.toString() : ''} key={assignment.id} className={styles.assignment} onClick={handleAssignmentChange}>
              <Button className={styles.assignmentBtn}>{assignment.name}</Button>
            </div>
          ))} 
        </div>
        <div className={styles.form}>
          <h2 className={styles.header}>Assignment Information</h2>
          <br/>
          <div className={styles.textFieldContainer}>
            <TextField id="name" onChange={handleChange} label={'Assignment Name'}
                      invalidated={!!invalidFields.get('name')} helpText={invalidFields.get('name')}
                      className={styles.textField}
                      value={formData.name} 
                      sx={{width : 8/10 ,marginRight : 1/10}}/>

            <TextField id="categoryName" onChange={handleChange} label={'Category Name*'}
                      invalidated={!!invalidFields.get('categoryName')}
                      className={styles.textField}
                      helpText={invalidFields.get('categoryName')}
                      value={formData.categoryName} 
                      sx={{width : 8/10, marginLeft : 1/10}}/>
          </div>

          <TextField id="description" onChange={handleChange} label={'Description*'} multiline={true} rows={5}
                    invalidated={!!invalidFields.get('description')}
                    className={styles.textField}
                    helpText={invalidFields.get('description')}
                    value={formData.description ? formData.description : ''} 
                    sx={{width : 9/10, 
                      "& .MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputMultiline.css-1sqnrkk-MuiInputBase-input-MuiOutlinedInput-input": {padding : "15px"},
                      "& .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-multiline.css-dpjnhs-MuiInputBase-root-MuiOutlinedInput-root" : {padding : "0px"},
                    }}/>

          <div className={styles.textFieldContainer}>
            <TextField id="maxFileSize" onChange={handleChange} label={'Max File Size'}
                      invalidated={!!invalidFields.get('maxFileSize')}
                      className={styles.textField}
                      helpText={invalidFields.get('maxFileSize')}
                      value={formData.maxFileSize ? formData.maxFileSize.toString() : ''} 
                      sx={{width : 8/10, marginLeft : 1/10}}/>

            <TextField id="maxSubmissions" onChange={handleChange} label={'Max Submission'}
                      invalidated={!!invalidFields.get('maxSubmission')}
                      className={styles.textField}
                      helpText={invalidFields.get('maxSubmission')}
                      value={formData.maxSubmissions ? (formData.maxSubmissions).toString() : ''} 
                      sx={{width : 8/10, marginLeft : 1/10}}/>
          </div>
    
          <br />

          <div className={styles.datepickerContainer}>
            <div>
              <label htmlFor="start_date">Start Date *</label>
              <br/>
              <input type='date' id="start_date" value={formData.startDate.split("T")[0]} onChange={handleStartDateChange}/>
            </div>
            <div>
              <label htmlFor="due_date">Due Date *</label>
              <br/>
              <input type='date' id="due_date" value={formData.dueDate.split("T")[0]} onChange={handleDueDateChange}/>
            </div>
            <div>
              <label htmlFor="end_date">End Date *</label>
              <br/>
              <input type='date' id="end_date" value={formData.endDate.split("T")[0]} onChange={handleEndDateChange}/>
            </div>
          </div>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <label htmlFor="disableHandins">Disable Handins</label>
            <input type="checkbox" id="disableHandins" checked={formData.disableHandins}
                  onChange={handleCheckbox} className={styles.submitBtn} />
          </div>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleAssignmentUpdate} className={styles.submitBtn}>Update
              assignment</Button>
          </div>
          <br/>
        </div>
        <div className={styles.problemsList}>
          <h2 className={styles.header}>Problems</h2>
          {assignmentProblems.map((problem, index) => (
            <div key={problem.id} className={styles.problem}>
              <h3 style={{marginRight : '20px'}}>{`Problem ${index + 1}`}</h3>
              <Button className={styles.editProblem} onClick={() => { if (problem !== undefined) { handleOpenModal(problem) } }}>Edit</Button>
              <Button className={styles.deleteButton} onClick={() => { if (problem !== undefined && problem.id !== undefined) { handleDeleteProblem(problem.id) } }}>Delete</Button>
            </div>
          ))}
          <Button onClick={openAddProblemModal} className={styles.button}>Add Problem</Button>
        </div>
        <div className={styles.attachments}>
          <h2 className={styles.header}>Attachments</h2>
          <DragDropFile handleFile={handleFile} className='formFileUploadWide'/>
          <br/>
          <div className={styles.fileList}>
            <p>Files: </p>
            {files.map((file, index) => (
              <div key={index}>
                <p>{`${file.name}, `}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default AssignmentUpdatePage
