import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableColumn,
	TableForeignKey,
	TableIndex
} from 'typeorm'

export class CreateEpisodesTable1768314662007 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'episodes',
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
						name: 'order',
						type: 'int',
						isNullable: false
					},
					{
						name: 'video_url',
						type: 'varchar',
						isNullable: true
					},
					{
						name: 'seconds_long',
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
			'episodes',
			new TableIndex({
				name: 'IDX_EPISODES_NAME',
				columnNames: ['name']
			})
		)

		await queryRunner.addColumn(
			'episodes',
			new TableColumn({
				name: 'course_id',
				type: 'int',
				isNullable: false
			})
		)

		await queryRunner.createForeignKey(
			'episodes',
			new TableForeignKey({
				columnNames: ['course_id'],
				referencedTableName: 'courses',
				referencedColumnNames: ['id'],
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT'
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('episodes')

		const foreignKey = table?.foreignKeys.find(
			(fk) => fk.columnNames.indexOf('course_id') !== -1
		)

		if (foreignKey) {
			await queryRunner.dropForeignKey('episodes', foreignKey)
			await queryRunner.dropColumn('episodes', 'course_id')
		}

		await queryRunner.dropIndex('episodes', 'IDX_EPISODES_NAME')
		await queryRunner.dropTable('episodes')
	}
}
