import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ length: 15 })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ length: 255, nullable: true })
  picture?: string;
}
