import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostTable1687735153470 implements MigrationInterface {
    name = 'UpdatePostTable1687735153470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, "content" character varying NOT NULL, "conversationId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "conversation_id_seq" OWNED BY "conversation"."id"`);
        await queryRunner.query(`ALTER TABLE "conversation" ALTER COLUMN "id" SET DEFAULT nextval('"conversation_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`);
        await queryRunner.query(`ALTER TABLE "conversation" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "conversation_id_seq"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
