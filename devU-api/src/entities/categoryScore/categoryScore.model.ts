import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Entity,
} from 'typeorm'

import CategoryModel from '../category/category.model'
import CourseModel from '../course/course.model'
import UserModel from '../user/user.model'

@Entity('category_score')
export default class CategoryScoreModel {
  /**
   * @swagger
   * tags:
   *   - name: CategoryScores
   *     description: Route is currently non-functional, TS2305 error (Issue #34)
   * components:
   *  schemas:
   *    CategoryScore:
   *      type: object
   *      required: [category, courseId, userId, score]
   *      properties:
   *        category:
   *          type: string
   *        courseId:
   *          type: integer
   *        userId:
   *          type: integer
   *        score:
   *          type: number
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

  @Column({ name: 'user_id' })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserModel)
  userId: number

  @Column({ name: 'category_id' })
  @JoinColumn({ name: 'category_id' })
  @ManyToOne(() => CategoryModel)
  categoryId: number

  @Column({ name: 'score', type: 'float', nullable: true })
  score: number
}
