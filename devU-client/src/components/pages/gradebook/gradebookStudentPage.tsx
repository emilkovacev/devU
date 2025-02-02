import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';

import { Assignment, AssignmentScore } from 'devu-shared-modules';

import PageWrapper from 'components/shared/layouts/pageWrapper';
import LoadingOverlay from 'components/shared/loaders/loadingOverlay';
import ErrorPage from '../errorPage/errorPage';

import RequestService from 'services/request.service';

import styles from './gradebookPage.scss';

const GradebookStudentPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [assignmentScores, setAssignmentScores] = useState<AssignmentScore[]>([]);
    const role = useAppSelector((store) => store.roleMode);
    const { courseId } = useParams<{ courseId: string }>();
    const userId = useAppSelector((store) => store.user.id);
    const history = useHistory();


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const assignments = await RequestService.get<Assignment[]>(`/api/course/${courseId}/assignments/released`);
            setAssignments(assignments);

            const assignmentScores = await RequestService.get<AssignmentScore[]>(`/api/course/${courseId}/assignment-scores/user/${userId}`);
            setAssignmentScores(assignmentScores);

        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingOverlay delay={250} />;
    if (error) return <ErrorPage error={error} />;

    const categories = [...new Set(assignments.map(a => a.categoryName))];

    return (
        <PageWrapper className={styles.pageWrapper}>
            <div className={styles.header}>
                <h1>Student Gradebook</h1>
                {role.isInstructor() && (
                    <button className='btnSecondary' onClick={() => {
                        history.push(`/course/${courseId}/gradebook/instructor`)
                    }}>Instructor View
                    </button>
                )}
            </div>
            <div className={styles['gradebook-container']}>
                {categories.map(category => (
                    <div key={category} className={styles.category}>
                        <h2>{category}</h2>
                        {/* <table className={styles.table}> Add table class */}
                        <table>
                            <thead>
                                {/* <tr className={styles.headerRow}> Add class for purple header */}
                                    <th>Assignment</th>
                                    <th>Score</th>
                                {/* </tr> */}
                            </thead>
                            <tbody>
                                {assignments.filter(a => a.categoryName === category).map((assignment, index) => (
                                    <tr key={assignment.id} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                        <td>
                                            <div className={styles.assignmentName}>
                                                {assignment.name}
                                            </div>
                                        </td>
                                        <td>
                                            {/* <div className={styles.content}> */}
                                                {assignmentScores.find(aScore => aScore.assignmentId === assignment.id)?.score ?? 'N/A'}
                                            {/* </div> */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </PageWrapper>
    );
};

export default GradebookStudentPage;