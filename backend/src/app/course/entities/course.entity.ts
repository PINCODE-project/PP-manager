import {Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Passport} from "../../passport/entities/passport.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Course {
    @ApiProperty()
    @PrimaryColumn()
    id: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    number: number;

    @ManyToMany(() => Passport, (passport) => passport.course, {onDelete: "CASCADE"})
    passports: Passport[]
}
