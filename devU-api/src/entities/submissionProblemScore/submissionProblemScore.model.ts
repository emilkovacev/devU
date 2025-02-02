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

import SubmissionModel from '../submission/submission.model'
import AssignmentProblemModel from '../assignmentProblem/assignmentProblem.model'

@Entity('submission_problem_scores')
export default class SubmissionProblemScoreModel {
  /**
   * @swagger
   * tags:
   *   - name: SubmissionProblemScores
   *     description:
   * components:
   *  schemas:
   *    SubmissionProblemScore:
   *      type: object
   *      required: [submissionId, assignmentProblemId, score, releasedAt]
   *      properties:
   *        submissionId:
   *          type: integer
   *        assignmentProblemId:
   *          type: integer
   *        score:
   *          type: number
   *        feedback:
   *          type: string
   *        releasedAt:
   *          type: string
   *          format: date-time
   *          description: Must be in ISO 8601 format
   */
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'submission_id' })
  @JoinColumn({ name: 'submission_id' })
  @ManyToOne(() => SubmissionModel)
  submissionId: number

  @Column({ name: 'assignment_problem_id' })
  @JoinColumn({ name: 'assignment_problem_id' })
  @ManyToOne(() => AssignmentProblemModel)
  assignmentProblemId: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @Column({ name: 'score', type: 'float', nullable: true })
  score: number | null

  @Column({ name: 'feedback', type: 'text', nullable: true })
  feedback: string | null

  @Column({ name: 'released_at', nullable: true })
  releasedAt?: Date
}
