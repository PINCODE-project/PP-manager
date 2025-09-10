import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Program } from "../../program/entities/program.entity";
import { Passport } from "../../passport/entities/passport.entity";

@Entity()
export class PassportProgram {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    status: string;

    @ManyToOne(() => Passport, (passport) => passport.id, { nullable: true })
    @JoinColumn({ name: "passport" })
    passport: Passport;

    @ManyToOne(() => Program, (program) => program.id, { nullable: true })
    @JoinColumn({ name: "program" })
    program: Program;
}
