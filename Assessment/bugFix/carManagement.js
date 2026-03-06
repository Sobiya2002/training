
/*
  Car Rental Management System

  - Manage cars
  - Manage customers
  - Create rentals
  - Calculate bill with discount
  - Cancel rentals
  - Loyalty points system
  - TODO: Find most expensive available car

  There are logical bugs.
  Do NOT modify the test cases.
*/

const assert = require("assert");

class CarManager {
  constructor() {
    this.cars = [];
  }

  addCar(carId, model, pricePerDay) {
    const car = { carId, model, pricePerDay, isAvailable: true };
    this.cars.push(car);
    return car;
  }

  findCar(carId) {
    for (let car of this.cars) {
      if (car.carId === carId) return car;
    }
    return null;
  }

  getAvailableCars() {
    const available = [];
    for (let i = 0; i < this.cars.length; i++) {  
      if (this.cars[i].isAvailable) available.push(this.cars[i]);
    }
    return available;
  }

  markUnavailable(carId) {
    const car = this.findCar(carId);
    if (car) car.isAvailable = false;
    return car;
  }

  markAvailable(carId) {
    const car = this.findCar(carId);
    if (car) car.isAvailable = true; // BUG: should make available
    return car;
  }
}

class CustomerManager {
  constructor() {
    this.customers = [];
  }

  addCustomer(id, name) {
    const c = { id, name, points: 0 };
    this.customers.push(c);
    return c;
  }

  findCustomer(id) {
    return this.customers.find(c => c.id === id) || null;
  }

  addPoints(id, amount) {
    const c = this.findCustomer(id);
    if (!c) return null;

    const earned = amount / 10; // BUG: tests expect different
    c.points += earned;
    return c.points;
  }

  totalCustomers() {
    return this.customers.length;
  }
}

class RentalManager {
  constructor(carManager, customerManager) {
    this.rentals = [];
    this.carManager = carManager;
    this.customerManager = customerManager;
  }

  createRental(customerId, carId, days) {
    const c = this.customerManager.findCustomer(customerId);
    const car = this.carManager.findCar(carId);

    if (!c || !car || !car.isAvailable) return null;

    const rental = { customerId, carId, days };
    this.rentals.push(rental);

    this.carManager.markUnavailable(carId);

    const total = car.pricePerDay * days;
    this.customerManager.addPoints(customerId, total);

    return rental;
  }

  calculateBill(carId, days) {
    const car = this.carManager.findCar(carId);
    if (!car) return 0;

    let total = car.pricePerDay * days;

    if (days >= 7) {
      total = total - 200; // BUG: discount not applied
    }

    return total;
  }

  cancelRental(carId) {
    for (let i = 0; i < this.rentals.length; i++) {
      if (this.rentals[i].carId === carId) {
        this.rentals.splice(i, 1);
        this.carManager.markAvailable(carId); // depends on markAvailable correctness
        return true;
      }
    }
    return false;
  }

  totalRentals() {
    return this.rentals.length;
  }

  /*
    TODO
    Return highest priced available car (by pricePerDay)
    If none available, return null
  */
  findMostExpensiveAvailableCar() {
    // console.log(this.carManager.cars);
    const availableCars = this.carManager.cars.filter(c => c.isAvailable);
    
    if(availableCars.length === 0) return null;
    console.log(availableCars);
    
    let highestPrice = availableCars[0];
    
    for (let i=0; i < availableCars.length; i++){
      const cars = availableCars[i];
      
      if (cars.pricePerDay > highestPrice){
        highestPrice = cars;
      }
    }
    return highestPrice;
  }
}

/* ===========================
   TEST CASES (Assertions)
   =========================== */

const carManager = new CarManager();
const customerManager = new CustomerManager();
const rentalManager = new RentalManager(carManager, customerManager);

// Add Cars
carManager.addCar(1, "Hatchback", 1000);
carManager.addCar(2, "Sedan", 2000);
carManager.addCar(3, "SUV", 3000);

// Add Customers
customerManager.addCustomer(1, "John");
customerManager.addCustomer(2, "Alex");

// Car Tests
assert.strictEqual(carManager.cars.length, 3);
assert.strictEqual(carManager.getAvailableCars().length, 3);

// Customer Tests
assert.strictEqual(customerManager.totalCustomers(), 2);
assert.strictEqual(customerManager.findCustomer(1).name, "John");

// Create Rental
rentalManager.createRental(1, 1, 3);
assert.strictEqual(rentalManager.totalRentals(), 1);
assert.strictEqual(carManager.findCar(1).isAvailable, false);

// Points: (1000 * 3 = 3000) => 300 expected
assert.strictEqual(customerManager.findCustomer(1).points, 300);

// Bill Tests
assert.strictEqual(rentalManager.calculateBill(2, 2), 4000);
assert.strictEqual(rentalManager.calculateBill(3, 7), 20800);

// Cancel Rental
assert.strictEqual(rentalManager.cancelRental(1), true);
assert.strictEqual(carManager.findCar(1).isAvailable, true);
assert.strictEqual(rentalManager.totalRentals(), 0);

// TODO Tests
assert.strictEqual(typeof rentalManager.findMostExpensiveAvailableCar, "function");
carManager.markUnavailable(3);
carManager.markUnavailable(2);
assert.strictEqual(rentalManager.findMostExpensiveAvailableCar().carId, 1);
carManager.markUnavailable(1);
assert.strictEqual(rentalManager.findMostExpensiveAvailableCar(), null);

console.log("All tests passed!");
