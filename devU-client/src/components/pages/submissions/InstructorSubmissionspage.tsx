import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';



import { Assignment, Submission, SubmissionScore, User } from 'devu-shared-modules';



import PageWrapper from 'components/shared/layouts/pageWrapper';

import LoadingOverlay from 'components/shared/loaders/loadingOverlay';

import ErrorPage from '../errorPage/errorPage';



import RequestService from 'services/request.service';



import styles from './Submissionspage.scss';
import TextField from "../../shared/inputs/textField";


//tableprops
interface TableProps {

    users: User[];

    submissions: Submission[];

    submissionScores: SubmissionScore[];

    assignment: Assignment;

}

//row

interface RowProps {

    user: User;

    submission: Submission ;

    submissionScore: SubmissionScore | undefined;

}



const TableRow: React.FC<RowProps> = ({ user, submission, submissionScore }) => (

    <tr>

        <td>{user.email}</td>

        <td>{user.externalId}</td>

        <td>{submissionScore?.score ?? 'N/A'}</td>

        <td>

            <a href={`/course/${submission.courseId}/assignment/${submission.assignmentId}/submission/${submission.id}/feedback`}>

                View Feedback

            </a>

        </td>

    </tr>

);



const SubmissionsTable: React.FC<TableProps> = ({ users, submissions, submissionScores, assignment }) => (

    <table className={styles.submissionsTable}>

        <thead>

        <tr>

            <th>Email</th>

            <th>External ID</th>

            <th>{assignment.name} Score</th>
            {/* Display assignment name + score*/}

            <th>Feedback</th>

        </tr>

        </thead>

        <tbody>

        {submissions.map((submission) => {

            const user = users.find((u) => u.id === submission.userId);

            const submissionScore = submissionScores.find((ss) => ss.submissionId === submission.id);

            return user ? (

                <TableRow key={submission.id} user={user} submission={submission} submissionScore={submissionScore}/>

            ) : null;

        })}

        </tbody>

    </table>

);


const InstructorSubmissionsPage: React.FC = () => {

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const [users, setUsers] = useState<User[]>([]);

    const [submissions, setSubmissions] = useState<Submission[]>([]);

    const [submissionScores, setSubmissionScores] = useState<SubmissionScore[]>([]);

    const [assignment, setAssignment] = useState<Assignment | null>(null);

    const {assignmentId, courseId } = useParams<

        {assignmentId: string, courseId: string}>()






    useEffect(() => {

        const fetchData = async () => {

            try {

                if (!courseId) {

                    console.error("courseId is undefined. Cannot fetch users.",error);

                    setError(error);

                    return;

                }

                // Fetch all users

                const users = await RequestService.get<User[]>('/api/users');

                setUsers(users);

                //const enrolledusers = await RequestService.get<User[]>(`/api/course/${courseId}/users`);
                //setUsers(enrolledusers);



                // Fetch submissions for the assignment

                const submissions = await RequestService.get<Submission[]>(

                    `/api/course/${courseId}/assignment/${assignmentId}/submissions`

                    // `/api/course/<span class="math-inline">\{courseId\}/assignment/</span>{assignmentId}/submissions`

                );

                setSubmissions(submissions);



                // Fetch submission scores for the assignment

                const submissionScores = await RequestService.get<SubmissionScore[]>(

                    `/api/course/${courseId}/assignment/${assignmentId}/submission-scores`

                );

                setSubmissionScores(submissionScores);



                // Fetch the assignment details

                const assignment = await RequestService.get<Assignment>(`/api/course/${courseId}/assignments/${assignmentId}`);

                setAssignment(assignment);

                //setOriginalUsers(users); // Store fetched users in originalUsers
               // setFilteredUsers(users);

            } catch (error: any) {

                console.error("Error fetching data:", error);

                setError(error);

            } finally {

                setLoading(false);

            }

        };



        fetchData();

    }, [courseId, assignmentId]);

    //const [filterUsers, setFilterUsers] = useState<User[]>([]);


    const handleStudentSearch = (value:string) /*e : React.ChangeEvent<HTMLInputElement>)*/ => {

        console.log("Search term:", value);
        //const search = value.toLowerCase();

        const filterusers = users.filter((user) =>{
            //return(
            const matchuser =
                user.email.toLowerCase().includes(value.toLowerCase()) ||
                    user.externalId.toLowerCase().includes(value.toLowerCase())
           // );
            console.log(`User ${user.email} matches:`, matchuser);

            return matchuser;
        });
        console.log("Filtered Users:",filterusers);
        setUsers(filterusers);

    };



    if (loading) return <LoadingOverlay delay={250} />;

    if (error) return <ErrorPage error={error} />;

    if (!assignment) return <ErrorPage error={new Error('Assignment not found')} />; // Handle assignment not found

//structure for page & table

    return (

        <PageWrapper>

            <div className={styles.header}>

                <h1>Instructor Submissions Page</h1>

            </div>

            <div>
                <TextField
                    onChange={handleStudentSearch}
                    label='Search'
                    id='email'
                    placeholder='search students'
                />


                <SubmissionsTable

                    //users={filteredUsers}

                    users = {users}

                    submissions={submissions}

                    submissionScores={submissionScores}

                    assignment={assignment}

                />


            </div>

        </PageWrapper>

    );

};



export default InstructorSubmissionsPage;
