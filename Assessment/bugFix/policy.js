const assert = require('assert');
 
class Customer {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.policies = [];
    this.claims = [];
  }
 
  buyPolicy(policy) {
    if (!policy || policy.customerId !== this.id) {
      return this.policies.length;
    }
 
    this.policies.push(policy);
    policy.status = "active";
 
    return this.policies.length;
  }
 
  fileClaim(claim) {
    if (!claim || claim.customerId !== this.id) {
      return this.claims.length;
    }
 
    this.claims.push(claim);
    claim.status = "filed";
 
    return this.claims.length;
  }
 
  payPremium(policy, amount) {
    if (
      !policy ||
      policy.customerId !== this.id ||
      amount == null ||
      amount <= 0
    ) {
      return false;
    }
 
    policy.receivePremium(amount);
    return policy.paidPremium;
  }
 
  getTotalCoverage() {
    let total = 0;
 
    for (const policy of this.policies) {
      total += policy.coverageAmount;
    }
 
    return total;
  }
 
  // Missing function implemented
  getActivePolicies() {
    return this.policies.filter(
      policy => policy && policy.status === "active"
    ).length;
  }
 
  linkClaimToPolicy(claim, policy) {
    if (!claim || !policy) {
      return false;
    }
 
    if (
      claim.customerId !== this.id ||
      policy.customerId !== this.id
    ) {
      return false;
    }
 
    claim.policyNumber = policy.number;
    policy.claims.push(claim);
 
    return policy.claims.length;
  }
}
 
class Policy {
  constructor(number, customerId, coverageAmount) {
    this.number = number;
    this.customerId = customerId;
    this.coverageAmount = coverageAmount;
    this.paidPremium = 0;
    this.status = "new";
    this.claims = [];
  }
 
  calculatePremium(rate) {
    if (rate == null || rate < 0) {
      return 0;
    }
 
    return this.coverageAmount * rate;
  }
 
  receivePremium(amount) {
    if (amount == null || amount <= 0) {
      return this.paidPremium;
    }
 
    this.paidPremium += amount;
 
    if (this.paidPremium > 0) {
      this.status = "active";
    }
 
    return this.paidPremium;
  }
 
  addCoverage(amount) {
    if (amount == null || amount <= 0) {
      return this.coverageAmount;
    }
 
    this.coverageAmount += amount;
    return this.coverageAmount;
  }
 
  reduceCoverage(amount) {
    if (
      amount == null ||
      amount <= 0 ||
      amount > this.coverageAmount
    ) {
      return this.coverageAmount;
    }
 
    // Bug fix: subtract instead of multiply
    this.coverageAmount -= amount;
 
    return this.coverageAmount;
  }
 
  getClaimSummary() {
    const summary = {};
 
    for (const claim of this.claims) {
      summary[claim.status] =
        (summary[claim.status] || 0) + 1;
    }
 
    return summary;
  }
 
  closePolicy() {
    this.status = "closed";
    return this.status;
  }
}
 
class Claim {
  constructor(id, customerId, amount) {
    this.id = id;
    this.customerId = customerId;
    this.amount = amount;
    this.status = "new";
    this.approvedAmount = 0;
  }
 
  assess(deductionRate) {
    if (
      deductionRate == null ||
      deductionRate < 0 ||
      deductionRate > 1
    ) {
      return this.approvedAmount;
    }
 
    this.approvedAmount =
      this.amount - this.amount * deductionRate;
 
    return this.approvedAmount;
  }
 
  approve() {
    this.status = "approved";
    return this.status;
  }
 
  reject() {
    this.status = "rejected";
    return this.status;
  }
 
  payOut() {
    if (this.status === "approved") {
      this.status = "paid";
    }
 
    return this.status;
  }
 
  updateAmount(amount) {
    if (amount == null || amount < 0) {
      return this.amount;
    }
 
    this.amount = amount;
    return this.amount;
  }
 
  getOutstanding() {
    return this.status === "paid"
      ? 0
      : this.approvedAmount;
  }
}
 
class InsuranceCompany {
  constructor(name) {
    this.name = name;
    this.customers = [];
    this.policies = [];
    this.revenue = 0;
  }
 
  registerCustomer(customer) {
    if (!customer) {
      return this.customers.length;
    }
 
    const exists = this.customers.some(
      existingCustomer => existingCustomer.id === customer.id
    );
 
    if (exists) {
      return this.customers.length;
    }
 
    this.customers.push(customer);
    return this.customers.length;
  }
 
