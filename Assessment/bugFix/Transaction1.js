const assert = require("assert");

const TransactionType = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT"
};

class Account {
  constructor(accountId, ownerName) {
    this.accountId = accountId;
    this.ownerName = ownerName;
  }
}

class Transaction {
  constructor(
    transactionId,
    accountId,
    type,
    amount,
    timestampSec
  ) {
    this.transactionId = transactionId;
    this.accountId = accountId;
    this.type = type;
    this.amount = amount;
    this.timestampSec = timestampSec;
  }
}

class AccountManager {
  constructor() {
    this.accounts = new Map();
    this.transactions = [];
  }

  addAccount(account) {
    this.accounts.set(account.accountId, account);
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  // Fixed bug
  getBalance(accountId) {
    let balance = 0;

    for (const tx of this.transactions) {
      if (tx.accountId === accountId) {
        if (tx.type === TransactionType.CREDIT) {
          balance += tx.amount;
        } else if (tx.type === TransactionType.DEBIT) {
          balance -= tx.amount;
        }
      }
    }

    return balance;
  }

  // Implemented
  getAverageTransactionAmountByAccount() {
    const totals = new Map();
    const counts = new Map();

    for (const tx of this.transactions) {
      const accountId = tx.accountId;
      const amount = Math.abs(tx.amount);

      totals.set(
        accountId,
        (totals.get(accountId) || 0) + amount
      );

      counts.set(
        accountId,
        (counts.get(accountId) || 0) + 1
      );
    }

    const result = new Map();

    for (const [accountId, total] of totals.entries()) {
      result.set(
        accountId,
        total / counts.get(accountId)
      );
    }

    return result;
  }
}

function assertAlmost(expected, actual, eps = 0.0001) {
  assert.ok(
    Math.abs(expected - actual) <= eps,
    `Expected ${expected}, but got ${actual}`
  );
}

function testGetBalanceBasic() {
  console.log("Running testGetBalanceBasic");

  const mgr = new AccountManager();

  mgr.addAccount(
    new Account(
      1,
      "Alice"
    )
  );

  mgr.addTransaction(
    new Transaction(
      101,
      1,
      TransactionType.CREDIT,
      100,
      1000
    )
  );

  mgr.addTransaction(
    new Transaction(
      102,
      1,
      TransactionType.DEBIT,
      30,
      1010
    )
  );

  mgr.addTransaction(
    new Transaction(
      103,
      1,
      TransactionType.DEBIT,
      20,
      1020
    )
  );

  mgr.addTransaction(
    new Transaction(
      104,
      1,
      TransactionType.CREDIT,
      10,
      1030
    )
  );

  assertAlmost(
    60,
    mgr.getBalance(1)
  );
}

function testGetBalanceMultipleAccounts() {
  console.log(
    "Running testGetBalanceMultipleAccounts"
  );

  const mgr = new AccountManager();

  mgr.addAccount(
    new Account(
      1,
      "Alice"
    )
  );

  mgr.addAccount(
    new Account(
      2,
      "Bob"
    )
  );

  mgr.addTransaction(
    new Transaction(
      201,
      1,
      TransactionType.CREDIT,
      50,
      2000
    )
  );

  mgr.addTransaction(
    new Transaction(
      202,
      2,
      TransactionType.CREDIT,
      80,
      2005
    )
  );

  mgr.addTransaction(
    new Transaction(
      203,
      1,
      TransactionType.DEBIT,
      10,
      2010
    )
  );

  mgr.addTransaction(
    new Transaction(
      204,
      2,
      TransactionType.DEBIT,
      5.5,
      2015
    )
  );

  mgr.addTransaction(
    new Transaction(
      205,
      2,
      TransactionType.DEBIT,
      14.5,
      2020
    )
  );

  assertAlmost(
    40,
    mgr.getBalance(1)
  );

  assertAlmost(
    60,
    mgr.getBalance(2)
  );
}

function testGetAverageTransactionAmountByAccount() {
  console.log(
    "Running testGetAverageTransactionAmountByAccount"
  );

  const mgr = new AccountManager();

  mgr.addAccount(
    new Account(
      1,
      "Alice"
    )
  );

  mgr.addAccount(
    new Account(
      2,
      "Bob"
    )
  );

  mgr.addAccount(
    new Account(
      3,
      "Charlie"
    )
  );

  // Account 1
  mgr.addTransaction(
    new Transaction(
      101,
      1,
      TransactionType.CREDIT,
      100,
      1000
    )
  );

  mgr.addTransaction(
    new Transaction(
      102,
      1,
      TransactionType.DEBIT,
      30,
      1010
    )
  );

  mgr.addTransaction(
    new Transaction(
      103,
      1,
      TransactionType.DEBIT,
      20,
      1020
    )
  );

  mgr.addTransaction(
    new Transaction(
      104,
      1,
      TransactionType.CREDIT,
      10,
      1030
    )
  );

  // Account 2
  mgr.addTransaction(
    new Transaction(
      201,
      2,
      TransactionType.CREDIT,
      80,
      2005
    )
  );

  mgr.addTransaction(
    new Transaction(
      202,
      2,
      TransactionType.DEBIT,
      5.5,
      2015
    )
  );

  mgr.addTransaction(
    new Transaction(
      203,
      2,
      TransactionType.DEBIT,
      14.5,
      2020
    )
  );

  const avg =
    mgr.getAverageTransactionAmountByAccount();

  assertAlmost(
    40,
    avg.get(1)
  );

  assertAlmost(
    33.3333,
    avg.get(2)
  );

  assert.strictEqual(
    avg.has(3),
    false
  );
}

function main() {
  testGetBalanceBasic();
  testGetBalanceMultipleAccounts();
  testGetAverageTransactionAmountByAccount();

  console.log(
    "All tests passed."
  );
}

main();
