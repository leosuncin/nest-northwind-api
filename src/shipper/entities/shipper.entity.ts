import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Shipper {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ length: 40 })
  companyName!: string;

  @Column({ length: 24, nullable: true })
  phone?: string;
}
