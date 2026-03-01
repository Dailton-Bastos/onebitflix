import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableIndex
} from 'typeorm'

export class CreateWatchTimesTable1771704184711 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'watch_times',
				columns: [
					{
						name: 'seconds',
						type: 'int',
						isNullable: false
					},
					{
						name: 'user_id',
						type: 'int',
						isPrimary: true,
						isNullable: false
					},
					{
						name: 'episode_id',
						type: 'int',
						isPrimary: true,
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

		await queryRunner.createForeignKey(
			'watch_times',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			})
		)

		await queryRunner.createForeignKey(
			'watch_times',
			new TableForeignKey({
				columnNames: ['episode_id'],
				referencedTableName: 'episodes',
				referencedColumnNames: ['id'],
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			})
		)

		await queryRunner.createIndex(
			'watch_times',
			new TableIndex({
				name: 'IDX_WATCH_TIMES_USER_ID_EPISODE_ID',
				columnNames: ['user_id', 'episode_id']
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('watch_times')

		const userForeignKey = table?.foreignKeys.find(
			(fk) => fk.columnNames.indexOf('user_id') !== -1
		)

		if (userForeignKey) {
			await queryRunner.dropForeignKey('watch_times', userForeignKey)
		}

		const episodeForeignKey = table?.foreignKeys.find(
			(fk) => fk.columnNames.indexOf('episode_id') !== -1
		)

		if (episodeForeignKey) {
			await queryRunner.dropForeignKey('watch_times', episodeForeignKey)
		}

		await queryRunner.dropIndex(
			'watch_times',
			'IDX_WATCH_TIMES_USER_ID_EPISODE_ID'
		)

		await queryRunner.dropTable('watch_times')
	}
}
