import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedRolesWithStickyNotes1731433278166 implements MigrationInterface {
    name = 'UpdatedRolesWithStickyNotes1731433278166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "sticky_note_view_all" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role" ADD "sticky_note_edit_all" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "sticky_note_edit_all"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "sticky_note_view_all"`);
    }

}
