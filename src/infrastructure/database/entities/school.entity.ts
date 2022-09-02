import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CourseEntity } from './course.entity';
import { PinEntity } from './pin.entity';

@Entity('school')
export class SchoolEntity {
  @PrimaryGeneratedColumn('uuid')
  idSchool = uuidv4();

  @Column({ type: 'varchar' })
  name = '';

  @Column({ type: 'varchar' })
  address = '';

  @Column({ type: 'varchar' })
  city = '';

  @Column({ type: 'varchar' })
  state = '';

  @Column({ type: 'varchar' })
  country = '';

  @Column({ type: 'varchar' })
  zipCode = '';

  @Column({ type: 'varchar' })
  phone = '';

  @Column({ type: 'varchar' })
  email = '';

  @Column({ type: 'varchar' })
  website = '';

  @Column({ type: 'varchar' })
  logo = '';

  @Column({ type: 'varchar' })
  logoUrl = '';
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @OneToMany(() => PinEntity, (pin) => pin.idSchool, {
    cascade: true,
  })
  pines: Array<PinEntity>;
  @OneToMany(() => CourseEntity, (course) => course.idSchool, {
    cascade: true,
  })
  courses: Array<CourseEntity>;
}
//curso decimo
//grade 1
