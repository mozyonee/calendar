import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { HolidaysModule } from './holidays/holidays.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
		MongooseModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				uri: config.getOrThrow<string>('MONGODB_URI'),
			}),
		}),
		TasksModule,
		HolidaysModule,
	],
})
export class AppModule {}
