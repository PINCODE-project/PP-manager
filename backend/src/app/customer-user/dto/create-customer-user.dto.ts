export class CreateCustomerUserDto {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    phone?: string;
    qualification?: string;
    customer_company_id: number;
}
