import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateCategoriesTable1768167595924 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'categories',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment'
					},
					{
						name: 'name',
						type: 'varchar',
						isNullable: false
					},
					{
						name: 'position',
						type: 'int',
						isNullable: false
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'now()'
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						default: 'now()'
					}
				]
			}),
			true
		)

		await queryRunner.createIndex(
			'categories',
			new TableIndex({
				name: 'IDX_CATEGORIES_NAME',
				columnNames: ['name']
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropIndex('categories', 'IDX_CATEGORIES_NAME')
		await queryRunner.dropTable('categories')
	}
}
