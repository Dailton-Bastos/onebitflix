import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CoursesService } from 'src/courses/courses.service'
import { CoursesServiceMock } from 'src/courses/courses.service.mock'
import { Repository } from 'typeorm'
import { Like } from './like.entity'
import { LikesService } from './likes.service'

describe('LikesService', () => {
	let service: LikesService
	let coursesService: CoursesService
	let likeRepository: Repository<Like>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LikesService,
				CoursesServiceMock,
				{
					provide: getRepositoryToken(Like),
					useValue: {
						create: jest.fn(),
						save: jest.fn(),
						delete: jest.fn()
					}
				}
			]
		}).compile()

		service = module.get<LikesService>(LikesService)
		coursesService = module.get<CoursesService>(CoursesService)
		likeRepository = module.get<Repository<Like>>(getRepositoryToken(Like))
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
		expect(coursesService).toBeDefined()
		expect(likeRepository).toBeDefined()
	})

	describe('create', () => {
		it('should create a like', async () => {
			const userId = 1
			const courseId = 1

			const likeMock = {
				userId,
				courseId,
				createdAt: new Date()
			} as unknown as Like

			jest.spyOn(likeRepository, 'create').mockReturnValue(likeMock)
			jest.spyOn(likeRepository, 'save').mockResolvedValue(likeMock)

			const result = await service.create(userId, courseId)

			expect(coursesService.findById).toHaveBeenCalledWith(courseId)
			expect(likeRepository.create).toHaveBeenCalledWith({ userId, courseId })
			expect(likeRepository.save).toHaveBeenCalledTimes(1)
			expect(likeRepository.save).toHaveBeenCalledWith({
				userId,
				courseId,
				createdAt: expect.any(Date)
			})

			expect(result).toEqual(likeMock)
		})

		it('should throw a NotFoundException if the course is not found', async () => {
			const userId = 1
			const courseId = 999

			jest.spyOn(coursesService, 'findById').mockResolvedValue(null)

			await expect(service.create(userId, courseId)).rejects.toThrow(
				NotFoundException
			)

			expect(coursesService.findById).toHaveBeenCalledWith(courseId)
			expect(likeRepository.create).not.toHaveBeenCalled()
			expect(likeRepository.save).not.toHaveBeenCalled()
		})
	})

	describe('delete', () => {
		it('should delete a like and return void', async () => {
			const userId = 1
			const courseId = 1

			jest
				.spyOn(likeRepository, 'delete')
				.mockResolvedValue({ affected: 1, raw: [] })

			await service.delete(userId, courseId)

			expect(likeRepository.delete).toHaveBeenCalledWith({ userId, courseId })
		})

		it('should throw a NotFoundException if the like is not found', async () => {
			const userId = 1
			const courseId = 999

			jest
				.spyOn(likeRepository, 'delete')
				.mockResolvedValue({ affected: 0, raw: [] })

			await expect(service.delete(userId, courseId)).rejects.toThrow(
				NotFoundException
			)

			expect(likeRepository.delete).toHaveBeenCalledWith({ userId, courseId })
		})
	})
})
