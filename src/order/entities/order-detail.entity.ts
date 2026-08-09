import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class OrderDetail {
  @PrimaryColumn({ type: 'bigint' })
  orderId!: number;

  @PrimaryColumn({ type: 'bigint' })
  productId!: number;

  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'money', default: 0 })
  @Check('unitPrice >= 0')
  unitPrice = 0;

  @Column({ type: 'smallint', default: 1 })
  @Check('quantity > 0')
  quantity = 1;

  @Column({ type: 'real', default: 0 })
  @Check('discount >= 0 AND discount <= 1')
  discount = 0;
}
