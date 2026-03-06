"use strict";
const assert = require("assert");

/*
Each line:
<timestamp> <serviceName> <level>

level is INFO or ERROR

Task:
Return an object:
{
  serviceName: errorCount
}
*/

class LogFile {
  constructor(lines) {
    this.entries = lines
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);
  }

  // TODO
  countErrorsByService() {
    console.log(this.entries);
    const errorCount = new Map();
    
    for (let log of this.entries){
      const [timestamp, serviceName, level] = log.split(' ');
      console.log(timestamp, serviceName, level);
      if (level === 'ERROR'){
        errorCount.set(serviceName, (errorCount.get(serviceName) || 0)+1);
      }
    }
    return Object.fromEntries(errorCount);
  }
}

/* -------- TESTS -------- */
const log = `
1.0 AUTH INFO
2.0 AUTH ERROR
3.0 PAYMENT ERROR
4.0 AUTH ERROR
5.0 PAYMENT INFO
`;

const lf = new LogFile(log);

assert.deepStrictEqual(lf.countErrorsByService(), {
  AUTH: 2,
  PAYMENT: 1
});

console.log("Beginner Q4 passed ✅");