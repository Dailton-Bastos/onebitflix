import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableColumn,
	TableForeignKey,
	TableIndex
} from 'typeorm'

export class CreateRefreshTokensTable1771169553160
	implements MigrationInterface
{
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'refresh_tokens',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment'
					},
					{
						name: 'token',
						type: 'varchar',
						isNullable: false
					},
					{
						name: 'expires_at',
						type: 'timestamp',
						isNullable: false
					},
					{
						name: 'is_revoked',
						type: 'boolean',
						default: false
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

		await queryRunner.createIndex(
			'refresh_tokens',
			new TableIndex({
				name: 'IDX_REFRESH_TOKENS_TOKEN',
				columnNames: ['token'],
				isUnique: true
			})
		)

		await queryRunner.addColumn(
			'refresh_tokens',
			new TableColumn({
				name: 'user_id',
				type: 'int',
				isNullable: false
			})
		)

		await queryRunner.createForeignKey(
			'refresh_tokens',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT'
			})
		)

		await queryRunner.createIndex(
			'refresh_tokens',
			new TableIndex({
				name: 'IDX_REFRESH_TOKENS_USER_ID',
				columnNames: ['user_id']
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('refresh_tokens')
		await queryRunner.dropIndex('refresh_tokens', 'IDX_REFRESH_TOKENS_TOKEN')

		const foreignKey = table?.foreignKeys.find(
			(fk) => fk.columnNames.indexOf('user_id') !== -1
		)

		if (foreignKey) {
			await queryRunner.dropIndex(
				'refresh_tokens',
				'IDX_REFRESH_TOKENS_USER_ID'
			)
			await queryRunner.dropForeignKey('refresh_tokens', foreignKey)
			await queryRunner.dropColumn('refresh_tokens', 'user_id')
		}

		await queryRunner.dropTable('refresh_tokens')
	}
}
