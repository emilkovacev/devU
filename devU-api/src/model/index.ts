import AssignmentModel from '../entities/assignment/assignment.model'
import AssignmentProblemModel from '../entities/assignmentProblem/assignmentProblem.model'
import AssignmentScoreModel from '../entities/assignmentScore/assignmentScore.model'
import CategoryModel from '../entities/category/category.model'
import CategoryScoreModel from '../entities/categoryScore/categoryScore.model'
import ContainerAutoGraderModel from '../entities/containerAutoGrader/containerAutoGrader.model'
import CourseModel from '../entities/course/course.model'
import CourseScoreModel from '../entities/courseScore/courseScore.model'
import NonContainerAutoGraderModel from '../entities/nonContainerAutoGrader/nonContainerAutoGrader.model'
import SubmissionModel from '../entities/submission/submission.model'
import SubmissionProblemScoreModel from '../entities/submissionProblemScore/submissionProblemScore.model'
import SubmissionScoreModel from '../entities/submissionScore/submissionScore.model'
import UserModel from '../entities/user/user.model'
import UserCourseModel from '../entities/userCourse/userCourse.model'
import FileModel from '../fileUpload/fileUpload.model'
import DeadlineExtensionsModel from '../entities/deadlineExtensions/deadlineExtensions.model'

type Models =
  | AssignmentModel
  | AssignmentProblemModel
  | AssignmentScoreModel
  | CategoryScoreModel
  | ContainerAutoGraderModel
  | CourseModel
  | CourseScoreModel
  | NonContainerAutoGraderModel
  | SubmissionModel
  | SubmissionProblemScoreModel
  | SubmissionScoreModel
  | UserModel
  | UserCourseModel
  | CategoryModel
  | FileModel
  | DeadlineExtensionsModel

export default Models
