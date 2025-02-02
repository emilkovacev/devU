import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import {Assignment, AssignmentProblem, Submission, /*NonContainerAutoGrader, /*ContainerAutoGrader*/} from 'devu-shared-modules'
import RequestService from 'services/request.service'
import ErrorPage from '../errorPage/errorPage'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import {useActionless, useAppSelector} from 'redux/hooks'
import {SET_ALERT} from 'redux/types/active.types'
//import Card from '@mui/material/Card'
//import CardContent from '@mui/material/CardContent'
import {Accordion, AccordionDetails, TextField, Typography} from '@mui/material'


import Grid from '@mui/material/Unstable_Grid2'

import styles from './assignmentDetailPage.scss'
import {prettyPrintDateTime} from "../../../utils/date.utils";

import { useLocation } from 'react-router-dom';
import Scoreboard from '../assignments/scoreboard';

const AssignmentDetailPage = () => {
    const [setAlert] = useActionless(SET_ALERT)
    const history = useHistory()
    const { assignmentId, courseId } = useParams<{assignmentId: string, courseId: string}>()
    const userId = useAppSelector((store) => store.user.id)
    const role = useAppSelector((store) => store.roleMode)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({})
    const [file, setFile] = useState<File | null>()
    const [assignmentProblems, setAssignmentProblems] = useState(new Array<AssignmentProblem>())
    const [submissions, setSubmissions] = useState(new Array<Submission>())
    // const [submissionScores, setSubmissionScores] = useState(new Array<SubmissionScore>())
    // const [submissionProblemScores, setSubmissionProblemScores] = useState(new Array<SubmissionProblemScore>())
    const [assignment, setAssignment] = useState<Assignment>()

    // const [containerAutograder, setContainerAutograder] = useState<ContainerAutoGrader | null>()
    // const contaierAutograder = false; //TODO: Use the above commented out code to get the container autograder
    // const [ setNonContainerAutograders] = useState(new Array <NonContainerAutoGrader>())
    const [showScoreboard, setShowScoreboard] = useState(false);
    const location = useLocation();

    useEffect(() => {
        fetchData()
    }, [location]);


    const fetchData = async () => {
        try {
            const assignments = await RequestService.get<Assignment>(`/api/course/${courseId}/assignments/${assignmentId}`)
            setAssignment(assignments)

            const assignmentProblemsReq = await RequestService.get<AssignmentProblem[]>(`/api/course/${courseId}/assignment/${assignmentId}/assignment-problems/`)
            setAssignmentProblems(assignmentProblemsReq)

            const submissionsReq = await RequestService.get<Submission[]>(`/api/course/${courseId}/assignment/${assignmentId}/submissions/`)
            submissionsReq.sort((a, b) => (Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? '')))
            setSubmissions(submissionsReq)

            //  const submissionScoresPromises = submissionsReq.map(s => {
            //     return RequestService.get<SubmissionScore[]>(`/api/submission-scores?submission=${s.id}`)
            //  })
            //  const submissionScoresReq = (await Promise.all(submissionScoresPromises)).reduce((a, b) => a.concat(b), [])
            //  setSubmissionScores(submissionScoresReq)

            //  const submissionProblemScoresPromises = submissionsReq.map(s => {
            //     return RequestService.get<SubmissionProblemScore[]>(`/api/submission-problem-scores/${s.id}`)
            //
            //  const submissionProblemScoresReq = (await Promise.all(submissionProblemScoresPromises)).reduce((a, b) => a.concat(b), [])
            //  setSubmissionProblemScores(submissionProblemScoresReq)

            // const containerAutograder = (await RequestService.get<ContainerAutoGrader[]>(`/api/course/${courseId}/assignment/${assignmentId}/container-auto-graders`)).pop() ?? null
            // setContainerAutograder(containerAutograder)

            // const nonContainers = await RequestService.get<NonContainerAutoGrader[]>(`/api/course/${courseId}/assignment/${assignmentId}/non-container-auto-graders`)
            // setNonContainerAutograders(nonContainers)


        } catch (err:any) {
            setError(err)
            const message =  "Submission past due date"//Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            setAlert({autoDelete: false, type: 'error', message})
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : e.target.value}))
    }


    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.item(0))
    }


    const handleSubmit = async () => {
        let response;
        const contentField = {
            filepaths : [],
            form : formData,
        }
        const submission = {
            userId : userId,
            assignmentId : assignmentId,
            courseId : courseId,
            content : JSON.stringify(contentField),
        }

        setLoading(true)

        try {
            if (file) {
                const submission = new FormData
                submission.append('userId', String(userId))
                submission.append('assignmentId', assignmentId)
                submission.append('courseId', courseId)
                submission.append('content', JSON.stringify(contentField))
                submission.append('files', file)

                response = await RequestService.postMultipart(`/api/course/${courseId}/assignment/${assignmentId}/submissions`, submission);
            } else {
                response = await RequestService.post(`/api/course/${courseId}/assignment/${assignmentId}/submissions`, submission);
            }

            setAlert({ autoDelete: true, type: 'success', message: 'Submission Sent' })

            // Now you can use submissionResponse.id here
            await RequestService.post(`/api/course/${courseId}/grade/${response.id}`, {} )
            setAlert({ autoDelete: true, type: 'success', message: 'Submission Graded' })

            await fetchData()
        } catch (err: any) {
            const message = Array.isArray(err) ? err.map((e) => `${e.param} ${e.msg}`).join(', ') : err.message
            setAlert({ autoDelete: false, type: 'error', message })
        } finally {
            setLoading(false)
            await fetchData()
        }
    }
    const isSubmissionDisabled = () => {
        if (assignment?.dueDate) {
            const dueDate = new Date(assignment.dueDate);
            const now = new Date();
            return now > dueDate;
        }
        return false;
    };


    return(
        <PageWrapper>
            <div className={styles.header}>
                <h1 className = {styles.assignment_heading}>{assignment?.name}</h1>
                <hr className= {styles.line}/>
                </div>
                <div className = {styles.wrap}>

                {role.isInstructor() && (
                    <>
                    <div className={styles.card}>
                <h2 className={styles.card_heading}>Options</h2>
                <hr className = {styles.line} />
                    <div className={styles.options_buttons}>
                    {role.isInstructor() && <button className={styles.buttons} onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/createNCAG`)
                    }}>Add NCAG</button>}
                    <hr className = {styles.line} />
                    {role.isInstructor() && <button  className={styles.buttons} onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/createCAG`)
                    }}>Add CAG</button>}
                    <hr className = {styles.line} />
                    {role.isInstructor() && <button className={styles.buttons} onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/createProblem`)
                    }}>Add Assignment Question</button>}
                    <hr className = {styles.line} />
                    {role.isInstructor() && <button  className={styles.buttons} onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/update`)
                    }}>Edit Assignment</button>}

                        <hr className = {styles.line} />
                        {role.isInstructor() && <button className={styles.buttons} onClick={() => {
                            history.push
                            (`/course/${courseId}/assignment/${assignmentId}/submissions`)
                        }}>Grade Submissions</button>}

                        <hr className = {styles.line} />
                        {role.isInstructor() && <button
                            className={styles.buttons} onClick={() => {
                            setShowScoreboard(!showScoreboard)}

                        }>Scoreboard</button>
                        }
                    </div>
                    </div>
                   </>
                    )}


            <Grid display='flex' justifyContent='center' alignItems='center'>
            <div className={styles.assignment_card}>
            <Typography className={styles.assignment_description}>{assignment?.description}</Typography>
            <Typography className={styles.filenames}>Attachments : {assignment?.attachmentsFilenames}</Typography>
            <hr className={styles.line} />

            {assignment?.dueDate && (
                    <Typography className={styles.due_date}>{`Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}`}</Typography>
                )}
            {assignmentProblems && assignmentProblems.length > 0 ? (
                assignmentProblems.map((assignmentProblem, index) => (
                    <Accordion className={styles.accordion} key={index}>

                    <AccordionDetails className={styles.accordionDetails}>
                        <Typography>{assignmentProblem.problemName}</Typography>
                        <TextField id={assignmentProblem.problemName} fullWidth className={styles.textField} variant='outlined' label='Answer' onChange={handleChange}></TextField>
                    </AccordionDetails>
                    </Accordion>
                ))

                ) : (
                <div>
                    <Typography>No Problems Exist</Typography>
                </div>
            )}

            {!(assignment?.disableHandins) && (<input type="file"
                                                      className={styles.fileInput}
                                                      onChange={handleFileChange} />)}



            { !(isSubmissionDisabled()) &&assignmentProblems && assignmentProblems.length > 0 ? (
                 <div className = {styles.submit_container}>
                <button className={styles.buttons} onClick={handleSubmit}
                        >Submit</button>
                </div>
            ) : null}
            </div>
            </Grid>
            </div>

            <div className={styles.header}>
                <h1>{`Submissions`}</h1>
                <hr className = {styles.line}/>
            </div>


            <div>
            <div className={styles.submissionsContainer}>
            {submissions.map((submission, index) => (
                <div className={styles.submissionCard} key={index}>
                    <div onClick={() => {
                        history.push(`/course/${courseId}/assignment/${assignmentId}/submission/${submission.id}`)
                    }}>
                    <div>
                    <div className={styles.submissionHeading}>{`Submission ${submissions.length - index}`}</div>
                    <div className={styles.submissionTime}>{`Submitted at: ${submission.createdAt && prettyPrintDateTime(submission.createdAt)}`}</div>
                     </div>
                    </div>
                </div>
            ))}

                {showScoreboard && (
                    <div className={styles.scoreboardContainer}>
                        <Scoreboard courseId={courseId} assignmentId={assignmentId} />

                    </div>
                )}
            </div>
            </div>

        </PageWrapper>
    )
}

export default AssignmentDetailPage