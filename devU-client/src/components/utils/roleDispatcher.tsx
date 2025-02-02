import {updateUserRole} from '../../redux/role.redux'
import {useDispatch} from 'react-redux'
import React, {useEffect} from 'react'
import {useParams} from "react-router-dom";
import RequestService from 'services/request.service'
import {UserCourse} from "devu-shared-modules";

const RoleDispatcher = () => {
  const dispatch = useDispatch();
  const {courseId} = useParams<{ courseId: string }>()

  useEffect(() => {
    const path = window.location.pathname
    const hasCoursePath = path.includes('/course/')

    if (hasCoursePath) {
      RequestService.get(`/api/course/${courseId}/user-courses/users`)
      .then((response) => {
        const userCourses: UserCourse = response;
        if (userCourses.role === 'instructor') {
          dispatch(updateUserRole('Instructor'));
        } else {
          dispatch(updateUserRole('Student'));
        }
      })
      .catch(error => {
        console.error(error)
      })
    }
  }, []);

  return (
    <div hidden>
    </div>
  )
}

export default RoleDispatcher