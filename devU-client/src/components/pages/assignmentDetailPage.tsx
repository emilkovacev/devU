import React,{ useState, useEffect } from 'react'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import { AssignmentProblem, ExpressValidationError } from 'devu-shared-modules'
import RequestService from 'services/request.service'
import ErrorPage from './errorPage'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import { useAppSelector,useActionless } from 'redux/hooks'
import { SET_ALERT } from 'redux/types/active.types'

const AssignmentDetailPage = (props: any) => {
    const [setAlert] = useActionless(SET_ALERT)
    const { state } = props.location
    const userId = useAppSelector((store) => store.user.id)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    
    useEffect(() => {
          fetchData()
    }, [])

    const fetchData = async () => {
         try {
             const data = await RequestService.get(`/api/assignment-problems/${state.id}`)
             setAssignmentProblems(data)
         }catch(error){
             setError(error)
         }finally{
             setLoading(false)
         }
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    const handleChange = (value : string, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : value}))
    }

    const handleSubmit = () => {
        const contentField = {
            files : [],
            form : formData,
        }

        const submission = {
            userId : userId,
            assignmentId : state.id,
            courseId : state.courseId,
            content : JSON.stringify(contentField),
        }

        setLoading(true)

        RequestService.post('/api/submissions', submission)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Submission Sent' })
            })
            .catch((err: ExpressValidationError[] | Error) => {
                const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message

                setAlert({ autoDelete: false, type: 'error', message })
            })
            .finally(() => setLoading(false))
    }

    return(
        <PageWrapper>
            <h1>Assignment Detail</h1>
            {assignmentProblems.map(assignmentProblem => (
                <div>
                    <h1>{assignmentProblem.problemName}</h1>
                    <TextField id={assignmentProblem.problemName} label='Answer' onChange={handleChange} />
                </div>
            ))}
            <Button onClick={handleSubmit}>Submit</Button>
        </PageWrapper>
    )
}
export default AssignmentDetailPage
