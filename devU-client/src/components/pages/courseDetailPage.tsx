import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import RequestService from 'services/request.service'
import {Assignment, Course} from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'


import styles from './courseDetailPage.scss'
import {SET_ALERT} from "../../redux/types/active.types";
import {useActionless} from "../../redux/hooks";

const CourseDetailPage = () => {
    const history = useHistory()
    const { courseId } = useParams<{courseId: string}>()

    const [courseInfo, setCourseInfo] = useState<Course | null>(null)
    const [categoryMap, setCategoryMap] = useState<Record<string, Assignment[]>>({})
    const [setAlert] = useActionless(SET_ALERT)
    
    const fetchCourseInfo = async () => {
        RequestService.get<Course>(`/api/courses/${courseId}`)
        .then((course) => {
            setCourseInfo(course)
        })
        RequestService.get<Assignment[]>(`/api/assignments/course/${courseId}`)
        .then((assignments) => {
            console.log(assignments)
            let categoryMap : Record<string, Assignment[]> = {}
            assignments.forEach((assignment : Assignment) => {
                if (assignment.categoryName in categoryMap) {
                    categoryMap[assignment.categoryName].push(assignment)
                }
                else {
                    categoryMap[assignment.categoryName] = [assignment]
                }
            })
            setCategoryMap(categoryMap)
        })

    }


    const handleDropCourse = () => {

        RequestService.delete(`/api/user-courses/${courseId}`).then(() => {
            setAlert({autoDelete: true, type: 'success', message: 'Course Dropped'})
            setTimeout(() => {
                history.push('/courses')
            }, 3000)

        }).catch((error: Error) => {
            const message = error.message
            setAlert({autoDelete: false, type: 'error', message})
        })
    }

    useEffect(() => {
        fetchCourseInfo()
    }, [])

    return(
        <PageWrapper>
            {courseInfo ? (
                <div>
                    <div className={styles.header}>
                        <div className={styles.smallLine}></div>
                        <h1>{courseInfo.name}</h1>
                        <div className={styles.largeLine}></div>

                        <Stack spacing={2} direction='row'>
                            <Button variant='contained' className={styles.buttons} onClick={() => {
                                history.push(`/courses/${courseId}/gradebook`)
                            }}>Gradebook</Button>
                            <Button variant='contained' className={styles.buttons} onClick={() => {
                                history.push(`/courses/${courseId}/createAssignment`)
                            }}>Add Assignment</Button>
                            <Button variant='contained' className={styles.buttons} onClick={() => {
                                history.push(`/courses/${courseId}/update`)
                            }}>Edit Course</Button>
                            <Button variant='contained' className={styles.buttons} onClick={handleDropCourse}>Drop
                                Course</Button>
                        </Stack>
                    </div>
                    
                    <div className = {styles.categoriesContainer}>
                    {Object.keys(categoryMap).map((category, index) => (
                        <Card sx={{maxWidth : 345}} key={index}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {category}
                                </Typography>
                            </CardContent>
                            <List sx = {{maxHeight : 300, overflow : 'auto', '& ul' : {padding : 0} }}>
                            {categoryMap[category].map((assignment, index) => (
                                <ListItem disablePadding key={index}>
                                    <ListItemButton onClick={() => {history.push(`/courses/${courseId}/assignments/${assignment.id}`)}}>
                                        <ListItemText primary={assignment.name} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                            </List>
                        </Card>
                    ))}
                    </div>
                </div>
            ) : (
                <h1>Error fetching Course Information</h1>
            )}
        </PageWrapper>
    )
}

export default CourseDetailPage