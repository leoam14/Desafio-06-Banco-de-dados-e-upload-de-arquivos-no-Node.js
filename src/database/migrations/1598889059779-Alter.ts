import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";
import { TableColumn } from "typeorm";

export class Alter1598889059779 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.createForeignKey("transactions", new TableForeignKey({
            name: "category_fk",
            columnNames: ["category_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "categories",
            onDelete:"SET NULL",
            onUpdate: "CASCADE"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("transactions","category_id");
    }

}