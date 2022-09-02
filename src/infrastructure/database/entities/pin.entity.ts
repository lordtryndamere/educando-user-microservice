import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { GradeEntity } from './grade.entity';
import { SchoolEntity } from './school.entity';

@Entity('pin')
export class PinEntity {
  @PrimaryGeneratedColumn('uuid')
  idPin!: string;

  @Column({ type: 'varchar' })
  code = '';

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => SchoolEntity, (school) => school.pines)
  idSchool: SchoolEntity;

  @ManyToOne(() => CourseEntity, (course) => course.pines)
  idCourse: CourseEntity;

  @ManyToOne(() => GradeEntity, (grade) => grade.pines)
  idGrade: GradeEntity;
}
