import {CreateCustomerUserDto} from "../dto/create-customer-user.dto";
import {UpdateCustomerUserDto} from "../dto/update-customer-user.dto";

export namespace CustomerUserMappers {
    /**
     * Маппинг данных из заявки в Dto для создания представителя заказчика.
     * @param manager
     */
    export function toCreateDto(manager): CreateCustomerUserDto {
        return {
            id: manager.id,
            username: manager.username,
            email: manager.email,
            first_name: manager.first_name,
            last_name: manager.last_name,
            middle_name: manager.middle_name,
            phone: manager.phone,
            qualification: manager.qualification,
            customer_company_id: manager.partner
        };
    }

    /**
     * Маппинг данных из заявки в Dto для обновления представителя заказчика.
     * @param manager
     */
    export function toUpdateDto(manager): UpdateCustomerUserDto {
        return {
            username: manager.username,
            email: manager.email,
            first_name: manager.first_name,
            last_name: manager.last_name,
            middle_name: manager.middle_name,
            phone: manager.phone,
            qualification: manager.qualification,
            customer_company_id: manager.partner
        };
    }
}
