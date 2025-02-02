import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import AssignmentModel from '../assignment/assignment.model'
import UserModel from '../user/user.model'

@Entity('assignment_scores')
export default class AssignmentScoreModel {
  /**
   * @swagger
   * tags:
   *   - name: AssignmentScore
   *     description:
   * components:
   *  schemas:
   *    AssignmentScore:
   *      type: object
   *      required: [assignmentId, userId, score]
   *      properties:
   *        assignmentId:
   *          type: integer
   *        userId:
   *          type: integer
   *        score:
   *          type: number
   */

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'assignment_id' })
  @JoinColumn({ name: 'assignment_id' })
  @ManyToOne(() => AssignmentModel)
  assignmentId: number

  @Column({ name: 'user_id' })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserModel)
  userId: number

  @Column({ name: 'score', nullable: true })
  score: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
