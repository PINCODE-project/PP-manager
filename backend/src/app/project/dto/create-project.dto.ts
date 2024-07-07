import {Student} from "../../student/entities/student.entity";

export class CreateProjectDto {
    project: any;
    details: any;
    results: any;
    documents: any;
    team: any;
    students: number[];
    period_id: number;
    passport: string;
}
