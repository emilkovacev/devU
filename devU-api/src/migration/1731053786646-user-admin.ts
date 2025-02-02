import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAdmin1731053786646 implements MigrationInterface {
    name = 'UserAdmin1731053786646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_admin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_admin"`);
    }

}
