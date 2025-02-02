import {
  JoinColumn,
  ManyToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

import AssignmentModel from '../assignment/assignment.model'
import CourseModel from '../course/course.model'
import UserModel from '../user/user.model'

@Entity('submissions')
export default class SubmissionModel {
  /**
   * @swagger
   * tags:
   *   - name: Submissions
   *     description: originalSubmissionId field is left out of schema due to issues with sending null as an optional value
   * components:
   *  schemas:
   *    Submission:
   *      type: object
   *      properties:
   *        courseId:
   *          type: integer
   *        assignmentId:
   *          type: integer
   *        userId:
   *          type: integer
   *        content:
   *          type: string
   *        submitterIp:
   *          type: string
   *        submittedBy:
   *          type: integer
   *        files:
   *          type: string
   *          format: binary
   */
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @Column({ name: 'course_id' })
  @JoinColumn({ name: 'course_id' })
  @ManyToOne(() => CourseModel)
  courseId: number

  @Column({ name: 'assignment_id' })
  @JoinColumn({ name: 'assignment_id' })
  @ManyToOne(() => AssignmentModel)
  assignmentId: number

  @Column({ name: 'user_id' })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserModel)
  userId: number

  @Column({ name: 'content' })
  content: string

  // Should never be set by anyone other than the API
  @Column({ name: 'submitter_ip', length: 64 })
  submitterIp: string

  // Hard overridden by the API - only differs from userId when someone submits on behalf of another user (regrade)
  @Column({ name: 'submitted_by' })
  @JoinColumn({ name: 'submitted_by' })
  @ManyToOne(() => UserModel)
  submittedBy: number
}
