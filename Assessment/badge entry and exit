/*
We are working on a security system for a badged-access room in our company's building.

Given an ordered list of employees who used their badge to enter or exit the room, write a function that returns two collections:

1. All employees who didn't use their badge while exiting the room - they recorded an enter without a matching exit. (All employees are required to leave the room before the log ends.)

2. All employees who didn't use their badge while entering the room - they recorded an exit without a matching enter. (The room is empty when the log begins.)

Each collection should contain no duplicates, regardless of how many times a given employee matches the criteria for belonging to it.

records1 = [
  ["Paul",     "enter"],
  ["Pauline",  "exit"],
  ["Paul",     "enter"],
  ["Paul",     "exit"],
  ["Martha",   "exit"],
  ["Joe",      "enter"],
  ["Martha",   "enter"],
  ["Steve",    "enter"],
  ["Martha",   "exit"],
  ["Jennifer", "enter"],
  ["Joe",      "enter"],
  ["Curtis",   "exit"],
  ["Curtis",   "enter"],
  ["Joe",      "exit"],
  ["Martha",   "enter"],
  ["Martha",   "exit"],
  ["Jennifer", "exit"],
  ["Joe",      "enter"],
  ["Joe",      "enter"],
  ["Martha",   "exit"],
  ["Joe",      "exit"],
  ["Joe",      "exit"] 
]

Expected output: ["Steve", "Curtis", "Paul", "Joe"], ["Martha", "Pauline", "Curtis", "Joe"]

Other test cases:

records2 = [
  ["Paul", "enter"],
  ["Paul", "exit"],
]

Expected output: [], []

records3 = [
  ["Paul", "enter"],
  ["Paul", "enter"],
  ["Paul", "exit"],
  ["Paul", "exit"],
]

Expected output: ["Paul"], ["Paul"]

records4 = [
  ["Raj", "enter"],
  ["Paul", "enter"],
  ["Paul", "exit"],
  ["Paul", "exit"],
  ["Paul", "enter"],
  ["Raj", "enter"],
]

Expected output: ["Raj", "Paul"], ["Paul"]

All Test Cases:
mismatches(records1) => ["Steve", "Curtis", "Paul", "Joe"], ["Martha", "Pauline", "Curtis", "Joe"]
mismatches(records2) => [], []
mismatches(records3) => ["Paul"], ["Paul"]
mismatches(records4) => ["Raj", "Paul"], ["Paul"]

n: length of the badge records array
*/

"use strict";

const records1 = [
  ["Paul", "enter"],
  ["Pauline", "exit"],
  ["Paul", "enter"],
  ["Paul", "exit"],
  ["Martha", "exit"],
  ["Joe", "enter"],
  ["Martha", "enter"],
  ["Steve", "enter"],
  ["Martha", "exit"],
  ["Jennifer", "enter"],
  ["Joe", "enter"],
  ["Curtis", "exit"],
  ["Curtis", "enter"],
  ["Joe", "exit"],
  ["Martha", "enter"],
  ["Martha", "exit"],
  ["Jennifer", "exit"],
  ["Joe", "enter"],
  ["Joe", "enter"],
  ["Martha", "exit"],
  ["Joe", "exit"],
  ["Joe", "exit"]
];

const records2 = [
  ["Paul", "enter"],
  ["Paul", "exit"]
];

const records3 = [
  ["Paul", "enter"],
  ["Paul", "enter"],
  ["Paul", "exit"],
  ["Paul", "exit"]
];

const records4 = [
  ["Raj", "enter"],
  ["Paul", "enter"],
  ["Paul", "exit"],
  ["Paul", "exit"],
  ["Paul", "enter"],
  ["Raj", "enter"]
];

const mismatch = (records) => {
    const inside = new Set();
    const exitedWihtoutEntry = new Set();
    const entredWithoutExit = new Set();

    for (const [name, action ] of records){
        if(action === 'enter'){
            if(inside.has(name)){
                entredWithoutExit.add(name)
            }
            inside.add(name);
        }
        else{
            if(!inside.has(name)){
                exitedWihtoutEntry.add(name);
            }
            else{
                inside.delete(name);
            }
            
        }
    }

    for(const name of inside){
        exitedWihtoutEntry.add(name)
    }

    return [
        [...entredWithoutExit],
        [...exitedWihtoutEntry]
    ]
}

console.log(mismatch(records1));
console.log(mismatch(records2));
console.log(mismatch(records3));
console.log(mismatch(records4));


I need to identify two groups of employees:

Employees who have an enter event that is not properly matched by an exit.
Employees who have an exit event that is not properly matched by an enter.


"A few edge cases I notice:

If someone exits without being inside the room, they belong to the second collection.
If someone enters while already inside, that indicates a missing exit and they belong to the first collection.
If someone is still inside when we finish processing the log, they also belong to the first collection.
The same employee may appear in both collections if both kinds of violations occur."

"Even when I detect a violation, I still update the room state.
The violation set records that an error occurred, while the inside set tracks who is currently considered to be in the room. 
Those are two separate responsibilities."


