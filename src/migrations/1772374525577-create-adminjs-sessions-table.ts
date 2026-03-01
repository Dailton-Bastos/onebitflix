import { MigrationInterface, QueryRunner, Table } from 'typeorm'

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

		await queryRunner.query(
			`CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "adminjs_sessions" ("expire")`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX IF EXISTS "IDX_session_expire"`)
		await queryRunner.dropTable('adminjs_sessions', true)
	}
}
