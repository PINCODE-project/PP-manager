import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {Period} from "../../period/entities/period.entity";
import {Passport} from "../../passport/entities/passport.entity";
import {CustomerUser} from "../../customer-user/entities/customer-user.entity";
import {Tag} from "../../tag/entities/tag.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Request {
    @ApiProperty()
    @PrimaryColumn()
    id: number;

    @Column()
    uid: string;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    date: Date;

    @Column({nullable: true})
    goal: string;

    @Column({nullable: true})
    result: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    criteria: string;

    @Column({nullable: true})
    max_copies: number;

    @Column({nullable: true})
    status: string;

    @Column({default: 0})
    students_count: number;

    @ManyToOne(() => Period, (period) => period.requests, {nullable: true})
    @JoinColumn({name: 'period'})
    period_id: Period

    @OneToMany(() => Passport, (passport) => passport.request, {nullable: true})
    passports: Passport[];

    @ManyToOne(() => CustomerUser, (customerUser) => customerUser.id, {nullable: true})
    @JoinColumn({name: 'customer_user'})
    customer_user: CustomerUser;

    @ManyToOne(() => Tag, (tag) => tag.id, {nullable: true})
    @JoinColumn({name: 'track'})
    track: Tag;

    @ManyToMany(() => Tag, (tag) => tag.requests, {
        cascade: true
    })
    @JoinTable({
        name: "request_tag", joinColumn: {
            name: 'request_id',
            referencedColumnName: 'id',
        }, inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id',
        },
    })
    tags: Tag[];
}
