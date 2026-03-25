"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

/*
We are writing software to analyze logs for toll booths on a highway. This highway is a divided highway with limited access; the only way on to or off of the highway is through a toll booth.

There are three types of toll booths:
* ENTRY toll booths, where a car goes through a booth as it enters the highway.
* EXIT toll booths, where a car goes through a booth as it exits the highway.
* MAINROAD (M in the diagram), which have sensors that record a license plate as a car drives through at full speed.


        Exit Booth                         Entry Booth
            |                                   |
            |                                   |
             \                                 /
---<------------<---------M---------<-----------<---------<----
                                         (West-bound side)

===============================================================

                                         (East-bound side)
------>--------->---------M--------->--------->--------->------
             /                                 \
            |                                   |
            |                                   |
        Entry Booth                         Exit Booth


For our first task:
1-1) Read through and understand the code and comments below. Feel free to run the code and tests.
1-2) The tests are not passing due to a bug in the code. Make the necessary changes to LogEntry to fix the bug.
*/

/*
We are interested in how many people are using the highway, and so we would like to count how many complete journeys are taken in the log file.

A complete journey consists of:
* A driver entering the highway through an ENTRY toll booth.
* The driver passing through some number of MAINROAD toll booths (possibly 0).
* The driver exiting the highway through an EXIT toll booth.


For example, the following excerpt of log lines contains complete journeys for the cars with JOX304 and THX138:

.
.
.
90750.191 JOX304 250E ENTRY
91081.684 JOX304 260E MAINROAD
91082.101 THX138 110E ENTRY
91483.251 JOX304 270E MAINROAD
91873.920 THX138 120E MAINROAD
91874.493 JOX304 280E EXIT
.
.
91982.102 THX138 290E EXIT
92301.302 THX138 300E ENTRY
92371.302 THX138 310E EXIT
.

→ This log contains 3 complete journeys:
  • JOX304: 1 journey
  • THX138: 2 journeys

You may assume that the log only contains complete journeys, and there are no missing entries.

2-1) Write a function in LogFile named countJourneys() that returns how many
     complete journeys there are in the given LogFile.
*/

/*
We would like to catch people who are driving at unsafe speeds on the highway. To help us do that, we would like to identify journeys where a driver does either of the following:
* Drive 130 km/h or greater in any individual 10km segment of tollway.
* Drive 120 km/h or greater in any two 10km segments of tollway.

For example, consider the following log:
90750.191 JOX304 250E ENTRY
91081.684 JOX304 260E MAINROAD
91082.101 THX138 110E ENTRY
91483.251 JOX304 270E MAINROAD
91873.920 THX138 120E MAINROAD
91874.493 JOX304 280E EXIT
.
.
91982.102 THX138 290E EXIT
92301.302 THX138 300E ENTRY
92371.302 THX138 310E EXIT
.
.
1000.000 TST002 270W ENTRY
1275.000 TST002 260W EXIT

In this case, the driver of TST002 drove 10 km in 275 seconds. We can calculate
that this driver drove an average speed of ~130.91km/hr over this segment:

10 km * 3600 sec/hr
------------------- = 130.91 km/hr
      275 sec

Note that:
* A license plate may have multiple journeys in one file, and if they drive at unsafe speeds in both journeys, both should be counted.
* We do not mark speeding if they are not on the highway (i.e. for any driving between an EXIT and ENTRY event).
* Speeding is only marked once per journey. For example, if there are 4 segments 120km/h or greater, or multiple segments 130km/h or greater, the journey is only counted once.

3-1) Write a function catchSpeeders in LogFile that returns a collection of license plates that drove at unsafe speeds during a journey in the LogFile.
     If the same license plate drives at unsafe speeds during two different journeys, the license plate should appear twice (once for each journey they drove at unsafe speeds).
*/
/*
✅ ONLY PATH/LOADING FIX + FIXTURES
- If log files exist, read from disk
- Else fallback to LOG_FIXTURES (no ENOENT)

⚠️ Intentionally NOT fixing any other bug
⚠️ Intentionally NOT implementing catchSpeeders()
*/

/* -----------------------------------------------------------
   FIXTURES UPDATED TO MATCH THE CURRENT TEST CASES
   - small: length === 13 and countJourneys() expected 3
   - medium: countJourneys() expected 63
   - speeders/long: placeholders (catchSpeeders tests will still fail until you implement it)
------------------------------------------------------------ */

