import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { episodeMock } from 'src/episodes/episodes.service.mock'
import { Repository } from 'typeorm'
import { Course } from './course.entity'
import { CoursesService } from './courses.service'
import { CourseRepositoryMock, courseMock } from './courses.service.mock'

describe('CoursesService', () => {
	let service: CoursesService
	let repository: Repository<Course>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CoursesService, CourseRepositoryMock]
		}).compile()

		service = module.get<CoursesService>(CoursesService)
		repository = module.get<Repository<Course>>(getRepositoryToken(Course))

		jest.restoreAllMocks()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
		expect(repository).toBeDefined()
	})

	describe('findByIdWithEpisodes', () => {
		it('should find a course with findOne repository method', async () => {
			const id = 1

			await service.findByIdWithEpisodes(id)
		})

		it('should return a course with episodes', async () => {
			const id = 1

			const result = await service.findByIdWithEpisodes(id)

			expect(result).toBeDefined()
			expect(result.id).toBe(id)
			expect(result.name).toBe(courseMock.name)
			expect(result.synopsis).toBe(courseMock.synopsis)
			expect(result.featured).toBe(courseMock.featured)
			expect(result.thumbnailUrl).toBe(courseMock.thumbnailUrl)
			expect(result.episodes).toEqual([episodeMock])
		})

		it('should return a course with empty episodes array', async () => {
			const id = 1

			jest.spyOn(repository, 'findOne').mockResolvedValue({
				...(courseMock as Course),
				episodes: []
			} as unknown as Course)

			const result = await service.findByIdWithEpisodes(id)

			expect(result).toBeDefined()
			expect(result.id).toBe(id)
			expect(result.episodes).toBeDefined()
			expect(result.episodes).toEqual([])
		})

		it('should return a course with episodes ordered by order property', async () => {
			const id = 1

			jest.spyOn(repository, 'findOne').mockResolvedValue({
				...courseMock,
				episodes: [episodeMock]
			} as unknown as Course)

			expect(repository.findOne).toHaveBeenCalledWith({
				where: { id },
				relations: {
					episodes: true
				},
				order: { episodes: { order: 'ASC' } }
			})
		})

		it('should throw an error if the course is not found', async () => {
			const id = 999

			jest.spyOn(repository, 'findOne').mockResolvedValue(null)

			await expect(service.findByIdWithEpisodes(id)).rejects.toThrow(
				NotFoundException
			)
		})
	})

	describe('getRandomFeaturedCourses', () => {
		it('should return random three featured courses', async () => {
			const result = await service.getRandomFeaturedCourses()

			expect(repository.createQueryBuilder).toHaveBeenCalledWith('courses')
			expect(repository.createQueryBuilder().where).toHaveBeenCalledWith(
				'courses.featured = :featured',
				{ featured: true }
			)
			expect(repository.createQueryBuilder().orderBy).toHaveBeenCalledWith(
				'RANDOM()'
			)
			expect(repository.createQueryBuilder().take).toHaveBeenCalledWith(3)
			expect(repository.createQueryBuilder().getMany).toHaveBeenCalled()

			expect(result).toBeDefined()
			expect(result.length).toBe(3)
		})
	})
})
