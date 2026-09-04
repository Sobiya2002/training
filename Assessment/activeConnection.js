/*
You are analyzing data for Aquaintly, a hot new social network.

On Aquaintly, connections are always symmetrical. If a user Alice is connected to Bob, 
then Bob is also connected to Alice.

You are given a sequential log of CONNECT and DISCONNECT events of the following form:
- This event connects users Alice and Bob: ["CONNECT", "Alice", "Bob"]
- This event disconnects the same users: ["DISCONNECT", "Bob", "Alice"] 
(order of users does not matter)

We want to separate users based on their popularity (number of connections). 
To do this, write a function that takes in the event log and a number N and 
returns two collections:
[Users with fewer than N connections], [Users with N or more connections]

Example:
events = [
    ["CONNECT","Alice","Bob"],
    ["DISCONNECT","Bob","Alice"],
    ["CONNECT","Alice","Charlie"],
    ["CONNECT","Dennis","Bob"],
    ["CONNECT","Pam","Dennis"],
    ["DISCONNECT","Pam","Dennis"],
    ["CONNECT","Pam","Dennis"],
    ["CONNECT","Edward","Bob"],
    ["CONNECT","Dennis","Charlie"],
    ["CONNECT","Alice","Nicole"],
    ["CONNECT","Pam","Edward"],
    ["DISCONNECT","Dennis","Charlie"],
    ["CONNECT","Dennis","Edward"],
    ["CONNECT","Charlie","Bob"]
]

Using a target of 3 connections, the expected results are:
Users with less than 3 connections: ["Alice", "Charlie", "Pam", "Nicole"]
Users with 3 or more connections: ["Dennis", "Bob", "Edward"]

All test cases:
grouping(events, 3) => [["Alice", "Charlie", "Pam", "Nicole"], ["Dennis", "Bob", "Edward"]]
grouping(events, 1) => [[], ["Alice", "Charlie", "Dennis", "Bob", "Pam", "Edward", "Nicole"]]
grouping(events, 10) => [["Alice", "Charlie", "Dennis", "Bob", "Pam", "Edward", "Nicole"], []]
Complexity Variable:
E = number of events */






We process the event log and maintain a graph using a Map<User, Set<Connections>>. 
  For a CONNECT event, we add both users to each other's sets since connections are bidirectional. 
  For a DISCONNECT event, we remove both users from each other's sets. After all events are processed, 
  the size of each user's set gives their current number of active connections. We then separate users into two groups based on whether their connection count is less than N or at least N.



events = [
    ["CONNECT","Alice","Bob"],
    ["DISCONNECT","Bob","Alice"],
    ["CONNECT","Alice","Charlie"],
    ["CONNECT","Dennis","Bob"],
    ["CONNECT","Pam","Dennis"],
    ["DISCONNECT","Pam","Dennis"],
    ["CONNECT","Pam","Dennis"],
    ["CONNECT","Edward","Bob"],
    ["CONNECT","Dennis","Charlie"],
    ["CONNECT","Alice","Nicole"],
    ["CONNECT","Pam","Edward"],
    ["DISCONNECT","Dennis","Charlie"],
    ["CONNECT","Dennis","Edward"],
    ["CONNECT","Charlie","Bob"]
]


const map = new Map();

function grouping(events, n) {
    for (let [status, p1, p2] of events) {
        if (status === "CONNECT") {
            addConnection(p1, p2);
        } else {
            removeConnection(p1, p2);
        }
    }

    const lessThanN = [];
    const atLeastN = [];

    for (let [person, connections] of map.entries()) {
        if (connections.size < n) {
            lessThanN.push(person);
        } else {
            atLeastN.push(person);
        }
    }

    return [
        lessThanN,
        atLeastN
        ];
}

function addConnection(p1, p2) {
    if (!map.has(p1)) {
        map.set(p1, new Set());
    }
    map.get(p1).add(p2);

    if (!map.has(p2)) {
        map.set(p2, new Set());
    }
    map.get(p2).add(p1);
}

function removeConnection(p1, p2) {
    const set1 = map.get(p1);
    if (set1) {
        set1.delete(p2);
    }

    const set2 = map.get(p2);
    if (set2) {
        set2.delete(p1);
    }
}

console.log(grouping(events, 10));
