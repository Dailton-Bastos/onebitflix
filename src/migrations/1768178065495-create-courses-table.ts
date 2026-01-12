import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableColumn,
	TableForeignKey,
	TableIndex
} from 'typeorm'

export class CreateCoursesTable1768178065495 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'courses',
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
						name: 'synopsis',
						type: 'varchar',
						isNullable: false
					},
					{
						name: 'thumbnail_url',
						type: 'varchar',
						isNullable: true
					},
					{
						name: 'featured',
						type: 'boolean',
						default: false
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
			'courses',
			new TableIndex({
				name: 'IDX_COURSES_NAME',
				columnNames: ['name']
			})
		)

		await queryRunner.addColumn(
			'courses',
			new TableColumn({
				name: 'category_id',
				type: 'int',
				isNullable: false
			})
		)

		await queryRunner.createForeignKey(
			'courses',
			new TableForeignKey({
				columnNames: ['category_id'],
				referencedTableName: 'categories',
				referencedColumnNames: ['id'],
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT'
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('courses')

		const foreignKey = table?.foreignKeys.find(
			(fk) => fk.columnNames.indexOf('category_id') !== -1
		)

		if (foreignKey) {
			await queryRunner.dropForeignKey('courses', foreignKey)
			await queryRunner.dropColumn('courses', 'category_id')
		}

		await queryRunner.dropIndex('courses', 'IDX_COURSES_NAME')
		await queryRunner.dropTable('courses')
	}
}
