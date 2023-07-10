import { MigrationInterface, QueryRunner } from "typeorm"

export class ActivatePgvector1688726908996 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE EXTENSION vector;");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP EXTENSION vector;");
    }

}
