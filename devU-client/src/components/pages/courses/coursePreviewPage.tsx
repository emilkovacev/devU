import React, {useEffect, useState} from 'react'

import {Course, UserCourse} from 'devu-shared-modules'


import PageWrapper from 'components/shared/layouts/pageWrapper'
import {useActionless, useAppSelector} from "../../../redux/hooks"
import RequestService from "../../../services/request.service"
import {SET_ALERT} from "../../../redux/types/active.types"
import {useHistory, useParams} from "react-router-dom"
import LoadingOverlay from "../../shared/loaders/loadingOverlay"
import Button from '@mui/material/Button'
import styles from "./courseDetailPage.scss"


const CoursePreviewPage = () => {

    const [loading, setLoading] = useState(true)
    const [setAlert] = useActionless(SET_ALERT)
    const {courseId} = useParams<{ courseId: string }>()
    const [enrolled, setEnrolled] = useState<Boolean>(false)
    const [course, setCourse] = useState<Course>()
    const [userCourses, setUserCourses] = useState<UserCourse>()
    const userId = useAppSelector((store) => store.user.id)
    const history = useHistory()


    const handleCheckEnroll = async () => {
        RequestService.get(`/api/course/${courseId}/user-courses/users`)
        .then((response) => {
            setUserCourses(response);
        })

    }

    useEffect(() => {
        handleCheckEnroll()
    }, []);

    const handleCourse = () => {
        if (userCourses) {
            setEnrolled(true)
        } else {
            RequestService.get<Course>(`/api/courses/${courseId}`)
            .then((course) => {
                setCourse(course)
            }).catch((error) => {
                setAlert({autoDelete: false, type: 'error', message: error.message});
            }).finally(() => setLoading(false));
        }
    }

    useEffect(() => {
        handleCourse()
    }, [userCourses]);


    if (loading) return <LoadingOverlay delay={250}/>

    if (enrolled) {
        history.push(`/course/${courseId}`)
    }

    const handleJoinCourse = () => {
        const userCourseData = {
            userId: userId,
            courseId: courseId,
            role: 'student',
            dropped: false
        };

        RequestService.post(`/api/course/${courseId}/user-courses`, userCourseData)
        .catch((error: Error) => {
            const message = error.message
            setAlert({autoDelete: false, type: 'error', message})
        }).catch((error: Error) => {
            const message = error.message
            setAlert({autoDelete: false, type: 'error', message})
        }).finally(() => {
            setAlert({autoDelete: true, type: 'success', message: 'Course Joined'})
            history.goBack()
        })
    }


    return (
        <PageWrapper>
            <h1>Course Preview Page</h1>
            <h2>{course?.name}</h2>
            <p>{course?.number}</p>
            <p>{course?.semester}</p>
            <Button variant='contained' className={styles.buttons} onClick={handleJoinCourse}>Join Course</Button>
        </PageWrapper>
    )
}


export default CoursePreviewPage
