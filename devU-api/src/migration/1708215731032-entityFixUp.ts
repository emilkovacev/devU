import { MigrationInterface, QueryRunner } from 'typeorm'

export class entityFixUp1708215731032 implements MigrationInterface {
  name = 'entityFixUp1708215731032'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "assignments_to_courses_foreign_key_constraint"`)
    await queryRunner.query(
      `ALTER TABLE "assignment_problems" DROP CONSTRAINT "assignment_problems_to_assignment_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_original_submission_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_submitted_by_user_id_foreign_key_constraint"`
    )
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_user_id_foreign_key_constraint"`)
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_assignment_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "submissions_to_course_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "submission_problem_scores" DROP CONSTRAINT "submission_problem_scores_to_assignment_problem_id_foreign_key_"`
    )
    await queryRunner.query(
      `ALTER TABLE "submission_problem_scores" DROP CONSTRAINT "submission_problem_scores_to_submission_id_foreign_key_constrai"`
    )
    await queryRunner.query(
      `ALTER TABLE "submission_scores" DROP CONSTRAINT "submission_scores_to_submission_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_course_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_courses" DROP CONSTRAINT "user_courses_to_user_id_foreign_key_constraint"`
    )
    await queryRunner.query(
      `CREATE TABLE "assignment_scores" ("id" SERIAL NOT NULL, "assignment_id" integer NOT NULL, "user_id" integer NOT NULL, "score" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_8b251f15adfa96a86b0f5f8556f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "course_id" integer NOT NULL, "name" character varying(128) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "category_score" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "course_id" integer NOT NULL, "user_id" integer NOT NULL, "category_id" integer NOT NULL, "score" double precision, CONSTRAINT "PK_ad3547334f4540fcb508aa55cd2" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "container_auto_grader" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "assignment_id" integer NOT NULL, "grader_filename" character varying(128) NOT NULL, "makefile_filename" text, "autograding_image" character varying NOT NULL, "timeout" integer NOT NULL, CONSTRAINT "PK_d675941b6e755fb495b5a5fa7d0" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "courseScore" ("id" SERIAL NOT NULL, "course_id" integer NOT NULL, "user_id" integer NOT NULL, "score" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_6abff3c90b96cef828a38135c7f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "nonContainerAutoGrader" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "assignment_id" integer NOT NULL, "question" character varying(128) NOT NULL, "score" integer NOT NULL, "correct_string" character varying(128) NOT NULL, CONSTRAINT "PK_e4bee0253f704dad3db68b60df7" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "assignments" DROP COLUMN "grading_type"`)
    await queryRunner.query(`DROP TYPE "public"."assignments_grading_type_enum"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "original_submission_id"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TYPE "public"."submissions_type_enum"`)
    await queryRunner.query(
      `ALTER TABLE "assignments" ADD CONSTRAINT "FK_33f833f305070d2d4e6305d8a0c" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment_problems" ADD CONSTRAINT "FK_939580320b59824a3b8ee61e1f7" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment_scores" ADD CONSTRAINT "FK_cffbea35d0c9f6588a641eacf17" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment_scores" ADD CONSTRAINT "FK_673ea1a5ccc2f6612fb1310ec1c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_becefa4788db15281f585822095" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "category_score" ADD CONSTRAINT "FK_c88ba5a4f5d548138457cb6c967" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "category_score" ADD CONSTRAINT "FK_0a3a3e1ab14b8690e52939da390" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "category_score" ADD CONSTRAINT "FK_41d5d4b618bbb9c9a2a0a4392a8" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "container_auto_grader" ADD CONSTRAINT "FK_ab00685bcc7b626e483870ebd73" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "courseScore" ADD CONSTRAINT "FK_7911c9a858be7b4836154eea7ae" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "courseScore" ADD CONSTRAINT "FK_6b89c87198bb05ada5900364ac8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nonContainerAutoGrader" ADD CONSTRAINT "FK_7f4461171c55020ab0680ecbcd0" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_6fc42b2f2983dd099fec7978444" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_8723840b9b0464206640c268abc" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_d89b2ee682c9475006762b666ef" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submission_problem_scores" ADD CONSTRAINT "FK_0b66632ab30113691b7044719e3" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submission_problem_scores" ADD CONSTRAINT "FK_5a40a69e4a9c4adf229c5eb3d84" FOREIGN KEY ("assignment_problem_id") REFERENCES "assignment_problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submission_scores" ADD CONSTRAINT "FK_60b6432533ce75c224598af6bf5" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_courses" ADD CONSTRAINT "FK_7ecb10d15b858768c36d37727f9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_courses" ADD CONSTRAINT "FK_d65a2771413a10753d76937b3d6" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`ALTER TABLE "nonContainerAutoGrader"
            ADD "is_regex" boolean NOT NULL;`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_courses" DROP CONSTRAINT "FK_d65a2771413a10753d76937b3d6"`)
    await queryRunner.query(`ALTER TABLE "user_courses" DROP CONSTRAINT "FK_7ecb10d15b858768c36d37727f9"`)
    await queryRunner.query(`ALTER TABLE "submission_scores" DROP CONSTRAINT "FK_60b6432533ce75c224598af6bf5"`)
    await queryRunner.query(`ALTER TABLE "submission_problem_scores" DROP CONSTRAINT "FK_5a40a69e4a9c4adf229c5eb3d84"`)
    await queryRunner.query(`ALTER TABLE "submission_problem_scores" DROP CONSTRAINT "FK_0b66632ab30113691b7044719e3"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_d89b2ee682c9475006762b666ef"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_8723840b9b0464206640c268abc"`)
    await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_6fc42b2f2983dd099fec7978444"`)
    await queryRunner.query(`ALTER TABLE "nonContainerAutoGrader" DROP CONSTRAINT "FK_7f4461171c55020ab0680ecbcd0"`)
    await queryRunner.query(`ALTER TABLE "courseScore" DROP CONSTRAINT "FK_6b89c87198bb05ada5900364ac8"`)
    await queryRunner.query(`ALTER TABLE "courseScore" DROP CONSTRAINT "FK_7911c9a858be7b4836154eea7ae"`)
    await queryRunner.query(`ALTER TABLE "container_auto_grader" DROP CONSTRAINT "FK_ab00685bcc7b626e483870ebd73"`)
    await queryRunner.query(`ALTER TABLE "category_score" DROP CONSTRAINT "FK_41d5d4b618bbb9c9a2a0a4392a8"`)
    await queryRunner.query(`ALTER TABLE "category_score" DROP CONSTRAINT "FK_0a3a3e1ab14b8690e52939da390"`)
    await queryRunner.query(`ALTER TABLE "category_score" DROP CONSTRAINT "FK_c88ba5a4f5d548138457cb6c967"`)
    await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_becefa4788db15281f585822095"`)
    await queryRunner.query(`ALTER TABLE "assignment_scores" DROP CONSTRAINT "FK_673ea1a5ccc2f6612fb1310ec1c"`)
    await queryRunner.query(`ALTER TABLE "assignment_scores" DROP CONSTRAINT "FK_cffbea35d0c9f6588a641eacf17"`)
    await queryRunner.query(`ALTER TABLE "assignment_problems" DROP CONSTRAINT "FK_939580320b59824a3b8ee61e1f7"`)
    await queryRunner.query(`ALTER TABLE "assignments" DROP CONSTRAINT "FK_33f833f305070d2d4e6305d8a0c"`)
    await queryRunner.query(`CREATE TYPE "public"."submissions_type_enum" AS ENUM('filepath', 'json', 'text')`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD "type" "submissions_type_enum" NOT NULL`)
    await queryRunner.query(`ALTER TABLE "submissions" ADD "original_submission_id" integer`)
    await queryRunner.query(
      `CREATE TYPE "public"."assignments_grading_type_enum" AS ENUM('code', 'non-code', 'manual')`
    )
    await queryRunner.query(`ALTER TABLE "assignments" ADD "grading_type" "assignments_grading_type_enum" NOT NULL`)
    await queryRunner.query(`DROP TABLE "nonContainerAutoGrader"`)
    await queryRunner.query(`DROP TABLE "courseScore"`)
    await queryRunner.query(`DROP TABLE "container_auto_grader"`)
    await queryRunner.query(`DROP TABLE "category_score"`)
    await queryRunner.query(`DROP TABLE "category"`)
    await queryRunner.query(`DROP TABLE "assignment_scores"`)
    await queryRunner.query(
      `ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_user_id_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_to_course_id_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submission_scores" ADD CONSTRAINT "submission_scores_to_submission_id_foreign_key_constraint" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submission_problem_scores" ADD CONSTRAINT "submission_problem_scores_to_submission_id_foreign_key_constrai" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submission_problem_scores" ADD CONSTRAINT "submission_problem_scores_to_assignment_problem_id_foreign_key_" FOREIGN KEY ("assignment_problem_id") REFERENCES "assignment_problems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_course_id_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_assignment_id_foreign_key_constraint" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_user_id_foreign_key_constraint" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_submitted_by_user_id_foreign_key_constraint" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "submissions_to_original_submission_id_foreign_key_constraint" FOREIGN KEY ("original_submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "assignment_problems" ADD CONSTRAINT "assignment_problems_to_assignment_id_foreign_key_constraint" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "assignments" ADD CONSTRAINT "assignments_to_courses_foreign_key_constraint" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
