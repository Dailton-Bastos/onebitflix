import { Test, TestingModule } from '@nestjs/testing'
import { episodeMock } from 'src/episodes/episodes.service.mock'
import { CoursesController } from './courses.controller'
import { CoursesService } from './courses.service'
import { CoursesServiceMock, courseMock } from './courses.service.mock'

describe('CoursesController', () => {
	let controller: CoursesController
	let service: CoursesService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CoursesController],
			providers: [CoursesServiceMock]
		}).compile()

		controller = module.get<CoursesController>(CoursesController)
		service = module.get<CoursesService>(CoursesService)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
		expect(service).toBeDefined()
	})

	describe('findByIdWithEpisodes', () => {
		it('should return a course with episodes', async () => {
			const result = await controller.findByIdWithEpisodes(courseMock.id)

			expect(service.findByIdWithEpisodes).toHaveBeenCalledWith(courseMock.id)

			expect(result).toBeDefined()
			expect(result.id).toBe(courseMock.id)
			expect(result.name).toBe(courseMock.name)
			expect(result.synopsis).toBe(courseMock.synopsis)
			expect(result.featured).toBe(courseMock.featured)
			expect(result.thumbnailUrl).toBe(courseMock.thumbnailUrl)
			expect(result.episodes).toEqual([episodeMock])
		})

		it('should return a existing course without createdAt and updatedAt properties', async () => {
			const result = await controller.findByIdWithEpisodes(courseMock.id)

			expect(result).toBeDefined()

			expect(result.createdAt).toBeUndefined()
			expect(result.updatedAt).toBeUndefined()
		})
	})

	describe('findFeaturedCourses', () => {
		it('should return random three featured courses', async () => {
			const result = await controller.getRandomFeaturedCourses()

			expect(service.getRandomFeaturedCourses).toHaveBeenCalled()

			expect(result).toBeDefined()
			expect(result.length).toBe(3)
			expect(result).toEqual([
				{ ...courseMock, id: 1 },
				{ ...courseMock, id: 2 },
				{ ...courseMock, id: 3 }
			])
			expect(result[0]).not.toBe(result[1])
			expect(result[0]).not.toBe(result[2])
			expect(result[1]).not.toBe(result[2])
		})
	})
})
