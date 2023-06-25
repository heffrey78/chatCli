import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class InitialMigration1687734169035 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createDatabase("chatcli", true);

        await queryRunner.createTable(
            new Table({
                name: "conversation",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                ],
            }),
            true,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("conversation");
        await queryRunner.dropDatabase("chatcli", true);
    }

}
