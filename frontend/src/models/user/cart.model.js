export class CartModel {
  constructor() {
    this.deliveryLocation = "";
    this.deliveryChannel = "";
    this.paymentChannel = "";
    this.orders = [];
  }
}

export class OrderModel {
  constructor(data) {
    this.storeID = data.storeID ? data.storeID : "";
    this.storeName = data.storeName ? data.storeName : "";
    this.orderDescription = "";
    this.items = [];
  }
}

export class OrderItemModel {
  constructor(data) {
    this.productID = data.productID ? data.productID : "";
    this.productName = data.productName ? data.productName : "";
    this.productPrice = data.productPrice ? data.productPrice : 0;
    this.amount = data.amount ? data.amount : 0;
  }
}
