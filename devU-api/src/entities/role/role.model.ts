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

@Entity('role')
export default class RoleModel {
  /**
   * @swagger
   * tags:
   *   - name: Role
   * components:
   *  schemas:
   *    Role:
   *      type: object
   *      required: []
   *      properties:
   *        permission:
   *          type: boolean
   */
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'course_id' })
  @JoinColumn({ name: 'course_id' })
  @ManyToOne(() => CourseModel)
  courseId: number

  // @Column({name: 'user_id'})
  // @JoinColumn({name: 'user_id'})
  // @ManyToOne(() => UserModel)
  // userId: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @Column({ name: 'name' })
  name: string

  // All the permission options //

  // For default permission that everyone in the course should always have
  @Column({ name: 'enrolled' })
  enrolled: boolean

  @Column({ name: 'course_edit' })
  courseEdit: boolean

  @Column({ name: 'course_view_all' })
  courseViewAll: boolean

  @Column({ name: 'assignment_view_all' })
  assignmentViewAll: boolean

  @Column({ name: 'assignment_edit_all' }) // includes category_edit + autograders_edit_all
  assignmentEditAll: boolean

  // student perm
  @Column({ name: 'assignment_view_release' })
  assignmentViewReleased: boolean

  @Column({ name: 'scores_view_all' })
  scoresViewAll: boolean

  @Column({ name: 'scores_edit_all' })
  scoresEditAll: boolean

  // student perm
  @Column({ name: 'scores_view_self_released' })
  scoresViewSelfReleased: boolean

  @Column({ name: 'role_edit_all' }) // TODO: can only delete a role if no one has that role. Some way of preventing the course from being soft-locked
  roleEditAll: boolean

  @Column({ name: 'role_view_all' })
  roleViewAll: boolean

  @Column({ name: 'role_view_self' }) // everyone can do this so the front end knows what to render
  roleViewSelf: boolean

  @Column({ name: 'submission_change_state' }) // For soft-soft delete. Marked as "doesn't count" but can still be viewed by the student
  submissionChangeState: boolean

  @Column({ name: 'submission_create_all' })
  submissionCreateAll: boolean

  // student perm
  @Column({ name: 'submission_create_self' })
  submissionCreateSelf: boolean

  @Column({ name: 'submission_view_all' })
  submissionViewAll: boolean

  @Column({ name: 'user_course_edit_all' }) // TODO: Don't let the last instructor change their role
  userCourseEditAll: boolean

  @Column({ name: 'sticky_note_view_all' })
  stickyNoteViewAll: boolean

  @Column({ name: 'sticky_note_edit_all' })
  stickyNoteEditAll: boolean
}
