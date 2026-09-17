import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';

import { Category } from '../../category/entities/category.entity.js';
import { Supplier } from '../../supplier/entities/supplier.entity.js';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ length: 40 })
  name!: string;

  @ManyToOne(() => Supplier, { nullable: false })
  @JoinColumn({ name: 'supplierId' })
  supplier!: Supplier;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @Column({ length: 20, nullable: true })
  quantityPerUnit?: string;

  @Column({ type: 'money', nullable: true, default: 0 })
  @Check(`unitPrice">= 0`)
  @Transform(({ value }) =>
    Number.isFinite(value)
      ? Math.round((value + Number.EPSILON) * 100) / 100
      : value,
  )
  unitPrice = 0;

  @Column({ type: 'int', nullable: true, default: 0 })
  @Check(`unitsInStock >= 0`)
  unitsInStock = 0;

  @Column({ type: 'int', nullable: true, default: 0 })
  @Check(`unitsOnOrder >= 0`)
  unitsOnOrder = 0;

  @Column({ type: 'smallint', nullable: true, default: 0 })
  @Check(`reorderLevel >= 0`)
  reorderLevel = 0;

  @Column({ type: 'bit', default: false })
  discontinued = false;
}
