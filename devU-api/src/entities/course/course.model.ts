import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'

@Entity('courses')
export default class CourseModel {
  /**
   * @swagger
   * tags:
   *   - name: Courses
   *     description:
   * components:
   *  schemas:
   *    Course:
   *      type: object
   *      required: [name, semester, number, startDate, endDate]
   *      properties:
   *        name:
   *          type: string
   *        semester:
   *          type: string
   *          description: Must be in the format 'u2021, f2021, s2022, w2022'
   *        number:
   *          type: string
   *        startDate:
   *          type: string
   *          format: date-time
   *          description: Must be in ISO 8601 format
   *        endDate:
   *          type: string
   *          format: date-time
   *          description: Must be in ISO 8601 format
   */

  @PrimaryGeneratedColumn()
  id: number

  // TODO: Do we add OG instructor here so creator can have all permissions and also can't be removed from the course?

  @Column({ length: 128 })
  name: string

  @Column({ length: 16 })
  semester: string

  @Column({ length: 128 })
  number: string

  @Column({ name: 'start_date' })
  startDate: Date

  @Column({ name: 'end_date' })
  endDate: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @Column({ type: 'boolean', name: 'is_public', default: false }) 
  isPublic: boolean;
  
  @Column({ name: 'private_data', type: 'timestamp', default: () => 'now()' })
  private_data?: Date;

}
