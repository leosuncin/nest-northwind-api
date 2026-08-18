declare module './order.json' {
  type OrderDetail = {
    orderId: number;
    productId: number;
    unitPrice: number;
    quantity: number;
    discount: number;
  };
  type Order = {
    id: number;
    customerId: number;
    employeeId: number;
    orderDate: string | null;
    requiredDate: string | null;
    shippedDate: string | null;
    shipVia: number;
    freight: number;
    shipName: string;
    shipAddress: string;
    shipCity: string;
    shipRegion: string | null;
    shipPostalCode: string;
    shipCountry: string;
    details: OrderDetail[];
  };

  const orders: Order[];

  export default orders;
}
