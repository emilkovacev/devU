import React, {useEffect, useState} from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { Link, useParams } from 'react-router-dom'
import styles from './navbar.scss'
import RequestService from 'services/request.service'
import {Assignment, Course, User} from 'devu-shared-modules'

const UserBreadcrumb = ({ match }: any) => {
    const [userName, setUserName] = useState('')

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => { 
        const user = await RequestService.get<User>( `/api/users/${match.params.userId}` ) 
        setUserName(user.externalId)
    }

    return (<>{userName}</>)
}

const CourseBreadcrumb = ({ match }: any) => {
    const [courseName, setCourseName] = useState('')

    useEffect(() => {
        getCourse()
    }, [])

    const getCourse = async () => { 
        const course = await RequestService.get<Course>( `/api/courses/${match.params.courseId}` ) 
        setCourseName(course.name)
    }

    return (<>{courseName}</>)
}

const AssignmentBreadcrumb = ({ match }: any) => {
    const [assignmentName, setAssignmentName] = useState('')
    const { courseId } = useParams<{courseId: string}>()

    useEffect(() => {
        getAssignment()
    }, [])

    const getAssignment = async () => { 
        const assignment = await RequestService.get<Assignment>( `/api/course/${courseId}/assignments/${match.params.assignmentId}` ) 
        setAssignmentName(assignment.name)
    }

    return (<>{assignmentName}</>)
}

const DynamicBreadcrumb = ({ match }: any) => {
    const pathSegment = match.url.substr(match.url.lastIndexOf('/') + 1);
    const breadcrumbName = pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1);

    return <>{breadcrumbName}</>;
}

const routes = [
    { path: '/:home', breadcrumb: 'Home'}, //Only appears once at least one directory deep

    { path: '/user/:userId', breadcrumb: UserBreadcrumb},

    { path: '/course/:courseId', breadcrumb: CourseBreadcrumb},
    { path: '/course/:courseId/:path', breadcrumb: DynamicBreadcrumb},
    
    { path: '/course/:courseId/assignment/:assignmentId', breadcrumb: AssignmentBreadcrumb},
    { path: '/course/:courseId/assignment/:assignmentId/:path', breadcrumb: DynamicBreadcrumb},

    { path: '/course/:courseId/assignment/:assignmentId/submission/:submissionId', breadcrumb: 'Submission'},
    { path: '/course/:courseId/assignment/:assignmentId/submission/:submissionId/feedback', breadcrumb: 'Feedback'},
]

const Navbar = ({breadcrumbs}: any) => {

    const excludedPaths = [
        'assignment',
        'submission',
    ]

    return (
        <div className={styles.breadcrumbContainer}>
            {breadcrumbs.map(({breadcrumb, match}: any, index: number) => {
                let url = match.url
                if (excludedPaths.includes(match.params.path)) return null
                if (match.params.home) url = '/'

                return (
                    <span key={match.url}>
                        <Link to={url} className={styles.link}> {breadcrumb} </Link>
                        {index < (breadcrumbs.length - 1) && ( <span className={styles.separator}> &gt; </span> )}
                    </span>
                )
            })}
        </div>
    )
        
}

export default withBreadcrumbs(routes, { disableDefaults: true })(Navbar)