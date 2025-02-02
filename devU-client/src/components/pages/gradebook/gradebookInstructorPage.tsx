import React, { useEffect, useState } from 'react'

import { Assignment, AssignmentScore, User, UserCourse } from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'
import LoadingOverlay from 'components/shared/loaders/loadingOverlay'
import ErrorPage from '../errorPage/errorPage'

import RequestService from 'services/request.service'

import styles from './gradebookPage.scss'
import { useParams } from 'react-router-dom'

type TableProps = {
    users: User[]
    userCourses: UserCourse[]
    assignments: Assignment[]
    assignmentScores: AssignmentScore[]
}
type RowProps = {
    index: number
    user: User
    userCourse: UserCourse
    assignments: Assignment[]
    assignmentScores: AssignmentScore[]
}
//table for style
const TableRow = ({ index, user, userCourse, assignments, assignmentScores }: RowProps) => {
    // style table row to alternating colors based on index odd?even
    const rowClass = index % 2 === 0 ? 'evenRow' : 'oddRow';

    // dont show row if dropped
    // if (userCourse.dropped) {
    //     return (<></>)
    // }

    return (
        <tr className={styles[rowClass]}>
            <td>{index}</td>
            <td>{user.email}</td>
            {/* <td>{user.externalId}</td> */}
            <td>{user.preferredName}</td>
            <td>{userCourse.dropped.toString()}</td>
            {assignments.map(a => (
                <td>{assignmentScores.find(as => as.assignmentId === a.id)?.score ?? 'N/A'}</td>
            ))}
        </tr>
    )
}

const GradebookTable = ({ users, userCourses, assignments, assignmentScores }: TableProps) => {
    return (
        <table>
            <th>#</th>
            <th>Email</th>
            {/* <th>External ID</th> */}
            <th>Preferred Name</th>
            <th>Dropped</th>
            {assignments.map((a) => {
                return (<th>{a.name}</th>)
            })}
            {users.map((u, index) => (
                <TableRow
                    index={index + 1}
                    user={u}
                    userCourse={userCourses.find(uc => uc.userId === u.id) as UserCourse}
                    assignments={assignments}
                    assignmentScores={assignmentScores.filter(as => as.userId === u.id)}
                />
            ))}
        </table>
    )
}

const GradebookInstructorPage = () => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [users, setUsers] = useState(new Array<User>()) //All users in the course
    const [userCourses, setUserCourses] = useState(new Array<UserCourse>()) //All user-course connections for the course
    const [assignments, setAssignments] = useState(new Array<Assignment>()) //All assignments in the course
    const [assignmentScores, setAssignmentScores] = useState(new Array<AssignmentScore>()) //All assignment scores for assignments in the course

    const { courseId } = useParams<{ courseId: string }>()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const userCourses = await RequestService.get<UserCourse[]>(`/api/course/${courseId}/user-courses/`)
            setUserCourses(userCourses)

            const users = await RequestService.get<User[]>(`/api/users/course/${courseId}`)
            setUsers(users)

            const assignments = await RequestService.get<Assignment[]>(`/api/course/${courseId}/assignments`)
            assignments.sort((a, b) => (Date.parse(a.startDate) - Date.parse(b.startDate))) //Sort by assignment's start date
            setAssignments(assignments)

            const assignmentScores = await RequestService.get<AssignmentScore[]>(`/api/course/${courseId}/assignment-scores`)
            setAssignmentScores(assignmentScores)

        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingOverlay delay={250} />
    if (error) return <ErrorPage error={error} />

    return (
        <PageWrapper className={styles.pageWrapper}>
            {/* <div className={styles.header}> */}
            <h1>Instructor Gradebook</h1>
            {/* </div> */}
            <div className={styles.tableContainer}>
                <GradebookTable
                    users={users}
                    userCourses={userCourses}
                    assignments={assignments}
                    assignmentScores={assignmentScores}
                />
            </div>
        </PageWrapper>
    )
}

export default GradebookInstructorPage
