import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'

const ENV = process.env.NODE_ENV ?? 'development'

config({ path: `.env.${ENV}.local`, quiet: true })

export const configService = new ConfigService()
