const assert = require("assert");

const OrderStatus = {
  PLACED: "PLACED",
  PREPARING: "PREPARING",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELED: "CANCELED",
};

class Delivery {
  constructor(deliveryId, startMinute, endMinute) {
    this.deliveryId = deliveryId;
    this.startMinute = startMinute;
    this.endMinute = endMinute;
  }

  getDurationMinutes() {
    return this.endMinute - this.startMinute;
  }
}

class Order {
  constructor(
    orderId,
    restaurantId,
    customerId,
    orderValue,
    distanceKm,
    status
  ) {
    this.orderId = orderId;
    this.restaurantId = restaurantId;
    this.customerId = customerId;
    this.orderValue = orderValue;
    this.distanceKm = distanceKm;
    this.status = status;
  }
}

class OrderStats {
  constructor(totalOrders, activeOrders, closedOrders) {
    this.totalOrders = totalOrders;
    this.activeOrders = activeOrders;
    this.closedOrders = closedOrders;
  }
}

class OrderManager {
  constructor() {
    this.orders = [];
    this.deliveryMap = new Map();
  }

  addOrder(order) {
    this.orders.push(order);
  }

  updateOrderStatus(orderId, newStatus) {
    for (const order of this.orders) {
      if (order.orderId === orderId) {
        order.status = newStatus;
        return;
      }
    }
  }

  addDelivery(orderId, delivery) {
    const orderExists = this.orders.some(
      order => order.orderId === orderId
    );

    if (!orderExists) {
      return;
    }

    if (!this.deliveryMap.has(orderId)) {
      this.deliveryMap.set(orderId, []);
    }

    this.deliveryMap.get(orderId).push(delivery);
  }

  getAverageDeliveryTimeByRestaurant() {
    const restaurantStats = new Map();

    for (const order of this.orders) {
      const deliveries = this.deliveryMap.get(order.orderId);

      if (!deliveries) {
        continue;
      }

      if (!restaurantStats.has(order.restaurantId)) {
        restaurantStats.set(order.restaurantId, {
          totalDuration: 0,
          count: 0,
        });
      }

      const stats = restaurantStats.get(order.restaurantId);

      for (const delivery of deliveries) {
        stats.totalDuration += delivery.getDurationMinutes();
        stats.count++;
      }
    }

    const result = {};

    for (const [restaurantId, stats] of restaurantStats) {
      result[restaurantId] =
        stats.totalDuration / stats.count;
    }

    return result;
  }

  getOrderStatistics() {
    let active = 0;
    let closed = 0;

    for (const order of this.orders) {
      if (
        order.status === OrderStatus.PLACED ||
        order.status === OrderStatus.PREPARING ||
        order.status === OrderStatus.OUT_FOR_DELIVERY
      ) {
        active++;
      }
    }

    for (const order of this.orders) {
      if (
        order.status === OrderStatus.DELIVERED ||
        order.status === OrderStatus.CANCELED
      ) {
        closed++;
      }
    }

    return new OrderStats(
      this.orders.length,
      active,
      closed
    );
  }
}

/* ==========================
   TEST HELPERS
========================== */

function assertAlmost(expected, actual, eps = 0.0001) {
  assert.ok(
    Math.abs(expected - actual) <= eps,
    `Expected ${expected}, but got ${actual}`
  );
}

/* ==========================
   TESTS
========================== */

function testOrderManager() {
  console.log("Running testOrderManager");

  const om = new OrderManager();

  om.addOrder(
    new Order(1, 10, 100, 25.0, 3.2, OrderStatus.PLACED)
  );
  om.addOrder(
    new Order(2, 10, 101, 55.0, 1.4, OrderStatus.PREPARING)
  );
  om.addOrder(
    new Order(
      3,
      11,
      102,
      15.0,
      6.0,
      OrderStatus.OUT_FOR_DELIVERY
    )
  );
  om.addOrder(
    new Order(
      4,
      11,
      103,
      40.0,
      2.0,
      OrderStatus.DELIVERED
    )
  );
  om.addOrder(
    new Order(
      5,
      12,
      104,
      18.0,
      4.5,
      OrderStatus.CANCELED
    )
  );

  const stats = om.getOrderStatistics();

  assert.strictEqual(stats.totalOrders, 5);
  assert.strictEqual(stats.activeOrders, 3);
  assert.strictEqual(stats.closedOrders, 2);
}

function testGetAverageDeliveryTimeByRestaurant() {
  console.log(
    "Running testGetAverageDeliveryTimeByRestaurant"
  );

  const om = new OrderManager();

  om.addOrder(
    new Order(
      1,
      10,
      100,
      25,
      3.2,
      OrderStatus.DELIVERED
    )
  );
  om.addOrder(
    new Order(
      2,
      10,
      101,
      55,
      1.4,
      OrderStatus.DELIVERED
    )
  );
  om.addOrder(
    new Order(
      3,
      11,
      102,
      15,
      6,
      OrderStatus.DELIVERED
    )
  );

  om.addDelivery(1, new Delivery(101, 10, 40));
  om.addDelivery(2, new Delivery(102, 50, 80));
  om.addDelivery(2, new Delivery(103, 90, 150));
  om.addDelivery(3, new Delivery(104, 20, 50));

  om.addDelivery(999, new Delivery(105, 0, 10));

  const avg =
    om.getAverageDeliveryTimeByRestaurant();

  assertAlmost(40.0, avg[10]);
  assertAlmost(30.0, avg[11]);
}

/* ==========================
   RUN TESTS
========================== */

function runTests() {
  testOrderManager();
  testGetAverageDeliveryTimeByRestaurant();

  console.log("All tests passed.");
}

runTests();
