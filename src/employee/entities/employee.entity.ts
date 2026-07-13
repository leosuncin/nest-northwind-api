import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 10 })
  firstName!: string;

  @Column({ length: 20 })
  lastName!: string;

  @Column({ length: 30, nullable: true })
  title?: string;

  @Column({ length: 25, nullable: true })
  titleOfCourtesy?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'date', nullable: true })
  hireDate?: Date;

  @Column({ length: 60, nullable: true })
  address?: string;

  @Column({ length: 15, nullable: true })
  city?: string;

  @Column({ length: 15, nullable: true })
  region?: string;

  @Column({ length: 10, nullable: true })
  postalCode?: string;

  @Column({ length: 15, nullable: true })
  country?: string;

  @Column({ length: 24, nullable: true })
  homePhone?: string;

  @Column({ length: 4, nullable: true })
  extension?: string;

  @Column({ length: 255, nullable: true })
  photo?: string;

  @Column({ nullable: true })
  notes?: string;

  @OneToOne(() => Employee)
  @JoinColumn({ name: 'reportsTo' })
  reportsTo?: number | Employee;
}
