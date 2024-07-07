import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TeamprojectModule} from './teamproject/teamproject.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProjectModule} from './project/project.module';
import {UserModule} from "./user/user.module";
import {AuthModule} from "./auth/auth.module";
import { PartnerModule } from './partner/partner.module';
import {ScheduleModule} from "@nestjs/schedule";
import { SheduleManagerModule } from './shedule-manager/shedule-manager.module';
import { PassportModule } from './passport/passport.module';
import { PeriodModule } from './period/period.module';
import { CourseModule } from './course/course.module';
import { RequestModule } from './request/request.module';
import { CustomerCompanyModule } from './customer-company/customer-company.module';
import { CustomerUserModule } from './customer-user/customer-user.module';
import { AnalyticModule } from './analytic/analytic.module';
import { TagModule } from './tag/tag.module';
import { StudentModule } from './student/student.module';
import { StudentProjectResultModule } from './student-project-results/student-project-result.module';
import { QuestionModule } from './question/question.module';
import { QuestionSectionModule } from './question-section/question-section.module';
import {join} from "path";
import {ServeStaticModule} from "@nestjs/serve-static";
import {SSEModule} from "./sse/sse.module";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get("DB_HOST"),
                port: configService.get("DB_PORT"),
                username: configService.get("DB_USERNAME"),
                password: configService.get("DB_PASSWORD"),
                database: configService.get("DB_NAME"),
                synchronize: true,
                autoLoadEntities: true,
                entities: [__dirname + "/**/*.entities{.js, .ts}"]
            }),
            inject: [ConfigService]
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', '..', 'static'),
            serveRoot: '/api/static',
        }),
        ScheduleModule.forRoot(),
        TeamprojectModule,
        ConfigModule.forRoot({isGlobal: true}),
        ProjectModule,
        UserModule,
        AuthModule,
        PartnerModule,
        SheduleManagerModule,
        PassportModule,
        PeriodModule,
        CourseModule,
        RequestModule,
        CustomerCompanyModule,
        CustomerUserModule,
        AnalyticModule,
        TagModule,
        StudentModule,
        StudentProjectResultModule,
        QuestionModule,
        QuestionSectionModule,
        SSEModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
