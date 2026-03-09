import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());
	app.enableCors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	});

	const port = process.env.PORT ?? 3001;
	await app.listen(port, '0.0.0.0');
	console.log(`Server running on port ${port}`);
}

void bootstrap();
