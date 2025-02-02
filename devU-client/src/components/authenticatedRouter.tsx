import React from 'react'
import {Route, Switch} from 'react-router-dom'

import AssignmentDetailPage from 'components/pages/assignments/assignmentDetailPage'
import AssignmentCreatePage from 'components/pages/forms/assignments/assignmentFormPage'
import AssignmentUpdatePage from 'components/pages/forms/assignments/assignmentUpdatePage'
import CourseDetailPage from 'components/pages/courses/courseDetailPage'
import EditCourseFormPage from 'components/pages/forms/courses/coursesFormPage'
import CourseUpdatePage from 'components/pages/forms/courses/courseUpdatePage'
import HomePage from 'components/pages/homePage/homePage'
import NotFoundPage from 'components/pages/notFoundPage'
import SubmissionDetailPage from 'components/pages/submissions/submissionDetailPage'
import UserDetailPage from 'components/pages/users/userDetailPage'
import NonContainerAutoGraderForm from './pages/forms/containers/nonContainerAutoGraderForm'
import GradebookStudentPage from './pages/gradebook/gradebookStudentPage'
import GradebookInstructorPage from './pages/gradebook/gradebookInstructorPage'
import SubmissionFeedbackPage from './pages/submissions/submissionFeedbackPage'
import ContainerAutoGraderForm from './pages/forms/containers/containerAutoGraderForm'
import CoursePreviewPage from './pages/courses/coursePreviewPage'
import CoursesListPage from "./pages/listPages/courses/coursesListPage";
import AssignmentProblemFormPage from './pages/forms/assignments/assignmentProblemFormPage'
import InstructorSubmissionspage from "./pages/submissions/InstructorSubmissionspage";
import SubmissionFileView from './pages/submissions/submissionFileView'

import WebhookURLForm from './pages/webhookURLForm'

const AuthenticatedRouter = () => (
    <Switch>

        <Route exact path='/' component={HomePage}/>
        <Route exact path='/courses' component={CoursesListPage}/>
        <Route exact path='/addCoursesForm' component={EditCourseFormPage}/>

        <Route exact path='/user/:userId/update' component={UserDetailPage}/>

        <Route exact path='/course/:courseId' component={CourseDetailPage}/>
        <Route exact path='/course/:courseId/preview' component={CoursePreviewPage}/>
        <Route exact path='/course/:courseId/update' component={CourseUpdatePage}/>
        <Route exact path='/course/:courseId/gradebook' component={GradebookStudentPage}/>
        <Route exact path='/course/:courseId/createAssignment' component={AssignmentCreatePage}/>
        <Route exact path='/course/:courseId/gradebook/instructor' component={GradebookInstructorPage}/>

        <Route exact path='/course/:courseId/assignment/:assignmentId' component={AssignmentDetailPage}/>
        <Route exact path='/course/:courseId/assignment/:assignmentId/update' component={AssignmentUpdatePage}/>
        <Route exact path='/course/:courseId/assignment/:assignmentId/createNCAG'
               component={NonContainerAutoGraderForm}/>
        <Route exact path='/course/:courseId/assignment/:assignmentId/createCAG' component={ContainerAutoGraderForm}/>
        <Route exact path='/course/:courseId/assignment/:assignmentId/createProblem' component={AssignmentProblemFormPage}/>
        <Route exact path='/course/:courseId/webhooks' component={WebhookURLForm}/>

        <Route exact path='/course/:courseId/assignment/:assignmentId/submission/:submissionId'
               component={SubmissionDetailPage}/>
            <Route exact path='/course/:courseId/assignment/:assignmentId/submissions'
                   component={InstructorSubmissionspage}/>
        <Route exact path='/course/:courseId/assignment/:assignmentId/submission/:submissionId/feedback'
               component={SubmissionFeedbackPage}/>
       <Route exact path ='/course/:courseId/assignment/:assignmentId/submission/:submissionId/fileView' component={SubmissionFileView}/>
       // TBD, undecided where webhooks should be placed
        {/*<Route exact path='/webhookURLPage' component={webhookURLForm}/>*/}

        <Route component={NotFoundPage}/>
    </Switch>
)

export default AuthenticatedRouter
