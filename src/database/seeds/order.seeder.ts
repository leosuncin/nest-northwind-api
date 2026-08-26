import type { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import orderFixtures from './order.json';

const { ordersJson, detailsJson } = (() => {
  const orders = orderFixtures.map(({ details: _details, ...order }) => order);
  const details = orderFixtures.flatMap(({ details }) => details);

  return {
    ordersJson: JSON.stringify(orders),
    detailsJson: JSON.stringify(details),
  };
})();

export default class OrderSeeder implements Seeder {
  async run(dataSource: DataSource) {
    await dataSource.transaction(async (manager) => {
      await manager.sql`ALTER TABLE [order_detail] NOCHECK CONSTRAINT ALL;
      ALTER TABLE [order] NOCHECK CONSTRAINT ALL;

      MERGE INTO [order_detail] AS target
      USING OPENJSON(${detailsJson}) WITH (
        orderId bigint,
        productId bigint,
        unitPrice money,
        quantity int,
        discount real
      ) AS source
      ON target.orderId = source.orderId AND target.productId = source.productId
      WHEN MATCHED THEN
        UPDATE SET unitPrice = source.unitPrice, quantity = source.quantity, discount = source.discount
      WHEN NOT MATCHED THEN
        INSERT (orderId, productId, unitPrice, quantity, discount)
        VALUES (source.orderId, source.productId, source.unitPrice, source.quantity, source.discount);

      ALTER TABLE [order_detail] CHECK CONSTRAINT ALL;

      SET IDENTITY_INSERT [order] ON;

      MERGE INTO [order] AS target
      USING OPENJSON(${ordersJson}) WITH (
        id bigint,
        customerId bigint,
        employeeId bigint,
        orderDate datetime2,
        requiredDate datetime2,
        shippedDate datetime2,
        shipVia bigint,
        freight money,
        shipName varchar(40),
        shipAddress varchar(60),
        shipCity varchar(15),
        shipRegion varchar(15),
        shipPostalCode varchar(10),
        shipCountry varchar(15)
      ) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET customerId = source.customerId, employeeId = source.employeeId, orderDate = source.orderDate, requiredDate = source.requiredDate, shippedDate = source.shippedDate, shipVia = source.shipVia, freight = source.freight, shipName = source.shipName, shipAddress = source.shipAddress, shipCity = source.shipCity, shipRegion = source.shipRegion, shipPostalCode = source.shipPostalCode, shipCountry = source.shipCountry
      WHEN NOT MATCHED THEN
        INSERT (id, customerId, employeeId, orderDate, requiredDate, shippedDate, shipVia, freight, shipName, shipAddress, shipCity, shipRegion, shipPostalCode, shipCountry)
        VALUES (source.id, source.customerId, source.employeeId, source.orderDate, source.requiredDate, source.shippedDate, source.shipVia, source.freight, source.shipName, source.shipAddress, source.shipCity, source.shipRegion, source.shipPostalCode, source.shipCountry);

      SET IDENTITY_INSERT [order] OFF;
      ALTER TABLE [order] CHECK CONSTRAINT ALL`;
    });
  }
}
