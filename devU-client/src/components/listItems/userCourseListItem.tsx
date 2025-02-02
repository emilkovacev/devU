import React from 'react'
import { Assignment, Course } from 'devu-shared-modules'
import { useHistory } from "react-router-dom";
import ListItemWrapper from 'components/shared/layouts/listItemWrapper'

//import {prettyPrintDate} from 'utils/date.utils'

import styles from './userCourseListItem.scss'

import SimpleAssignmentListItem from "./simpleAssignmentListItem";
//import {prettyPrintSemester} from "../../utils/semester.utils";

type Props = {
    course: Course
    assignments?: Assignment[]
    past?: boolean
    instructor?: boolean
}


const UserCourseListItem = ({ course, assignments, past = false, instructor = false }: Props) => {
    const history = useHistory()
    return (
        <ListItemWrapper to={null} tag={course.number} containerStyle={styles.container}>

            <div className={styles.name}>{instructor ? (course.name + " " + course.number + " (" + course.semester + ")" + " Instructor") : course.name.toUpperCase() + " " + course.number + " " + "(" + course.semester + ")"}</div>
            <div className={styles.subText}>
                {assignments && assignments.length > 0 ? (assignments.map((assignment) => (
                    <SimpleAssignmentListItem assignment={assignment} key={assignment.id} />
                ))) : ((past) ? <div></div> : <div className={styles.No_assignments}>No Assignments Due Yet</div>)}
                <div className={styles.Buttons}>
                    <button className={styles.gradebook_button} onClick={(e) => {
                        e.stopPropagation();
                        history.push(`/course/${course.id}/gradebook`);
                    }}>Gradebook</button>
                    <button className={styles.coursepage_button} onClick={(e) => {
                        e.stopPropagation();
                        history.push(`/course/${course.id}`);
                    }}>Coursepage</button>
                </div>
            </div>

        </ListItemWrapper>

    );
};
export default UserCourseListItem
