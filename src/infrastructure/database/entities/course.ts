import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GradeEntity } from './grade';
import { PinEntity } from './pin';
import { SchoolEntity } from './school';

@Entity('course')
export class CourseEntity {
  @PrimaryGeneratedColumn('uuid')
  idCourse!: string;

  @Column({ type: 'varchar' })
  name = '';

  @Column({ type: 'varchar' })
  description = '';
  @CreateDateColumn({ type: 'timestamp with local time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with local time zone' })
  updatedAt: Date;

  @ManyToOne(() => SchoolEntity, (school) => school.courses)
  idSchool: SchoolEntity;
  @OneToMany(() => GradeEntity, (grade) => grade.idCourse, {
    cascade: true,
  })
  grades: Array<GradeEntity>;
  @OneToMany(() => PinEntity, (pin) => pin.idCourse, {
    cascade: true,
  })
  pines: Array<PinEntity>;
}
