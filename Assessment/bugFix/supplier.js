const assert = require('assert');
 
class Supplier {
  constructor(id, name, rating, products) {
    this.id = id;
    this.name = name;
    this.rating = rating;
    this.products = Array.isArray(products) ? products : [];
  }
 
  addProduct(product) {
    if (!product || !product.id) return false;
 
    const exists = this.products.find(p => p.id === product.id);
 
    if (exists) return false;
 
    this.products.push(product);
    return true;
  }
 
  removeProduct(productId) {
    if (!productId) return false;
 
    const initialLength = this.products.length;
 
    this.products = this.products.filter(
      product => product && product.id !== productId
    );
 
    return this.products.length < initialLength;
  }
 
  // FIX 1: Missing function
  getAveragePrice() {
    const validProducts = this.products.filter(
      product =>
        product &&
        typeof product.price === 'number'
    );
 
    if (validProducts.length === 0) {
      return 0;
    }
 
    const totalPrice = validProducts.reduce(
      (sum, product) => sum + product.price,
      0
    );
 
    return totalPrice / validProducts.length;
  }
 
  isReliable() {
    if (this.rating == null) return false;
 
    const averagePrice = this.getAveragePrice();
 
    return this.rating >= 4 && averagePrice > 0;
  }
 
  supplyValue() {
    return this.products.reduce((total, product) => {
      if (
        product &&
        typeof product.price === 'number' &&
        typeof product.stock === 'number'
      ) {
        return total + product.price * product.stock;
      }
 
      return total;
    }, 0);
  }
 
  findProductByCategory(category) {
    if (!category) return [];
 
    return this.products.filter(
      product =>
        product &&
        product.category === category
    );
  }
}
 
class InventoryItem {
  constructor(id, name, category, price, stock) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.stock = stock;
  }
 
  restock(quantity, supplier) {
    if (
      !supplier ||
      quantity == null ||
      quantity <= 0
    ) {
      return false;
    }
 
    if (!supplier.isReliable()) {
      return false;
    }
 
    this.stock += quantity;
    return true;
  }
 
  reduceStock(quantity) {
    if (quantity == null || quantity <= 0) {
      return false;
    }
 
    if (this.stock < quantity) {
      return false;
    }
 
    this.stock -= quantity;
    return true;
  }
 
  applyDiscount(percent) {
    if (
      percent == null ||
      percent <= 0 ||
      percent > 100
    ) {
      return false;
    }
 
    const discount = this.price * (percent / 100);
    this.price = Math.max(0, this.price - discount);
 
    return true;
  }
 
  totalValue() {
    if (
      typeof this.price !== 'number' ||
      typeof this.stock !== 'number'
    ) {
      return 0;
    }
 
    return this.price * this.stock;
  }
 
  isLowStock(threshold) {
    if (threshold == null || threshold < 0) {
      return false;
    }
 
    return this.stock < threshold;
  }
 
  canFulfill(quantity, supplier) {
    if (
      !supplier ||
      quantity == null ||
      quantity <= 0
    ) {
      return false;
    }
 
    const available = this.stock >= quantity;
    const reliable = supplier.isReliable();
 
    return available && reliable;
  }
}
 
class Order {
  constructor(id, customerName, items, status) {
    this.id = id;
    this.customerName = customerName;
    this.items = Array.isArray(items) ? items : [];
    this.status = status || 'CREATED';
  }
 
  addItem(item, quantity) {
    if (
      !item ||
      quantity == null ||
      quantity <= 0
    ) {
      return false;
    }
 
    this.items.push({ item, quantity });
    return true;
  }
 
  calculateTotal() {
    return this.items.reduce((total, entry) => {
      if (
        entry &&
        entry.item &&
        typeof entry.item.price === 'number' &&
        typeof entry.quantity === 'number'
      ) {
        return total + entry.item.price * entry.quantity;
      }
 
      return total;
    }, 0);
  }
 
  validateStock(supplier) {
    if (!supplier || this.items.length === 0) {
      return false;
    }
 
    for (const entry of this.items) {
      if (
        !entry ||
        !entry.item ||
        !entry.item.canFulfill(entry.quantity, supplier)
      ) {
        return false;
      }
    }
 
    return true;
  }
 
  process(supplier) {
    if (this.status !== 'CREATED') {
      return false;
    }
 
    if (!this.validateStock(supplier)) {
      return false;
    }
 
    for (const entry of this.items) {
      const stockReduced = entry.item.reduceStock(entry.quantity);
 
      if (!stockReduced) {
        return false;
      }
    }
 
    this.status = 'PROCESSED';
    return true;
  }
 
  cancel() {
    if (
      this.status === 'PROCESSED' ||
      this.status === 'CANCELLED'
    ) {
      return false;
    }
 
    this.status = 'CANCELLED';
    return true;
  }
 
