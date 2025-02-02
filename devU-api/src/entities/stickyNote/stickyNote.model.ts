import {
    JoinColumn,
    ManyToOne,
    Entity,
    Column,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm'

import SubmissionModel from '../submission/submission.model'

@Entity('sticky_notes')
export default class StickyNotesModel {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'submissionId' })
    @JoinColumn({ name: 'submissionId' })
    @ManyToOne(() => SubmissionModel)
    submissionId: number

    @Column({ name: 'content' })
    content: string

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt?: Date
}