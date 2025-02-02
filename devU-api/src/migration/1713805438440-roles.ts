import { MigrationInterface, QueryRunner } from 'typeorm'

export class roles1713805438440 implements MigrationInterface {
  name = 'roles1713805438440'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_courses" RENAME COLUMN "type" TO "role"`)
    await queryRunner.query(`ALTER TYPE "public"."user_courses_type_enum" RENAME TO "user_courses_role_enum"`)
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "course_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "enrolled" boolean NOT NULL, "course_edit" boolean NOT NULL, "course_view_all" boolean NOT NULL, "assignment_view_all" boolean NOT NULL, "assignment_edit_all" boolean NOT NULL, "assignment_view_release" boolean NOT NULL, "scores_view_all" boolean NOT NULL, "scores_edit_all" boolean NOT NULL, "scores_view_self_released" boolean NOT NULL, "role_edit_all" boolean NOT NULL, "role_view_all" boolean NOT NULL, "role_view_self" boolean NOT NULL, "submission_change_state" boolean NOT NULL, "submission_create_all" boolean NOT NULL, "submission_create_self" boolean NOT NULL, "submission_view_all" boolean NOT NULL, "user_course_edit_all" boolean NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "user_courses" DROP COLUMN "role"`)
    await queryRunner.query(`ALTER TABLE "user_courses" ADD "role" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_3c1c31ab1941f90200d36a236b3" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_3c1c31ab1941f90200d36a236b3"`)
    await queryRunner.query(`ALTER TABLE "user_courses" DROP COLUMN "role"`)
    await queryRunner.query(`ALTER TABLE "user_courses" ADD "role" "user_courses_role_enum" NOT NULL`)
    await queryRunner.query(`DROP TABLE "role"`)
    await queryRunner.query(`ALTER TYPE "user_courses_role_enum" RENAME TO "user_courses_type_enum"`)
    await queryRunner.query(`ALTER TABLE "user_courses" RENAME COLUMN "role" TO "type"`)
  }
}
