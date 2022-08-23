import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEntity } from './course';
import { GradeEntity } from './grade';
import { SchoolEntity } from './school';

@Entity('pin')
export class PinEntity {
  @PrimaryGeneratedColumn('uuid')
  idPin!: string;

  @Column({ type: 'varchar' })
  code = '';

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'timestamp with local time zone' })
  expirationDate: Date;

  @CreateDateColumn({ type: 'timestamp with local time zone' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp with local time zone' })
  updatedAt: Date;

  @ManyToOne(() => SchoolEntity, (school) => school.pines)
  idSchool: SchoolEntity;

  @ManyToOne(() => CourseEntity, (course) => course.pines)
  idCourse: CourseEntity;

  @ManyToOne(() => GradeEntity, (grade) => grade.pines)
  idGrade: GradeEntity;
}