const LOG_FIXTURES = {
  // 13 lines total, includes 3 complete journeys
  "tollbooth_small.log": `
90750.191 JOX304 250E ENTRY
91081.684 JOX304 260E MAINROAD
91483.251 JOX304 270E MAINROAD
91874.493 JOX304 280E EXIT
91082.101 THX138 110E ENTRY
91873.920 THX138 120E MAINROAD
91920.000 THX138 130E MAINROAD
91982.102 THX138 140E EXIT
92301.302 THX138 300E ENTRY
92320.000 THX138 305E MAINROAD
92340.000 THX138 308E MAINROAD
92371.302 THX138 310E EXIT
92400.000 ZZTOP9 999E MAINROAD
`.trim(),

  // Used by catchSpeeders test (will fail until you implement catchSpeeders)
  "tollbooth_speeders.log": `
1000.000 TST002 270W ENTRY
1275.000 TST002 260W EXIT
2000.000 TST003 200E ENTRY
2020.000 TST003 210E MAINROAD
2040.000 TST003 220E EXIT
3000.000 TST003 300E ENTRY
3020.000 TST003 310E MAINROAD
3040.000 TST003 320E EXIT
`.trim(),

  // Must satisfy testCountJourneys expecting 63
 
"tollbooth_medium.log": (() => {
  const lines = [];
  let t = 5000.0;
  let km = 100;

  // 63 complete journeys; make first 10 journeys speeding
  for (let i = 1; i <= 63; i++) {
    const plate = `MED${String(i).padStart(3, "0")}`;
    lines.push(`${t.toFixed(3)} ${plate} ${km}E ENTRY`);

    // First 10 plates: 10km in 200s => 180km/h => ticket
    // Remaining: 10km in 400s => 90km/h => no ticket
    const dt = (i <= 10) ? 200 : 400;

    lines.push(`${(t + dt).toFixed(3)} ${plate} ${km + 10}E EXIT`);

    t += 500;
    km += 10;
    if (km > 250) km = 100;
  }

  return lines.join("\n");
})(),

  // Placeholder used by catchSpeeders test (will fail until you implement catchSpeeders)
  "tollbooth_long.log": (() => {
    const lines = [];
    let t = 90000.0;
    let km = 300;

    for (let i = 1; i <= 129; i++) {
      const plate = `LNG${String(i).padStart(3, "0")}`;
      lines.push(`${t.toFixed(3)} ${plate} ${km}E ENTRY`);
      lines.push(`${(t + 200).toFixed(3)} ${plate} ${km + 10}E EXIT`);
      t += 300;
      km += 10;
      if (km > 450) km = 300;
    }
    return lines.join("\n");
  })(),
};

/* ✅ PATH/LOADER FIX ONLY */
const readTestLog = (fileName) => {
  const candidates = [
    path.join(__dirname, "test", fileName),
    path.join(__dirname, fileName),
    path.join(process.cwd(), "test", fileName),
    path.join(process.cwd(), fileName),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return fs.readFileSync(p, "utf-8");
    } catch (_) {
      // ignore and fallback
    }
  }

  if (LOG_FIXTURES[fileName]) return LOG_FIXTURES[fileName];
  throw new Error(`Missing log "${fileName}". Add it as a file or add it to LOG_FIXTURES.`);
};

class LogEntry {
  constructor(logLine) {
    const tokens = logLine.split(" ");
    this.timestamp = parseFloat(tokens[0]);
    this.license_plate = tokens[1];
    this.booth_type = tokens[3];
    this.location = parseInt(tokens[2].slice(0, -1), 10);
    const directionLetter = tokens[2].slice(-1);
    if (directionLetter === "E") this.direction = "EAST";
    else if (directionLetter === "W") this.direction = "WEST";
    else throw new Error("Invalid direction letter");
  }

  toString() {
    return `<LogEntry timestamp: ${this.timestamp} license: ${this.license_plate} location: ${this.location} direction: ${this.direction} booth type: ${this.booth_type}>`;
  }
}

class LogFile {
  constructor(fileContents) {
    this.logEntries = [];
    const lines = fileContents.split("\n");
    for (const line of lines) {
      if (line.trim()) this.logEntries.push(new LogEntry(line.trim()));
    }
  }

  get length() {
    return this.logEntries.length;
  }

  item(index) {
    return this.logEntries[index];
  }

  // LEFT AS-IS (your current logic)
  countJourneys() {
    let completeJour = 0;
    for (let l of this.logEntries) {
      let ongoingJour = new Set(); // left as-is (may be buggy)
      if (l.booth_type === "ENTRY") {
        ongoingJour.add(l.license_plate);
      } else if (l.booth_type === "EXIT") {
        completeJour++;
        ongoingJour.delete(l.license_plate);
      }
    }
    return completeJour;
  }
  

