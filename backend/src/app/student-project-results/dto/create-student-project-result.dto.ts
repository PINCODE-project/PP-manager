export class CreateStudentProjectResultDto {
    student_id: number;
    project_id: string;
    totalScore?: number;
    expertsScore?: number;
    finalScore?: number;
    retakedScore?: number;
    brsScore?: number;
    coefficient?: number;
}
