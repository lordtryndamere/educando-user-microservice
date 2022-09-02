import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseEntity } from './course.entity';
import { PinEntity } from './pin.entity';

@Entity('grade')
export class GradeEntity {
  @PrimaryGeneratedColumn('uuid')
  idGrade!: string;

  @Column({ type: 'varchar' })
  name = '';

  @Column({ type: 'varchar' })
  description = '';

  @Column({ type: 'varchar' })
  type = '';
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @ManyToOne(() => CourseEntity, (course) => course.grades)
  idCourse: CourseEntity;
  @OneToMany(() => PinEntity, (pin) => pin.idGrade, {
    cascade: true,
  })
  pines: Array<PinEntity>;
}