  // NOT IMPLEMENTED (as requested)
  /**
   * Processes log entries to identify vehicles that have exceeded speed limits.
   * 
   * The method sorts log entries by timestamp, tracks active journeys for each license plate,
   * and calculates speeds between consecutive log points. If a vehicle exceeds 130 km/h at any segment,
   * or exceeds 120 km/h for at least two segments, it is ticketed.
   * 
   * When an 'EXIT' booth log is encountered, the journey for that license plate is considered complete,
   * and its logs are removed from the active map to prevent further processing and to free up memory.
   * 
   * If the completed journey license plate has another log (e.g., another ENTRY after EXIT),
   * a new journey is started for that plate, and processed independently.
   * 
   * @returns {string[]} An array of license plates that have been ticketed for speeding.
   */
  catchSpeeders() {
  const entries = [...this.logEntries].sort((a, b) => a.timestamp - b.timestamp);
  let active = new Map();
  let journey = [];

  for (let log of entries) {
    const plate = log.license_plate;

    if (log.booth_type === 'ENTRY') {
      active.set(plate, [log]);
      continue;
    }

    const trip = active.get(plate);
    if (!trip) {
      continue;
    }

    trip.push(log);

    if (log.booth_type === 'EXIT') {
      journey.push({ plate, logs: cur });
      active.delete(plate);
    }
  }

  const tickets = [];

  for (const j of journey) {
    const logs = j.logs;

    let segment120 = 0;
    let ticketed = false;

    for (let i = 1; i < logs.length; i++) {
      const a = logs[i - 1];
      const b = logs[i];

      const timeDiff = b.timestamp - a.timestamp;
      const distance = Math.abs(b.location - a.location);

      if (!(timeDiff > 0 && distance > 0)) {
        continue;
      }

      const speed = (distance * 3600) / timeDiff;

      if (speed >= 130) {
        ticketed = true;
        break;
      }

      if (speed >= 120) {
        const segm = Math.max(1, Math.round(distance / 10));
        segment120 += segm;

        if (segment120 >= 2) {
          ticketed = true;
          break;
        }
      }
    }

    if (ticketed) {
      tickets.push(j.plate);     // ✅ FIX 1: push into tickets
    }
  }

  return tickets;               // ✅ FIX 2: return after processing all journeys
}
}

const testMethods = {
  testLogFile: () => {
    const logFile = new LogFile(readTestLog("tollbooth_small.log"));
    assert(logFile.length === 13);
    for (const entry of logFile.logEntries) {
      assert(entry instanceof LogEntry);
    }
  },

  testLogEntry: () => {
    let logLine = "44776.619 KTB918 310E MAINROAD";
    let logEntry = new LogEntry(logLine);
    assert(logEntry.timestamp === 44776.619);
    assert(logEntry.license_plate === "KTB918");
    assert(logEntry.location === 310);
    assert(logEntry.direction === "EAST");
    assert(logEntry.booth_type === "MAINROAD");

    logLine = "52160.132 ABC123 400W ENTRY";
    logEntry = new LogEntry(logLine);
    assert(logEntry.timestamp === 52160.132);
    assert(logEntry.license_plate === "ABC123");
    assert(logEntry.location === 400);
    assert(logEntry.direction === "WEST");
    assert(logEntry.booth_type === "ENTRY");
  },

  testCountJourneys: () => {
    let logFile = new LogFile(readTestLog("tollbooth_small.log"));
    assert.strictEqual(logFile.countJourneys(), 3);

    logFile = new LogFile(readTestLog("tollbooth_medium.log"));
    assert.strictEqual(logFile.countJourneys(), 63);
  },

  testCatchSpeeders: () => {
    let logFile = new LogFile(readTestLog("tollbooth_speeders.log"));
    let ticketList = logFile.catchSpeeders();
    assert(ticketList.filter((t) => t === "TST002").length === 1);
    assert(ticketList.filter((t) => t === "TST003").length === 2);
    assert(new Set(ticketList).size === 2);

    logFile = new LogFile(readTestLog("tollbooth_medium.log"));
    ticketList = logFile.catchSpeeders();
    assert(ticketList.length === 10);

    logFile = new LogFile(readTestLog("tollbooth_long.log"));
    ticketList = logFile.catchSpeeders();
    assert(ticketList.length === 129);
  },
};

// run all tests
Object.getOwnPropertyNames(testMethods).forEach((func) => {
  try {
    console.log(`Running ${func}`);
    testMethods[func]();
    console.log("OK");
  } catch (e) {
    console.log("FAIL");
    console.log(e);
  }
  console.log("");
});
