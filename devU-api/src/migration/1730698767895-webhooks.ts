import { MigrationInterface, QueryRunner } from "typeorm";

export class Webhooks1730698767895 implements MigrationInterface {
    name = 'Webhooks1730698767895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Webhooks" ("id" SERIAL NOT NULL, "destination_url" character varying NOT NULL, "matcher_url" character varying NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_ef540eaf209b4e5cb871ea34910" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Webhooks" ADD CONSTRAINT "FK_0831572f37f912eed2756aef1af" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Webhooks" DROP CONSTRAINT "FK_0831572f37f912eed2756aef1af"`);
        await queryRunner.query(`DROP TABLE "Webhooks"`);
    }

}
