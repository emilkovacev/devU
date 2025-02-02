import React, {useEffect, useState} from 'react'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from '../errorPage/errorPage'
import RequestService from 'services/request.service'
import {Assignment, AssignmentProblem, Submission, SubmissionProblemScore,SubmissionScore} from 'devu-shared-modules'
import { useParams,/*useHistory*/} from 'react-router-dom'
import Button from '../../shared/inputs/button'
import TextField from '../../shared/inputs/textField'
import {useActionless} from 'redux/hooks'
import {SET_ALERT} from 'redux/types/active.types'
import styles from './submissionDetailPage.scss'
import 'react-datepicker/dist/react-datepicker.css'
//import Card from '@mui/material/Card'
//import CardContent from '@mui/material/CardContent'
import {CardActionArea} from '@mui/material'
import {prettyPrintDateTime} from "../../../utils/date.utils";
//import React, { useState } from 'react';
//import { Document, Page } from 'react-pdf';
//import StickyNote from 'react-sticky-notes';
import { useHistory } from 'react-router-dom'


const SubmissionDetailPage = () => {
   // const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [setAlert] = useActionless(SET_ALERT)
    const history = useHistory()
    
    const { submissionId, assignmentId, courseId } = useParams<{submissionId: string, assignmentId: string, courseId: string}>()
    const [submissionScore, setSubmissionScore] = useState<SubmissionScore | null>(null)
    const [submissionProblemScores, setSubmissionProblemScores] = useState(new Array<SubmissionProblemScore>())
    const [selectedSubmission, setSelectedSubmission] = useState<Submission>()
    //const [submission, setSubmission] = useState<Submission>()
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    const [assignment, setAssignment] = useState<Assignment>()
    const [submissions, setSubmissions] = useState(new Array<Submission>())
    const [showManualGrade, setToggleManualGrade] = useState(false)
    const [formData, setFormData] = useState({
        submissionId: submissionId,
        score: 0,
        feedback: '',
        releasedAt: "2024-10-05T14:48:00.00Z"
    })
    

    const fetchData = async () => {
        try {
            
            //const submission = await RequestService.get<Submission>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/${submissionId}`)
            //setSubmission(submission)

            const submissionScore = (await RequestService.get<SubmissionScore[]>(`/api/course/${courseId}/assignment/${assignmentId}/submission-scores?submission=${submissionId}`)).pop() ?? null
            setSubmissionScore(submissionScore)
            
            const selectedSubmission = await RequestService.get<Submission>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/${submissionId}`);
            setSelectedSubmission(selectedSubmission);
            
            const submissionProblemScores = await RequestService.get<SubmissionProblemScore[]>(`/api/course/${courseId}/assignment/${assignmentId}/submission-problem-scores/submission/${submissionId}`)
             setSubmissionProblemScores(submissionProblemScores)
            
            const assignment = await RequestService.get<Assignment>(`/api/course/${courseId}/assignments/${selectedSubmission.assignmentId}`)
            setAssignment(assignment)

            const assignmentProblems = await RequestService.get<AssignmentProblem[]>(`/api/course/${courseId}/assignment/${assignment.id}/assignment-problems`)
            setAssignmentProblems(assignmentProblems)  

            const submissionsReq = await RequestService.get<Submission[]>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/`)
            submissionsReq.sort((a, b) => (Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? '')))
            setSubmissions(submissionsReq)


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
    //const history = useHistory()
    //var submission_form = JSON.parse(submission?.content);

   /* const handleAddNote = () => {
        setNotes([

            {
                id: notes.length + 1,
                content: '',
                position: { x: 100, y: 100 }, // Initial position
            },
        ]);*/
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
                <div className={styles.scores}>
                <h1 className = {styles.heading}>Submissions For Assignment {assignment?.name}</h1>
  

            <div className={styles.submissionsLayout}>

           <div className={styles.submissionsContainer}>
                <h2 className={styles.sub_list}>Submission List:</h2>
             {submissions.map((submission, index) => (
            <div className={styles.submissionCard} key={index}>
            <CardActionArea onClick={() => 
           setSelectedSubmission(submission)}>
            <div>
              <div className={styles.submissionHeading}>{`Submission ${submissions.length - index}`}</div>
              <div className={styles.submissionTime}>{`Submitted at: ${submission.createdAt && prettyPrintDateTime(submission.createdAt)}`}</div>
            </div>
          </CardActionArea>
        </div>
      ))}
        </div>
            <div className={styles.submissionContent}>
           
        
            {selectedSubmission ? (
                <>
               
                 <div className={styles.scoreDisplay}>
                <h2 className = {styles.content_title}>{submissionScore ? `Score: ${submissionScore.score}` : "Score: N/A"}</h2>
              </div>
            
              <div className={styles.feedbackContainer}>
            <h3 className={styles.content_title}>Feedback:</h3>
            <div className={styles.problemAnswerContainer}>
            <table className={styles.assignmentTable}>
            <thead>
            <tr>
             {assignmentProblems.map(ap => (
                 <th key={ap.id}>{ap.problemName}</th>
             ))}
            <th>Total Score</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            
            {assignmentProblems.map(ap => (
             <td key={ap.id}>
            {submissionProblemScores.find(sps => sps.assignmentProblemId === ap.id)?.score ?? "N/A"}
            </td>
            ))}
             <td>{submissionScore?.score ?? "N/A"}</td>
            </tr>
            </tbody>
            </table>
            </div>
            {submissionScore?.feedback ? (
              <p>{submissionScore.feedback}</p>
            ) : (
              <p>No feedback provided for this submission.</p>
            )}
              {submissionProblemScores.map(sps => (
                <div>
                    <h2>Feedback for {assignmentProblems.find(ap => ap.id === sps.assignmentProblemId)?.problemName}:</h2>
                    <pre>{sps.feedback}</pre>
                </div>
            ))} 
            
            </div>
                <h2 className={styles.content_title}>Content</h2>
                <Button onClick={() => history.push(`/course/${selectedSubmission.courseId}/assignment/${selectedSubmission.assignmentId}/submission/${submissionId}/fileView`)}>View File</Button>
                <div className={styles.scrollableContent}>
               <pre>{selectedSubmission.content}</pre>
              </div>
              </>
           ) : (
           <p>Select a submission to view its content.</p>
          )}
         </div>
       </div>
     </div>
        </PageWrapper>
    )
}

export default SubmissionDetailPage
