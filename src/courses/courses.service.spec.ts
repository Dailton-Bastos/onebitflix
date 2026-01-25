import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Order } from 'src/common/constants'
import { episodeMock } from 'src/episodes/episodes.service.mock'
import { ILike, Repository } from 'typeorm'
import { Course } from './course.entity'
import { CoursesService } from './courses.service'
import { CourseRepositoryMock, courseMock } from './courses.service.mock'
import { SearchDto } from './dtos'

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

	describe('getTopTenNewestCourses', () => {
		it('should return top ten newest courses', async () => {
			const find = jest.spyOn(repository, 'find')

			find.mockImplementation(() =>
				Promise.resolve(
					Array(10)
						.fill(null)
						.map((_, index) => ({
							...courseMock,
							id: index + 1
						})) as Course[]
				)
			)
			const result = await service.getTopTenNewestCourses()

			expect(repository.find).toHaveBeenCalledWith({
				order: { createdAt: Order.DESC },
				take: 10
			})

			expect(result).toBeDefined()
			expect(result.length).toBe(10)
		})
	})

	describe('searchByCourseName', () => {
		it('should throw an error if the name is empty', async () => {
			const searchDto = {
				name: ''
			} as unknown as SearchDto

			await expect(service.searchByCourseName(searchDto)).rejects.toThrow(
				BadRequestException
			)
		})

		it('should return courses by name', async () => {
			const searchDto: SearchDto = {
				name: 'test',
				page: 1,
				take: 10,
				order: Order.DESC,
				skip: 0
			}

			const result = await service.searchByCourseName(searchDto)

			expect(repository.findAndCount).toHaveBeenCalledWith({
				where: { name: ILike(`%${searchDto.name}%`) },
				order: { createdAt: Order.DESC },
				take: searchDto.take,
				skip: searchDto.skip
			})

			expect(result).toBeDefined()
			expect(result.data).toBeDefined()
			expect(result.data).toEqual([courseMock])
			expect(result.meta).toBeDefined()
			expect(result.meta.itemCount).toBe(1)
			expect(result.meta.page).toBe(searchDto.page)
			expect(result.meta.take).toBe(searchDto.take)
			expect(result.meta.hasPreviousPage).toBe(false)
			expect(result.meta.hasNextPage).toBe(false)
		})
	})
})
