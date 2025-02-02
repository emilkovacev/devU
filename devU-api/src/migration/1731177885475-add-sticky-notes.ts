import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStickyNotes1731177885475 implements MigrationInterface {
    name = 'AddStickyNotes1731177885475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sticky_notes" ("id" SERIAL NOT NULL, "submissionId" integer NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_615fc1d0c6b75c46aa2a7dd5f0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sticky_notes" ADD CONSTRAINT "FK_a92bd7a1dc5c606db210b176a43" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sticky_notes" DROP CONSTRAINT "FK_a92bd7a1dc5c606db210b176a43"`);
        await queryRunner.query(`DROP TABLE "sticky_notes"`);
    }

}
