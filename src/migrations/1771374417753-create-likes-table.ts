import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey
} from 'typeorm'

export class CreateLikesTable1771374417753 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'likes',
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
			'likes',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			})
		)

		await queryRunner.createForeignKey(
			'likes',
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
		const table = await queryRunner.getTable('likes')

		const userForeignKey = table?.foreignKeys.find(
			(fk) => fk.columnNames.indexOf('user_id') !== -1
		)

		if (userForeignKey) {
			await queryRunner.dropForeignKey('likes', userForeignKey)
		}

		const courseForeignKey = table?.foreignKeys.find(
			(fk) => fk.columnNames.indexOf('course_id') !== -1
		)

		if (courseForeignKey) {
			await queryRunner.dropForeignKey('likes', courseForeignKey)
		}

		await queryRunner.dropTable('likes')
	}
}
