import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from 'typeorm';

import { Product } from '../../product/entities/product.entity.js';
import { moneyTransformer } from '../../shared/utils/money-transformer.js';
import { Order } from './order.entity.js';

@Entity()
export class OrderDetail {
  @PrimaryColumn({ type: 'bigint' })
  orderId!: number;

  @PrimaryColumn({ type: 'bigint' })
  productId!: number;

  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: 'orderId' })
  order!: Relation<Order>;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'money', default: 0, transformer: moneyTransformer })
  @Check('unitPrice >= 0')
  unitPrice = 0;

  @Column({ type: 'smallint', default: 1 })
  @Check('quantity > 0')
  quantity = 1;

  @Column({ type: 'real', default: 0 })
  @Check('discount >= 0 AND discount <= 1')
  discount = 0;
}
