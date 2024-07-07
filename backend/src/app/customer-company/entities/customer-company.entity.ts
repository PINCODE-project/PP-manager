import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {CustomerUser} from "../../customer-user/entities/customer-user.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class CustomerCompany {
    @ApiProperty()
    @PrimaryColumn()
    id: number;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    short_name: string;

    @Column({nullable: true})
    law_address: string;

    @Column({nullable: true})
    post_address: string;

    @Column({nullable: true})
    inn: string;

    @Column({nullable: true})
    ogrn: string;

    @Column({nullable: true})
    phone: string;

    // @OneToMany(() => Request, (request) => request.customer_company, {nullable: true})
    // requests: Request[];

    @OneToMany(() => CustomerUser, (customerUser) => customerUser.customer_company, {nullable: true})
    customer_users: CustomerUser[];
}
