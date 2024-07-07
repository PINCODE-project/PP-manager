import {CreatePassportDto} from "../dto/create-passport.dto";
import {UpdatePassportDto} from "../dto/update-passport.dto";

export namespace PassportMappers {
    /**
     * Маппинг данных из реста в Dto для создания паспорта.
     * @param passport
     */
    export function toCreateDto(passport): CreatePassportDto {
        return {
            id: passport.id,
            uid: passport.uid,
            short_name: passport.mainProgram.project_short_name,
            diploma_name: passport.mainProgram.student_diploma_name,
            date: passport.passport_date,
            team_count: passport.mainProgram.max_copies,
            students_count: passport.mainProgram.students,
            course: passport.mainProgram.course,
            request_id: passport.source?.id || passport.id,
            kind: passport.kind,
            status: passport.statuses[0].text,
        };
    }

    /**
     * Маппинг данных из реста в Dto для обновления паспорта.
     * @param passport
     */
    export function toUpdateDto(passport): UpdatePassportDto {
        return {
            uid: passport.uid,
            short_name: passport.mainProgram.project_short_name,
            diploma_name: passport.mainProgram.student_diploma_name,
            date: passport.passport_date,
            team_count: passport.mainProgram.max_copies,
            students_count: passport.mainProgram.students,
            course: passport.mainProgram.course,
            request_id: passport.source?.id || passport.id,
            kind: passport.kind,
            status: passport.statuses[0].text
        };
    }
}
