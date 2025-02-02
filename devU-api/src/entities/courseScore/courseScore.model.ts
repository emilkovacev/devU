import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'

import CourseModel from '../course/course.model'
import UserModel from '../user/user.model'

@Entity('courseScore')
export default class CourseScoreModel {
  /**
   * @swagger
   * tags:
   *   - name: CourseScores
   *     description: Route is currently non-functional, TS2305 error
   * components:
   *  schemas:
   *    CourseScore:
   *      type: object
   *      required: [courseId, score]
   *      properties:
   *        courseId:
   *          type: integer
   *        score:
   *          type: number
   *        letterGrade:
   *          type: string
   */
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'course_id' })
  @JoinColumn({ name: 'course_id' })
  @ManyToOne(() => CourseModel)
  courseId: number

  @Column({ name: 'user_id' })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserModel)
  userId: number

  @Column({ name: 'score' })
  score: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
