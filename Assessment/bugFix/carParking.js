"use strict";
const assert = require("assert");

/*
Parking garage sensors produce logs.

Each log line:
<timestamp> <plate> <gateId> <eventType>

eventType is one of:
- ENTRY: car enters garage
- EXIT: car exits garage
- SCAN: camera scan inside garage (optional, can occur any time)

A "complete parking session" is:
ENTRY ... (optional SCANs) ... EXIT for the same plate.

Implement:
LogFile.countParkingSessions()
Return total number of complete sessions in the log.

Notes:
- Logs are ordered by timestamp.
- A plate can have multiple sessions.
- SCAN lines outside a session should be ignored.
*/

class LogEntry {
  constructor(line) {
    const tokens = line.trim().split(/\s+/);
    this.timestamp = Number(tokens[0]);     
    this.plate = tokens[1];
    this.gateId = tokens[2];
    this.eventType = tokens[3];
  }
}

class LogFile {
  constructor(contents) {
    this.entries = contents
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean)
      .map(line => new LogEntry(line));
  }

  // TODO: implement
  countParkingSessions() {
  const activePlates = new Set();
  let count = 0;

  for (const entry of this.entries) {
    if (entry.eventType === 'ENTRY') {
      activePlates.add(entry.plate);
    } else if (entry.eventType === 'EXIT' && activePlates.has(entry.plate)) {
      count++;
      // activePlates.delete(entry.plate);
      console.log(activePlates);
    }
    // SCAN is ignored automatically
  }

  return count;
}
}

/* ---------------- TESTS ---------------- */
const smallLog = `
100.0 KA01AA1111 G1 ENTRY
101.0 KA01AA1111 C1 SCAN
105.0 KA01AA1111 G2 EXIT
110.0 KA02BB2222 G1 ENTRY
111.0 KA02BB2222 C2 SCAN
112.0 KA03CC3333 C9 SCAN
120.0 KA02BB2222 G2 EXIT
130.0 KA01AA1111 G1 ENTRY
131.0 KA01AA1111 G2 EXIT
`;

const mediumLog = `
1.0 P1 G1 ENTRY
2.0 P1 C1 SCAN
3.0 P2 C9 SCAN
4.0 P2 G1 ENTRY
5.0 P1 G2 EXIT
6.0 P2 G2 EXIT
7.0 P1 G1 ENTRY
8.0 P1 C2 SCAN
9.0 P1 C3 SCAN
10.0 P1 G2 EXIT
11.0 P3 G1 ENTRY
12.0 P3 G2 EXIT
`;

(function run() {
  const lf1 = new LogFile(smallLog);
  // Fix parsing so timestamp becomes a number:
  assert.strictEqual(typeof lf1.entries[0].timestamp, "number");
  assert.strictEqual(lf1.countParkingSessions(), 3);

  const lf2 = new LogFile(mediumLog);
  // console.log(lf2);
  assert.strictEqual(lf2.countParkingSessions(), 4);

  console.log("Question 1 passed ✅");
})();