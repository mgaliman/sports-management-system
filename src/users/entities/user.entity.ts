import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../auth/roles/roles.enum';
import { SportClass } from '../../sport-classes/entities/sport-class.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  public role: Role;

  @ManyToMany(() => SportClass, (sportClass) => sportClass.applicants, {
    cascade: true,
  })
  @JoinTable()
  public appliedClasses: SportClass[];
}
