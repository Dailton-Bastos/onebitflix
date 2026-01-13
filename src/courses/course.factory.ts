import { Faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'
import { Course } from './course.entity'

export default setSeederFactory(Course, (faker: Faker) => {
	const course = new Course()

	course.name = faker.commerce.productName()

	course.synopsis = faker.lorem.paragraph()

	course.featured = faker.datatype.boolean()

	return course
})
