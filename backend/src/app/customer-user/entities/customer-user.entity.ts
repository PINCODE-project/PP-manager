import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {CustomerCompany} from "../../customer-company/entities/customer-company.entity";
import {Request} from "../../request/entities/request.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class CustomerUser {
    @ApiProperty()
    @PrimaryColumn()
    id: number;

    @Column({nullable: true})
    username: string;

    @Column({nullable: true})
    email: string;

    @Column({nullable: true})
    first_name: string;

    @Column({nullable: true})
    last_name: string;

    @Column({nullable: true})
    middle_name: string;

    @Column({nullable: true})
    phone: string;

    @Column({nullable: true})
    qualification: string;

    @ManyToOne(() => CustomerCompany, (customerCompany) => customerCompany.id, {nullable: true})
    @JoinColumn({name: 'customer_company'})
    customer_company: CustomerCompany;

    @OneToMany(() => Request, (request) => request.customer_user, {nullable: true})
    requests: Request[];
}