  summary() {
    return {
      id: this.id,
      customer: this.customerName,
      total: this.calculateTotal(),
      status: this.status
    };
  }
}
 
class Restaurant {
  constructor(id, name, supplier, inventory) {
    this.id = id;
    this.name = name;
    this.supplier = supplier;
    this.inventory = Array.isArray(inventory) ? inventory : [];
  }
 
  addInventoryItem(item) {
    if (!item || !item.id) return false;
 
    const exists = this.inventory.find(
      inventoryItem => inventoryItem.id === item.id
    );
 
    if (exists) return false;
 
    this.inventory.push(item);
    return true;
  }
 
  placeOrder(order) {
    if (!order || !this.supplier) {
      return false;
    }
 
    return order.process(this.supplier);
  }
 
  // FIX 2: Changed subtraction to addition
  inventoryValue() {
    return this.inventory
      .map(item => item.totalValue())
      .reduce((total, value) => total + value, 0);
  }
 
  lowStockItems(threshold) {
    return this.inventory.filter(
      item => item.isLowStock(threshold)
    );
  }
 
  restockLowItems(threshold, quantity) {
    const lowStockItems = this.lowStockItems(threshold);
 
    for (const item of lowStockItems) {
      item.restock(quantity, this.supplier);
    }
 
    return lowStockItems.length;
  }
 
  // FIX 3: Missing function
  supplierReport() {
    if (!this.supplier) {
      return {
        supplierName: '',
        reliable: false,
        supplyValue: 0
      };
    }
 
    return {
      supplierName: this.supplier.name,
      reliable: this.supplier.isReliable(),
      supplyValue: this.supplier.supplyValue()
    };
  }
}
 
// Test data
const supplier = new Supplier(1, 'Global Foods', 5, []);
 
const item1 = new InventoryItem(
  1,
  'Tomato',
  'Vegetable',
  2,
  50
);
 
const item2 = new InventoryItem(
  2,
  'Cheese',
  'Dairy',
  5,
  20
);
 
const item3 = new InventoryItem(
  3,
  'Chicken',
  'Meat',
  8,
  10
);
 
supplier.addProduct(item1);
supplier.addProduct(item2);
supplier.addProduct(item3);
 
const restaurant = new Restaurant(
  1,
  'Fine Dine',
  supplier,
  [item1, item2, item3]
);
 
// Assertions
assert.strictEqual(supplier.products.length, 3);
assert.strictEqual(supplier.getAveragePrice() > 0, true);
assert.strictEqual(supplier.isReliable(), true);
assert.strictEqual(item1.totalValue(), 100);
assert.strictEqual(item2.isLowStock(25), true);
assert.strictEqual(item3.isLowStock(5), false);
 
assert.strictEqual(item1.applyDiscount(10), true);
assert.strictEqual(item1.price < 2, true);
 
assert.strictEqual(item2.restock(10, supplier), true);
assert.strictEqual(item2.stock, 30);
 
assert.strictEqual(item3.reduceStock(5), true);
assert.strictEqual(item3.stock, 5);
assert.strictEqual(item3.reduceStock(100), false);
 
const order = new Order(1, 'John Doe', [], 'CREATED');
 
assert.strictEqual(order.addItem(item1, 5), true);
assert.strictEqual(order.addItem(item2, 5), true);
assert.strictEqual(order.calculateTotal() > 0, true);
assert.strictEqual(order.validateStock(supplier), true);
assert.strictEqual(restaurant.placeOrder(order), true);
assert.strictEqual(order.status, 'PROCESSED');
assert.strictEqual(item1.stock >= 0, true);
assert.strictEqual(item2.stock >= 0, true);
 
const order2 = new Order(2, 'Jane Roe', [], 'CREATED');
 
order2.addItem(item3, 100);
 
assert.strictEqual(order2.validateStock(supplier), false);
assert.strictEqual(order2.process(supplier), false);
assert.strictEqual(order2.cancel(), true);
assert.strictEqual(order2.status, 'CANCELLED');
 
assert.strictEqual(restaurant.inventoryValue() > 0, true);
assert.strictEqual(
  restaurant.lowStockItems(15).length >= 0,
  true
);
assert.strictEqual(
  restaurant.restockLowItems(15, 20) >= 0,
  true
);
 
assert.strictEqual(
  typeof restaurant.supplierReport().supplierName,
  'string'
);
assert.strictEqual(
  typeof restaurant.supplierReport().reliable,
  'boolean'
);
assert.strictEqual(
  typeof restaurant.supplierReport().supplyValue,
  'number'
);
 
assert.strictEqual(
  supplier.findProductByCategory('Dairy').length,
  1
);
assert.strictEqual(supplier.removeProduct(999), false);
assert.strictEqual(supplier.removeProduct(3), true);
assert.strictEqual(supplier.products.length, 2);
 
console.log('All tests passed successfully');
