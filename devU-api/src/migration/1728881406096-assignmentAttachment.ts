import { MigrationInterface, QueryRunner } from "typeorm";

export class AssignmentAttachment1728881406096 implements MigrationInterface {
    name = 'AssignmentAttachment1728881406096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignments" ADD "attachmentsHashes" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "assignments" ADD "attachmentsFilenames" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignments" DROP COLUMN "attachmentsFilenames"`);
        await queryRunner.query(`ALTER TABLE "assignments" DROP COLUMN "attachmentsHashes"`);
    }

}
