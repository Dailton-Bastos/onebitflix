import { Faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'
import { Category } from './category.entity'

export default setSeederFactory(Category, (faker: Faker) => {
	const category = new Category()

	category.name = faker.commerce.department()

	category.position = faker.number.int({ min: 1, max: 100 })

	return category
})
