import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import RequestService from 'services/request.service'
import {Assignment, Course} from 'devu-shared-modules'
//import {useHistory} from "react-router-dom";
import PageWrapper from 'components/shared/layouts/pageWrapper'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
//import Button from '@mui/material/Button'
//import Stack from '@mui/material/Stack'


import styles from './courseDetailPage.scss'
import {SET_ALERT} from "../../../redux/types/active.types";
import {useActionless} from "../../../redux/hooks";
//import TextField from "../../shared/inputs/textField";
//import {useActionless, useAppSelector} from "redux/hooks";



const CourseDetailPage = () => {
    //const history = useHistory()
    const { courseId } = useParams<{courseId: string}>()
    const [courseInfo, setCourseInfo] = useState<Course | null>(null)
    const [categoryMap, setCategoryMap] = useState<Record<string, Assignment[]>>({})
    const [setAlert] = useActionless(SET_ALERT)
   // const[User, setUser]= useState < User <string>,preferredName>>({})

   // const role = useAppSelector((store) => store.roleMode)
   /* const fetchUserinfo = async () => {
        RequestService.get< typeof User>('api/users')
            .then((User) =>{
                setUser(User)

    })
*/


    const fetchCourseInfo = async () => {
        RequestService.get<Course>(`/api/courses/${courseId}`)
        .then((course) => {
            setCourseInfo(course)

        })
        RequestService.get<Assignment[]>(`/api/course/${courseId}/assignments/released`)
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
        //confirmation to drop course or not
        var confirm = window.confirm("Are you sure you want to drop?");
        if (confirm)
        {
            RequestService.delete(`/api/course/${courseId}/user-courses`).then(() => {
           
                setAlert({autoDelete: true, type: 'success', message: 'Course Dropped'})
                history.push('/courses')

        }).catch((error: Error) => {
            const message = error.message
            setAlert({autoDelete: false, type: 'error', message})  })
        }
    }


    useEffect(() => {
        fetchCourseInfo()
        //fetchUserinfo()
    }, [])
    const history = useHistory()
    return(
        <PageWrapper>
            <div className={styles.courseDetailPage}>


            {courseInfo ? (
                        <div>

                        <div className={styles.header}>
                            <h1>{courseInfo.name}({courseInfo.semester})</h1>
                            <h2> Instructor: </h2>


                            <div style={{display: 'flex', justifyContent: 'space-between'}}>



                                <button className={styles.actual_button}  onClick={() => {
                                    history.push(`/course/${courseId}/gradebook`)
                                }}>Gradebook
                                </button>



                                <button className={styles.actual_button} onClick={() => {
                                    history.push(`/course/${courseId}/createAssignment`)
                                }}>Add Assignment
                                </button>


                                <button className={styles.actual_button} onClick={() => {
                                    history.push(`/course/${courseId}/update`)
                                }}>Course WebSite
                                </button>


                                <button className={styles.actual_button} onClick={handleDropCourse}
                                    > Drop Course
                                </button>

                            </div>


                            </div>


                            <h1>Assignments</h1>



                            <div className={styles.coursesContainer}>
                            {Object.keys(categoryMap).map((category, index) => (

                                <Card key={index} className={styles.courseCard}>
                                    <CardContent>
                                        <Typography variant="h5" className={styles.color} style={{ textAlign: 'center' }}>
                                            {category}
                                        </Typography>
                                    </CardContent>
                                    <List sx={{maxHeight: 200, overflow: 'auto', '& ul': {padding: 0}}}>
                                        {categoryMap[category].map((assignment, index) => (
                                            <ListItem key={index} disablePadding>
                                                <ListItemButton onClick={() => {
                                                    history.push(`/course/${courseId}/assignment/${assignment.id}`)
                                                }}>
                                                    <ListItemText
                                                        primary={
                                                            <Typography style={{  textAlign: 'center' }}>
                                                                {assignment.name}
                                                            </Typography>
                                                        }
                                                                  secondary={
                                                                      <React.Fragment>
                                                                          <Typography
                                                                              sx={{ display: 'inline' }}
                                                                              component="span"
                                                                              variant="body2"
                                                                              color="text.primary"
                                                                          >
                                                                              Start Date: {new Date(assignment.startDate).toLocaleDateString()}
                                                                              <br /> {/* Add a line break */}
                                                                              Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
                                                                          </Typography>
                                                                      </React.Fragment>
                                                                  }
                                                    />

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

            </div>

                </PageWrapper>
            )
            }


            export default CourseDetailPage