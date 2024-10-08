import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SwaggerUI } from "./swagger-ui.class";
import { _SWAGGER_TAGS } from "./swagger-tags/swagger-tags.constants";

export class SwaggerDocumentBuilder {
    constructor(private readonly app: INestApplication<any>) {}

    private buildConfig() {
        const docBuilder = new DocumentBuilder()
            .setTitle("PP-manager")
            .setDescription("API сервиса для аналитики курса Проектный практикум")
            .setVersion("1.0")
            .addBearerAuth({
                bearerFormat: "Bearer",
                scheme: "Bearer",
                type: "http",
                in: "Header",
            });

        _SWAGGER_TAGS.forEach((tag) => {
            docBuilder.addTag(tag.name, tag.description);
        });

        return docBuilder.build();
    }

    private createDocument() {
        const config = this.buildConfig();
        return SwaggerModule.createDocument(this.app, config);
    }

    public setupSwagger() {
        const document = this.createDocument();

        const swaggerUI = new SwaggerUI("http://localhost:5000/api");
        SwaggerModule.setup("core/docs", this.app, document, swaggerUI.customOptions);
    }
}
