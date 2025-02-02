import React from 'react'

import {Assignment, Course, Submission} from 'devu-shared-modules'

import ListItemWrapper from 'components/shared/layouts/listItemWrapper'

import {prettyPrintDate} from 'utils/date.utils'

import styles from './submissionListItem.scss'

type Props = {
    submission: Submission
    assignment?: Assignment
    course?: Course
}


const SubmissionListItem = ({ submission, assignment, course }: Props) => (
    <ListItemWrapper
        to={{
            pathname: `/courses/${course && course.id}/assignments/${assignment && assignment.id}/submissions/${submission.id}`,
            state: submission
        }}
        tag={`${submission.id}-${submission.assignmentId}-${submission.courseId}`}>
        {course && (
            <div className={styles.course}>
                {course.name} - {course.number}
            </div>
        )}
        {assignment && (
            <div className={styles.assignment}>
                {assignment.name}
            </div>
        )}
        <div className={styles.meta}>
            <div>Submitted At: {prettyPrintDate(submission.createdAt || '')}</div>
            {assignment && <div>Due At: {prettyPrintDate(assignment.dueDate)}</div>}
        </div>
    </ListItemWrapper>
)

export default SubmissionListItem
