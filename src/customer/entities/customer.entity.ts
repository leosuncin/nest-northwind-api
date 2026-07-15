import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ length: 5, unique: true })
  code!: string;

  @Column({ length: 40 })
  companyName!: string;

  @Column({ length: 30, nullable: true })
  contactName?: string;

  @Column({ length: 30, nullable: true })
  contactTitle?: string;

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
  phone?: string;

  @Column({ length: 24, nullable: true })
  fax?: string;
}
