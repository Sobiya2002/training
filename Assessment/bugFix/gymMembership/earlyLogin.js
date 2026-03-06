"use strict";
const assert = require("assert");

/*
Each line:
<timestamp> <userId> LOGIN

Task:
Return an object:
{
  userId: firstLoginTimestamp
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
 
getFirstLoginPerUser() {
  const firstLogin = new Map();

  for (const log of this.entries) {
    const [tsStr, userId, action] = log.split(' ');
    const ts = Number(tsStr);

    if (action !== 'LOGIN') continue;

    if (!firstLogin.has(userId) || ts > firstLogin.get(userId)) {
      firstLogin.set(userId, ts);
    }
  }

  return Object.fromEntries(firstLogin);
}

}

/* -------- TESTS -------- */
const log = `
5.0 U1 LOGIN
1.0 U2 LOGIN
3.0 U1 LOGIN
2.0 U3 LOGIN
`;

const lf = new LogFile(log);

assert.deepStrictEqual(lf.getFirstLoginPerUser(), {
  U1: 5.0,
  U2: 1.0,
  U3: 2.0
});

console.log("Beginner Q5 passed ✅");