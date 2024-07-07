import {CreateCustomerCompanyDto} from "../dto/create-customer-company.dto";

export namespace CustomerCompanyMappers {
    /**
     * Маппинг данных из заявки в Dto для создания.
     * @param partner
     */
    export function partnerToCreateAndUpdateDto(partner): CreateCustomerCompanyDto {
        return {
            id: partner.id,
            name: partner.name,
            short_name: partner.short_name,
            law_address: partner.law_address,
            post_address: partner.post_address,
            inn: partner.inn,
            ogrn: partner.ogrn,
            phone: partner.phone
        };
    }
}
