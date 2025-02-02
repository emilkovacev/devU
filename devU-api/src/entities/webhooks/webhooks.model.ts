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

import UserModel from '../user/user.model'

@Entity('Webhooks')
export default class WebhooksModel {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: 'destination_url'})
  destinationUrl: string

  @Column({name: 'matcher_url'})
  matcherUrl: string

  @Column({ name: 'user_id' })
  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserModel)
  userId: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
