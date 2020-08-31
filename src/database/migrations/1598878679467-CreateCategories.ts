import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCategories1598878679467 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name:"categories",
            columns:[
                {
                    name:'id',
                    type:'uuid',
                    isPrimary:true,
                    generationStrategy:'uuid',
                    default:'uuid_generate_v4()'
                },
                {
                    name: 'title',
                    type:'varchar',
                    isNullable:false
                },
                {
                    name: "created_at",
                    type:"timestamp",
                    default: "now()",
                },
                {
                    name: "updated_at",
                    type:"timestamp",
                    default: "now()",
                }
            ]
        })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable("categories")
    }

}