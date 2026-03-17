"use strict";
/*
We are developing a stock trading data management software that tracks the prices of different stocks over time and provides useful statistics.

The program includes three classes: `Stock`, `PriceRecord`, and `StockCollection`.

Classes:
* The `Stock` class represents data about a specific stock.
* The `PriceRecord` class holds information about a single price record for a stock.
* The `StockCollection` class manages a collection of price records for a particular stock and provides methods to retrieve useful statistics about the stock's prices.

To begin with, we present you with two tasks:
1-1) Read through and understand the code below. Please take as much time as necessary, and feel free to run the code.
1-2) The test for StockCollection is not passing due to a bug in the code. Make the necessary changes to StockCollection to fix the bug.
*/
/*
2) 
*/
const assert = require("assert");

class Stock {
  /* Data about a particular stock. */
  constructor(symbol, name) {
    this.symbol = symbol; // String, the symbol of the stock
    this.name = name; // String, the name of the stock
  }

  isEqual(other) {
    if (!(other instanceof this.constructor)) return false;
    return this.symbol === other.symbol && this.name === other.name;
  }
}

class PriceRecord {
  /* Data and methods about a single price record of a stock. */
  constructor(stock, price, date) {
    this.stock = stock; // a Stock object representing the stock
    this.price = price; // int, the price of the stock
    this.date = date; // str, the date of the price record is of the format "YYYY-MM-DD"
  }

  isEqual(other) {
    if (!(other instanceof this.constructor)) return false;
    return this.stock.isEqual(other.stock) && this.price === other.price && this.date === other.date;
  }
}

class StockCollection {
  /*
   * Data for a collection of price records for a particular stock, and methods for getting
   * useful statistics about the stock's prices.
   */
  constructor(stock) {
    this.priceRecords = []; // list of PriceRecord objects, the price records for this particular stock
    this.stock = stock; // stock, the Stock this StockCollection is for
  }

  getNumPriceRecords() {
    /* Returns the number of PriceRecords in this StockCollection */
    return this.priceRecords.length;
  }

  addPriceRecord(priceRecord) {
    /* Adds a PriceRecord to this StockCollection. */
    if (!priceRecord.stock.isEqual(this.stock)) {
      throw new Error("PriceRecord's Stock is not the same as the StockCollection's");
    }
    this.priceRecords.push(priceRecord);
  }

  getMaxPrice() {
    if(this.priceRecords.length === 0) {
      return null;
    }
    /* Return the maximum price recorded in this StockCollection. */
    return Math.max(...this.priceRecords.map((priceRecord) => priceRecord.price));
  }

  getMinPrice() {
    if(this.priceRecords.length === 0) {
      return null;
    }
    /* Return the minimum price recorded in this StockCollection. */
    return Math.min(...this.priceRecords.map((priceRecord) => priceRecord.price));
  }

  getAvgPrice() {
    if(this.priceRecords.length === 0) {
      return null;
    }
    /* Return the average price recorded in this StockCollection. */
    const total = this.priceRecords.reduce((acc, priceRecord) => acc + priceRecord.price, 0);
    return total / this.priceRecords.length;
  }
  
  getBiggestChange(){
    if (this.priceRecords.length < 2) return null;
    // console.log(this.priceRecords);
    
    const sortedRecords = [...this.priceRecords].sort((a,b) => a.date.localeCompare(b.date))
    
    let biggestChange = null;
    let startDate = "";
    let endDate = "";
    
    for (let i = 0; i < sortedRecords.length-1; i++){
      const current = sortedRecords[i];
      const next = sortedRecords[i + 1];
      const change = next.price - current.price;
      
      if (biggestChange === null || Math.abs(change)>Math.abs(biggestChange)){
        biggestChange = change;
        startDate = current.date;
        endDate = next.date;
      }
    }
    
    return [biggestChange, startDate, endDate];
    
  }
}

const makeStockCollection = function (stock, priceData) {
  // Create a new StockCollection for test purposes.
  const stockCollection = new StockCollection(stock);
  for (const [price, date] of priceData) {
    const priceRecord = new PriceRecord(stock, price, date);
    stockCollection.addPriceRecord(priceRecord);
  }
  return stockCollection;
};

const testMethods = {
  testPriceRecord: () => {
    /* Test basic PriceRecord functionality */
    const testStock = new Stock("AAPL", "Apple Inc.");
    const testPriceRecord = new PriceRecord(testStock, 100, "2023-07-01");
    assert.strictEqual(testPriceRecord.stock, testStock);
    assert.strictEqual(testPriceRecord.price, 100);
    assert.strictEqual(testPriceRecord.date, "2023-07-01");
  },
  testStockCollection: () => {
    /* Test basic StockCollection functionality */
    const testStock = new Stock("AAPL", "Apple Inc.");
    const stockCollection = new StockCollection(testStock);
    assert.strictEqual(stockCollection.getNumPriceRecords(), 0);
    assert.strictEqual(stockCollection.getMaxPrice(), null);
    assert.strictEqual(stockCollection.getMinPrice(), null);
    assert.strictEqual(stockCollection.getAvgPrice(), null);

    /* Price Records:
     * Price:  110         112         90          105
     * Date:   2023-06-29  2023-07-01  2023-06-28  2023-07-06
     */
    const priceData = [
      [110, "2023-06-29"],
      [112, "2023-07-01"],
      [90, "2023-06-28"],
      [105, "2023-07-06"],
    ];
    const testStock2 = new Stock("AAPL", "Apple Inc.");
    const stockCollection2 = makeStockCollection(testStock2, priceData);
    assert.strictEqual(stockCollection2.getNumPriceRecords(), priceData.length);
    assert.strictEqual(stockCollection2.getMaxPrice(), 112);
    assert.strictEqual(stockCollection2.getMinPrice(), 90);
    assert.ok(Math.abs(stockCollection2.getAvgPrice() - 104.25) < 0.1);
  },
  testGetBiggestChange: () => {
    /* Test the getBiggestChange method */
    const testStock = new Stock("AAPL", "Apple Inc.");
    const stockCollection = new StockCollection(testStock);
    assert.strictEqual(stockCollection.getBiggestChange(), null);

    /* Price Records:
     * Price:  110         112         90          105
     * Date:   2023-06-29  2023-07-01  2023-06-25  2023-07-06
     */
    const priceData = [
      [110, "2023-06-29"],
      [112, "2023-07-01"],
      [90, "2023-06-25"],
      [105, "2023-07-06"],
    ];
    const stockCollection2 = makeStockCollection(testStock, priceData);
    assert.deepStrictEqual(stockCollection2.getBiggestChange(), [20, "2023-06-25", "2023-06-29"]);

    /* Price Records:
     * Price:  200         210         190          180
     * Date:   2000-01-04  1999-12-30  2000-01-03  2000-01-01
     */
    const priceData2 = [
      [200, "2000-01-04"],
      [210, "1999-12-30"],
      [190, "2000-01-03"],
      [180, "2000-01-01"],
    ];
    const stockCollection3 = makeStockCollection(testStock, priceData2);
    assert.deepStrictEqual(stockCollection3.getBiggestChange(), [-30, "1999-12-30", "2000-01-01"]);
  },
}

// run all tests
Object.getOwnPropertyNames(testMethods).forEach((func) => {
  try {
    console.log(`Running ${func}`);
    testMethods[func]();
    console.log('OK');
  } catch (e) {
    console.log('FAIL');
    console.log(e);
  }
  console.log('');
});