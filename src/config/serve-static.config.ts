import { join } from 'node:path'
import { registerAs } from '@nestjs/config'
import type { ServeStaticModuleOptions } from '@nestjs/serve-static'

export const serveStaticConfig = registerAs(
	'serveStatic',
	() =>
		({
			rootPath: join(process.cwd(), 'public'),
			serveRoot: '/public'
		}) as ServeStaticModuleOptions
)