  issuePolicy(policy) {
    if (!policy) {
      return this.policies.length;
    }
 
    this.policies.push(policy);
    policy.status = "issued";
 
    return this.policies.length;
  }
 
  collectPremium(amount) {
    if (amount == null || amount <= 0) {
      return this.revenue;
    }
 
    this.revenue += amount;
    return this.revenue;
  }
 
  processClaim(claim) {
    if (claim && claim.status === "filed") {
      claim.approve();
    }
 
    return claim ? claim.status : null;
  }
 
  calculateTotalCoverage() {
    let total = 0;
 
    for (const policy of this.policies) {
      if (policy.status !== "closed") {
        total += policy.coverageAmount;
      }
    }
 
    return total;
  }
 
  // Missing function implemented
  findCustomer(customerId) {
    const customer = this.customers.find(
      customer => customer.id === customerId
    );
 
    return customer || null;
  }
}
 
// Test data
 
const company = new InsuranceCompany("SecureCo");
const customer = new Customer(1, "Bob");
 
assert.strictEqual(company.registerCustomer(customer), 1);
 
const policy1 = new Policy(101, 1, 10000);
const policy2 = new Policy(102, 1, 5000);
 
assert.strictEqual(company.issuePolicy(policy1), 1);
assert.strictEqual(company.issuePolicy(policy2), 2);
 
assert.strictEqual(customer.buyPolicy(policy1), 1);
assert.strictEqual(customer.buyPolicy(policy2), 2);
assert.strictEqual(customer.getActivePolicies(), 2);
 
const premium1 = policy1.calculatePremium(0.1);
const premium2 = policy2.calculatePremium(0.2);
 
assert.strictEqual(premium1, 1000);
assert.strictEqual(premium2, 1000);
 
assert.strictEqual(
  customer.payPremium(policy1, premium1),
  1000
);
assert.strictEqual(
  customer.payPremium(policy2, premium2),
  1000
);
 
assert.strictEqual(company.collectPremium(premium1), 1000);
assert.strictEqual(company.collectPremium(premium2), 2000);
 
assert.strictEqual(customer.getTotalCoverage(), 15000);
assert.strictEqual(company.calculateTotalCoverage(), 15000);
 
assert.strictEqual(policy1.addCoverage(2000), 12000);
assert.strictEqual(policy1.reduceCoverage(1000), 11000);
 
const claim1 = new Claim(201, 1, 3000);
const claim2 = new Claim(202, 1, 2000);
 
assert.strictEqual(customer.fileClaim(claim1), 1);
assert.strictEqual(customer.fileClaim(claim2), 2);
 
assert.strictEqual(
  customer.linkClaimToPolicy(claim1, policy1),
  1
);
assert.strictEqual(
  customer.linkClaimToPolicy(claim2, policy1),
  2
);
 
assert.strictEqual(
  company.processClaim(claim1),
  "approved"
);
assert.strictEqual(
  company.processClaim(claim2),
  "approved"
);
 
assert.strictEqual(claim1.assess(0.1), 2700);
assert.strictEqual(claim2.assess(0.2), 1600);
 
assert.strictEqual(claim1.payOut(), "paid");
assert.strictEqual(claim2.payOut(), "paid");
 
assert.strictEqual(claim1.getOutstanding(), 0);
assert.strictEqual(claim2.getOutstanding(), 0);
 
const summary = policy1.getClaimSummary();
 
assert.strictEqual(summary.paid, 2);
 
assert.strictEqual(policy2.closePolicy(), "closed");
assert.strictEqual(customer.getActivePolicies(), 1);
 
assert.strictEqual(company.findCustomer(1).name, "Bob");
assert.strictEqual(company.findCustomer(2), null);
 
assert.strictEqual(policy1.paidPremium, 1000);
assert.strictEqual(policy2.paidPremium, 1000);
 
assert.strictEqual(policy1.status, "active");
assert.strictEqual(policy2.status, "closed");
 
assert.strictEqual(company.revenue, 2000);
assert.strictEqual(policy1.claims.length, 2);
 
assert.strictEqual(claim1.updateAmount(3500), 3500);
assert.strictEqual(claim1.amount, 3500);
 
assert.strictEqual(policy1.number, 101);
assert.strictEqual(customer.policies.length, 2);
assert.strictEqual(customer.claims.length, 2);
 
assert.strictEqual(policy1.customerId, 1);
assert.strictEqual(claim1.customerId, 1);
assert.strictEqual(company.customers.length, 1);
assert.strictEqual(company.policies.length, 2);
 
console.log("All tests passed successfully");
