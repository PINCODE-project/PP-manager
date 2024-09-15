import { Injectable } from "@nestjs/common";
import { CreateAnalyticDto } from "./dto/create-analytic.dto";
import { UpdateAnalyticDto } from "./dto/update-analytic.dto";
import { PassportService } from "../passport/passport.service";
import { RequestService } from "../request/request.service";
import { CustomerCompanyService } from "../customer-company/customer-company.service";
import { CustomerUserService } from "../customer-user/customer-user.service";
import { GetMainAnalyticsDto } from "./dto/get-main-analytics.dto";
import { ProjectService } from "../project/project.service";
import { StudentService } from "../student/student.service";

@Injectable()
export class AnalyticService {
    constructor(
        private readonly passportService: PassportService,
        private readonly requestService: RequestService,
        private readonly customerCompanyService: CustomerCompanyService,
        private readonly customerUserService: CustomerUserService,
        private readonly projectService: ProjectService,
        private readonly studentService: StudentService,
    ) {}

    async getMainAnalytics(getMainAnalyticsDto: GetMainAnalyticsDto) {
        const requests = await this.requestService.findAll(getMainAnalyticsDto);
        const passports = await this.passportService.findAll(getMainAnalyticsDto);
        const projects = await this.projectService.findAllForStatistic(getMainAnalyticsDto);
        const customerCompanies = await this.customerCompanyService.findAll(getMainAnalyticsDto);
        const customerUsers = await this.customerUserService.findAll(getMainAnalyticsDto);
        const studentsCount = await this.studentService.findCountForStatistic(getMainAnalyticsDto);

        const availableSeatsCount = passports.reduce(
            (accumulator, currentValue) => accumulator + currentValue.team_count * currentValue.students_count,
            0,
        );

        let hasReportCount = 0;
        let hasPresentationCount = 0;
        let hasCommissionScoreCount = 0;
        let marks = {};
        for (let project of projects) {
            if (project.isHaveReport) hasReportCount++;
            if (project.isHavePresentation) hasPresentationCount++;
            if (project.comissionScore !== null) hasCommissionScoreCount++;

            if (!marks.hasOwnProperty(project.comissionScore)) marks[project.comissionScore] = 1;
            else marks[project.comissionScore] += 1;
        }

        return {
            requests_count: requests.length,
            passports_count: passports.length,
            projects_count: projects.length,
            customer_company_count: customerCompanies.length,
            customer_users_count: customerUsers.length,
            students_count: studentsCount,
            available_seats_count: availableSeatsCount,
            has_report_count: hasReportCount,
            has_presentation_count: hasPresentationCount,
            has_commission_score_count: hasCommissionScoreCount,
            marks: marks,
        };
    }

    findAll() {
        return `This action returns all analytic`;
    }

    findOne(id: number) {
        return `This action returns a #${id} analytic`;
    }

    update(id: number, updateAnalyticDto: UpdateAnalyticDto) {
        return `This action updates a #${id} analytic`;
    }

    remove(id: number) {
        return `This action removes a #${id} analytic`;
    }
}
