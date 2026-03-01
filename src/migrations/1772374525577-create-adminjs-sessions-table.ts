import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateAdminjsSessionsTable1772374525577
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'adminjs_sessions',
				columns: [
					{
						name: 'sid',
						type: 'varchar',
						isPrimary: true,
						isNullable: false
					},
					{
						name: 'sess',
						type: 'json',
						isNullable: false
					},
					{
						name: 'expire',
						type: 'timestamp',
						isNullable: false
					}
				]
			}),
			true
		)

		await queryRunner.createIndex(
			'adminjs_sessions',
			new TableIndex({
				name: 'IDX_session_expire',
				columnNames: ['expire']
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropIndex('adminjs_sessions', 'IDX_session_expire')
		await queryRunner.dropTable('adminjs_sessions', true)
	}
}
