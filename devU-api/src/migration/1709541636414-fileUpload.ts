import { MigrationInterface, QueryRunner } from 'typeorm'

export class fileUpload1709541636414 implements MigrationInterface {
  name = 'fileUpload1709541636414'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "FilesAuth" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "course_id" integer NOT NULL, "assignment_id" integer NOT NULL, "user_id" integer NOT NULL, "filename" character varying(128) NOT NULL, "bucket" character varying(64) NOT NULL, CONSTRAINT "PK_1f230e6f691b8fbdf0fb4b6cb79" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "FilesAuth" ADD CONSTRAINT "FK_8a72cf4a87234d581d04e34e5fe" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "FilesAuth" ADD CONSTRAINT "FK_a906cfad4f214af17efcdcc4a85" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "FilesAuth" ADD CONSTRAINT "FK_06a0cc4fd4dd414b312ca3de0ef" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "FilesAuth" DROP CONSTRAINT "FK_06a0cc4fd4dd414b312ca3de0ef"`)
    await queryRunner.query(`ALTER TABLE "FilesAuth" DROP CONSTRAINT "FK_a906cfad4f214af17efcdcc4a85"`)
    await queryRunner.query(`ALTER TABLE "FilesAuth" DROP CONSTRAINT "FK_8a72cf4a87234d581d04e34e5fe"`)
    await queryRunner.query(`DROP TABLE "FilesAuth"`)
  }
}
