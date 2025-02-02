import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'

@Entity('users')
export default class UserModel {
  /**
   * @swagger
   * tags:
   *   - name: Users
   *     description:
   * components:
   *  schemas:
   *    User:
   *      type: object
   *      required: [email, externalId]
   *      properties:
   *        email:
   *          type: string
   *        externalId:
   *          type: string
   *        preferredName:
   *          type: string
   */
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @Column({ length: 320, unique: true, nullable: false })
  email: string

  @Column({ name: 'external_id', length: 320, unique: true, nullable: false })
  externalId: string

  @Column({ name: 'preferred_name', length: 128, nullable: true })
  preferredName: string

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean
}
