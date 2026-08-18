import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import orderFixtures from './order.json';

export default class OrderSeeder implements Seeder {
  async run(dataSource: DataSource) {
    await dataSource.transaction(async (manager) => {
      for (const order of orderFixtures) {
        await manager.sql`SET IDENTITY_INSERT [order] ON;
        ALTER TABLE [order] NOCHECK CONSTRAINT ALL;
        MERGE INTO [order] AS target
        USING (VALUES (${order.id}, ${order.customerId}, ${order.employeeId}, ${order.orderDate}, ${order.requiredDate}, ${order.shippedDate}, ${order.shipVia}, ${order.freight}, ${order.shipName}, ${order.shipAddress}, ${order.shipCity}, ${order.shipRegion}, ${order.shipPostalCode}, ${order.shipCountry})) AS source (id, customerId, employeeId, orderDate, requiredDate, shippedDate, shipVia, freight, shipName, shipAddress, shipCity, shipRegion, shipPostalCode, shipCountry)
        ON target.id = source.id
        WHEN MATCHED THEN
          UPDATE SET customerId = source.customerId, employeeId = source.employeeId, orderDate = source.orderDate, requiredDate = source.requiredDate, shippedDate = source.shippedDate, shipVia = source.shipVia, freight = source.freight, shipName = source.shipName, shipAddress = source.shipAddress, shipCity = source.shipCity, shipRegion = source.shipRegion, shipPostalCode = source.shipPostalCode, shipCountry = source.shipCountry
        WHEN NOT MATCHED THEN
          INSERT (id, customerId, employeeId, orderDate, requiredDate, shippedDate, shipVia, freight, shipName, shipAddress, shipCity, shipRegion, shipPostalCode, shipCountry)
          VALUES (source.id, source.customerId, source.employeeId, source.orderDate, source.requiredDate, source.shippedDate, source.shipVia, source.freight, source.shipName, source.shipAddress, source.shipCity, source.shipRegion, source.shipPostalCode, source.shipCountry)
        OUTPUT $action, inserted.*;
        SET IDENTITY_INSERT [order] OFF;
        ALTER TABLE [order] CHECK CONSTRAINT ALL;
        `;

        for (const detail of order.details) {
          await manager.sql`ALTER TABLE [order_detail] NOCHECK CONSTRAINT ALL;
          MERGE INTO [order_detail] AS target
          USING (VALUES (${detail.orderId}, ${detail.productId}, ${detail.unitPrice}, ${detail.quantity}, ${detail.discount})) AS source (orderId, productId, unitPrice, quantity, discount)
          ON target.orderId = source.orderId AND target.productId = source.productId
          WHEN MATCHED THEN
            UPDATE SET unitPrice = source.unitPrice, quantity = source.quantity, discount = source.discount
          WHEN NOT MATCHED THEN
            INSERT (orderId, productId, unitPrice, quantity, discount)
            VALUES (source.orderId, source.productId, source.unitPrice, source.quantity, source.discount)
          OUTPUT $action, inserted.*;
          ALTER TABLE [order_detail] CHECK CONSTRAINT ALL;
        `;
        }
      }
    });
  }
}
