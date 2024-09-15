import { CreateProgramDto } from "../dto/create-program.dto";

export namespace ProgramMappers {
    /**
     * Маппинг данных из получения всех программ в Dto для создания программы.
     * @param program
     */
    export function toCreateDto(program): CreateProgramDto {
        return {
            id: program.id,
            uid: program.uid,
            uuid: program.uuid,
            name: program.name,
            level: program.level,
            ugn: program.ugn,
            institute_id: program.institute.id,
            institute_name: program.institute.name,
            area_id: program.area.id,
            area_uid: program.area.uid,
            area_name: program.area.name,
            head_id: program.heads.length > 0 ? program.heads[0] : null,
        };
    }

    // /**
    //  * Маппинг данных из заявки в Dto для обновления представителя заказчика.
    //  * @param manager
    //  */
    // export function toUpdateDto(manager): UpdateCustomerUserDto {
    //     return {
    //         username: manager.username,
    //         email: manager.email,
    //         first_name: manager.first_name,
    //         last_name: manager.last_name,
    //         middle_name: manager.middle_name,
    //         phone: manager.phone,
    //         qualification: manager.qualification,
    //         customer_company_id: manager.partner
    //     };
    // }
}
