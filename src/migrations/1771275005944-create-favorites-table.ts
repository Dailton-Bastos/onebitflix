import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey
} from 'typeorm'

export class CreateFavoritesTable1771275005944 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'favorites',
				columns: [
					{
						name: 'user_id',
						type: 'int',
						isPrimary: true,
						isNullable: false
					},
					{
						name: 'course_id',
						type: 'int',
						isPrimary: true,
						isNullable: false
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'now()'
					}
				]
			}),
			true
		)

		await queryRunner.createForeignKey(
			'favorites',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			})
		)

		await queryRunner.createForeignKey(
			'favorites',
			new TableForeignKey({
				columnNames: ['course_id'],
				referencedTableName: 'courses',
				referencedColumnNames: ['id'],
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('favorites')

		const userForeignKey = table?.foreignKeys.find(
			(fk) => fk.columnNames.indexOf('user_id') !== -1
		)

		if (userForeignKey) {
			await queryRunner.dropForeignKey('favorites', userForeignKey)
		}

		const courseForeignKey = table?.foreignKeys.find(
			(fk) => fk.columnNames.indexOf('course_id') !== -1
		)

		if (courseForeignKey) {
			await queryRunner.dropForeignKey('favorites', courseForeignKey)
		}

		await queryRunner.dropTable('favorites')
	}
}
