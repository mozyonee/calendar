import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
	app.enableCors({
		origin: config.get<string>('CLIENT_URL'),
		credentials: true,
	});

	const port = config.get<number>('PORT', 3001);
	await app.listen(port, '0.0.0.0');
}

void bootstrap();
