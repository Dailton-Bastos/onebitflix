import { Faker } from '@faker-js/faker'
import { setSeederFactory } from 'typeorm-extension'
import { Episode } from './episode.entity'

export default setSeederFactory(Episode, (faker: Faker) => {
	const episode = new Episode()

	episode.name = faker.commerce.productName()

	episode.synopsis = faker.lorem.paragraph()

	episode.order = faker.number.int({ min: 1, max: 100 })

	episode.secondsLong = faker.number.int({ min: 100, max: 10000 })

	return episode
})
