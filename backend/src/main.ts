import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import * as basicAuth from "express-basic-auth";
import { SwaggerDocumentBuilder } from "./swagger/swagger-document-builder";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix("api");
    app.enableCors();

    app.use(
        "/core/docs*",
        basicAuth({
            challenge: true,
            users: {
                Admin: "P@ssw0rd",
            },
        }),
    );

    const swaggerDocumentBuilder = new SwaggerDocumentBuilder(app);
    swaggerDocumentBuilder.setupSwagger();

    await app.listen(9002);
    logger.log(`🚀 ${configService.getOrThrow("APP_NAME")} service started successfully on port ${port}`);
}

bootstrap();
