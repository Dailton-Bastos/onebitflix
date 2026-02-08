import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from 'src/users/user.entity'
import type { RequestWithUser } from '../interfaces'

export const CurrentUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): User => {
		const request = ctx.switchToHttp().getRequest<RequestWithUser>()

		return request.user as User
	}
)
