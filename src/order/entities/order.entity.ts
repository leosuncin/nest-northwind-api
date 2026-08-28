import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Customer } from '../../customer/entities/customer.entity.js';
import { Employee } from '../../employee/entities/employee.entity.js';
import { Shipper } from '../../shipper/entities/shipper.entity.js';
import { OrderDetail } from './order-detail.entity.js';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @ManyToOne(() => Customer, { nullable: false })
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employeeId' })
  employee!: Employee;

  @Column({ type: 'datetime', nullable: true })
  orderDate?: Date;

  @Column({ type: 'datetime', nullable: true })
  requiredDate?: Date;

  @Column({ type: 'datetime', nullable: true })
  shippedDate?: Date;

  @ManyToOne(() => Shipper, { nullable: true })
  @JoinColumn({ name: 'shipVia' })
  shipVia?: Shipper;

  @Column({ type: 'money', nullable: true, default: 0 })
  @Check('freight >= 0')
  freight = 0;

  @Column({ length: 40, nullable: true })
  shipName?: string;

  @Column({ length: 60, nullable: true })
  shipAddress?: string;

  @Column({ length: 15, nullable: true })
  shipCity?: string;

  @Column({ length: 15, nullable: true })
  shipRegion?: string;

  @Column({ length: 10, nullable: true })
  shipPostalCode?: string;

  @Column({ length: 15, nullable: true })
  shipCountry?: string;

  @OneToMany(() => OrderDetail, (detail) => detail.order, { cascade: true })
  details?: OrderDetail[];
}
