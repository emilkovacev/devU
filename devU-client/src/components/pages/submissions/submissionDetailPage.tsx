import React, {useEffect, useState} from 'react'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from '../errorPage/errorPage'
import RequestService from 'services/request.service'
import {Assignment, AssignmentProblem, Submission, SubmissionProblemScore, SubmissionScore} from 'devu-shared-modules'
import {Link, useParams} from 'react-router-dom'
import Button from '../../shared/inputs/button'
import TextField from '../../shared/inputs/textField'
import {useActionless} from 'redux/hooks'
import {SET_ALERT} from 'redux/types/active.types'


const SubmissionDetailPage = () => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [setAlert] = useActionless(SET_ALERT)
    
    const { submissionId, assignmentId, courseId } = useParams<{submissionId: string, assignmentId: string, courseId: string}>()
    const [submissionScore, setSubmissionScore] = useState<SubmissionScore | null>(null)
    const [submissionProblemScores, setSubmissionProblemScores] = useState(new Array<SubmissionProblemScore>())
    const [submission, setSubmission] = useState<Submission>()
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    const [assignment, setAssignment] = useState<Assignment>()

    const [showManualGrade, setToggleManualGrade] = useState(false)
    const [formData, setFormData] = useState({
        submissionId: submissionId,
        score: 0,
        feedback: '',
        releasedAt: "2024-10-05T14:48:00.00Z"
    })

    const fetchData = async () => {
        try {
            const submission = await RequestService.get<Submission>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/${submissionId}`)
            setSubmission(submission)

            const submissionScore = (await RequestService.get<SubmissionScore[]>(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores?submission=${submissionId}`)).pop() ?? null
            setSubmissionScore(submissionScore)

            const submissionProblemScores = await RequestService.get<SubmissionProblemScore[]>(`/api/course/${courseId}/assignment/${assignmentId}/submission-problem-scores/submission/${submissionId}`)
            setSubmissionProblemScores(submissionProblemScores)
            
            const assignment = await RequestService.get<Assignment>(`/api/course/${courseId}/assignments/${submission.assignmentId}`)
            setAssignment(assignment)

            const assignmentProblems = await RequestService.get<AssignmentProblem[]>(`/api/course/${courseId}/assignment/${assignment.id}/assignment-problems`)
            setAssignmentProblems(assignmentProblems)  

        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleClick = () => {
        setToggleManualGrade(!showManualGrade)
    }

    const handleChange = (value : string, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : value}))
    }

    const handleManualGrade = async () => {
        if (submissionScore) {
            // Update the submission score
            console.log('Submission Exists')
            await RequestService.put(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores/${submissionScore.id}`, formData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Submission Score Updated' })
            
            })
        }
        else {
            // Create a new submission score
            console.log('No Submission')
            await RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores`, formData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Submission Score Created' })
            })
        }
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    return(
        <PageWrapper>
            <Button onClick={handleClick}>Manually Grade</Button>

            {showManualGrade && (
                <div>
                    <TextField id="score" placeholder="Score" onChange={handleChange}/>
                    <TextField id="feedback" placeholder="Feedback" onChange={handleChange}/>
                    <Button onClick={handleManualGrade}>Submit</Button>
                </div>
            )}
            
            <h1>Submission Detail for {assignment?.name}</h1>
            <h2>Submission Grades:</h2>
            <table>
                {assignmentProblems.map(ap => (
                    <th>{ap.problemName} ({ap.maxScore})</th>
                ))}
                <th>Total Score</th>
                <tr>
                    {assignmentProblems.map(ap => (
                        <td>{submissionProblemScores.find(sps => sps.assignmentProblemId === ap.id)?.score ?? "N/A"}</td>
                    ))}
                    <td>{submissionScore?.score ?? "N/A"}</td>
                </tr>
            </table>
            <Link to={`/course/${courseId}/assignment/${assignmentId}/submission/${submissionId}/feedback`}>View
                Feedback</Link>
            <br/>
            
            <h2>Submission Content:</h2>
            <pre>{submission?.content}</pre>
        </PageWrapper>
    )
}

export default SubmissionDetailPage
