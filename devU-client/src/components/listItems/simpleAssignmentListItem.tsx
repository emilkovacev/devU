import React from 'react'
import ListItemWrapper from 'components/shared/layouts/listItemWrapper'
import {prettyPrintDate} from 'utils/date.utils'
import styles from './simpleAssignmentListItem.scss'
import {Assignment} from 'devu-shared-modules'


type Props = {
    assignment: Assignment
}

const SimpleAssignmentListItem = ({assignment}: Props) => (
    <ListItemWrapper to={`/course/${assignment.courseId}/assignment/${assignment.id}`} tag={assignment.name}
                     className={styles.title} tagStyle={styles.tag} containerStyle={styles.container}>
        <div className={styles.subText}>{assignment.name}</div>
        <div className={styles.subText}>{assignment.categoryName}</div>
        <div className={styles.meta}>Due At: {prettyPrintDate(assignment.dueDate)}</div>

    </ListItemWrapper>
)


export default SimpleAssignmentListItem