import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SportClass {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public sport: string; // Basketball, Football

  @Column()
  public description: string;

  @Column('simple-array') // ["Monday 10:00", "Wednesday 10:00"]
  public schedule: string[];

  @Column()
  public duration: number; // minutes

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column({ nullable: true })
  createdBy: string;
}
