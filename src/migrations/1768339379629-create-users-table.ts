import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateUsersTable1768339379629 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment'
					},
					{
						name: 'first_name',
						type: 'varchar',
						isNullable: false
					},
					{
						name: 'last_name',
						type: 'varchar',
						isNullable: false
					},
					{
						name: 'phone',
						type: 'varchar',
						isNullable: false
					},
					{
						name: 'birth',
						type: 'date',
						isNullable: false
					},
					{
						name: 'role',
						type: 'varchar',
						isNullable: false,
						enum: ['admin', 'user'],
						default: 'user'
					},
					{
						name: 'email',
						type: 'varchar',
						isNullable: false,
						isUnique: true
					},
					{
						name: 'password',
						type: 'varchar',
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
			'users',
			new TableIndex({
				name: 'IDX_USERS_EMAIL',
				columnNames: ['email']
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL')
		await queryRunner.dropTable('users')
	}
}
