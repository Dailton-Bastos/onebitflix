import { DataSource } from 'typeorm'
import { type Seeder, SeederFactoryManager } from 'typeorm-extension'
import { Category } from './category.entity'

export default class CategorySeeder implements Seeder {
	public async run(
		dataSource: DataSource,
		factoryManager: SeederFactoryManager
	): Promise<void> {
		const repository = dataSource.getRepository(Category)

		await repository.save([
			{
				name: 'Tecnologias Back-end',
				position: 1
			},
			{
				name: 'Tecnologias Front-end',
				position: 2
			},
			{
				name: 'Ferramentas de Desenvolvimento',
				position: 3
			},
			{
				name: 'Soft-skills',
				position: 4
			},
			{
				name: 'Carreira',
				position: 5
			}
		])

		const categoryFactory = factoryManager.get(Category)
		await categoryFactory.saveMany(10)
	}
}
