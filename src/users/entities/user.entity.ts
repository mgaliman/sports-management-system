import { Role } from 'src/auth/roles/roles.enum';
import { SportClass } from 'src/sport-classes/entities/sport-class.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
