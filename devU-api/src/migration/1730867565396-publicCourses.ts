import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730867565396 implements MigrationInterface {
    name = 'Migration1730867565396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        //have to use raw SQL to fix queryfailederror for columns that already exist
        const isPublicExists = await queryRunner.query(` 
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'courses' AND column_name = 'is_public';
        `);

        if (isPublicExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "courses" ADD "is_public" boolean NOT NULL DEFAULT false`);
        }

        const privateDataExists = await queryRunner.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'courses' AND column_name = 'private_data';
        `);

        if (privateDataExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "courses" ADD "private_data" TIMESTAMP NOT NULL DEFAULT now()`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN IF EXISTS "private_data"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN IF EXISTS "is_public"`);
    }
}
