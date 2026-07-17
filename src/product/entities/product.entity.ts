import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ length: 40 })
  name!: string;

  @Column({ type: 'bigint', nullable: true })
  supplierId?: number;

  @Column({ type: 'bigint', nullable: true })
  categoryId?: number;

  @Column({ length: 20, nullable: true })
  quantityPerUnit?: string;

  @Column({ type: 'money', nullable: true, default: 0 })
  unitPrice?: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  unitsInStock?: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  unitsOnOrder?: number;

  @Column({ type: 'smallint', nullable: true, default: 0 })
  reorderLevel?: number;

  @Column({ type: 'bit', default: false })
  discontinued!: boolean;
}
