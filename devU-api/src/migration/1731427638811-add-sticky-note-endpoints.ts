import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStickyNoteEndpoints1731427638811 implements MigrationInterface {
    name = 'AddStickyNoteEndpoints1731427638811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sticky_notes" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sticky_notes" DROP COLUMN "deleted_at"`);
    }

}
