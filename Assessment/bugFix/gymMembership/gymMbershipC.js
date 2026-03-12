"use strict";
/*
We are building a program to manage a gym's membership. The gym has multiple members, each with a unique ID, name, and membership status. The program allows gym staff to add new members, update members status, and get membership statistics.

Definitions:
* A "member" is an object that represents a gym member. It has properties for the ID, name, and membership status.
* A "membership" is a class which is used for managing members in the gym.

To begin with, we present you with two tasks:
1-1) Read through and understand the code below. Please take as much time as necessary, and feel free to run the code.
1-2) The test for Membership is not passing due to a bug in the code. Make the necessary changes to Membership to fix the bug.
*/

/*
We are currently updating our system to include information about workouts for our members. As part of this update, we have introduced the Workout class, which represents a single workout session for a member. Each object of the Workout class has a unique ID, as well as a start time and end time that are represented in the number of minutes spent from the start of the day. You can assume that all the Workouts are from the same day.

To implement these changes, we need to add two functions to the Membership class:

2.1) The `addWorkout` function should be used to add a workout session for a member. If the given member does not exist while calling this function, the workout can be ignored.

2.2) The `getAverageWorkoutDurations` function should calculate the average duration of workouts for each member in minutes and return the results as a map.

To assist you in testing these new functions, we have provided the testGetAverageWorkoutDurations function.
*/

/*
We are developing a payment calculation system for our members. The payment amount is determined as follows:

- For members with BRONZE Membership:
  - The first workout is free.
  - From the second workout onwards, each hour costs $10.

- For members with SILVER Membership:
  - The first three workouts are free.
  - From the fourth workout onwards, each hour costs $8.

- For members with GOLD Membership:
  - The first five workouts are free.
  - From the sixth workout onwards, each hour costs $6.

The workouts are ordered by their ID. 
The duration of each workout is always rounded up to the nearest hour. For example, if a person spent 80 minutes in a workout, they would be charged for 2 hours.

3) Implement a `getDuePayments` function, which returns a dictionary associating each member ID with their due payment.

To help you understand the requirements and test this new function, we have provided the `testGetDuePayments` function.
*/
const assert = require("assert");

class MembershipStatus {
  /*
  Membership Status is of three types: BRONZE, SILVER and GOLD.
  BRONZE is the default membership a new member gets.
  SILVER and GOLD are paid memberships for the gym.
  */
  static BRONZE = 1;
  static SILVER = 2;
  static GOLD = 3;
}

class Workout {
  /*
  This class represents a single workout session for a member.
  Each object of the Workout class has a unique ID, as well as 
  a start time and end time that are represented in the number 
  of minutes spent from the start of the day.
  */
  constructor(id, startTime, endTime) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  getDuration() {
    return this.endTime - this.startTime;
  }
}

class Member {
  /* Data about a gym member. */
    constructor(memberId, name, membershipStatus) {
    this.memberId = memberId;
    this.name = name;
    this.membershipStatus = membershipStatus;
  }

  isEqual(other) {
    if (!(other instanceof Member)) {
      return false;
    }
    return (
      this.memberId === other.memberId &&
      this.name === other.name &&
      this.membershipStatus === other.membershipStatus
    );
  }

  toString() {
    return `Member ID: ${this.memberId}, Name: ${this.name}, Membership Status: ${this.membershipStatus}`;
  }
}

class Membership {
  /*
  Data for managing a gym membership, and methods which staff can
  use to perform any queries or updates.
  */
    constructor() {
    this.members = [];
  }

  addMember(member) {
    /* Adds a member to the gym */
    this.members.push(member);
  }

  updateMembership(memberId, membershipStatus) {
    /* Update membership of the given member */
    for (const member of this.members) {
      if (member.memberId === memberId) {
        member.membershipStatus = membershipStatus;
        break;
      }
    }
  }
  
  getMembershipStatistics() {
    /* Calculates and returns membership statistics for all members */
    const totalMembers = this.members.length;
    const totalPaidMembers = this.members.filter(
      (member) =>
        (member.membershipStatus === MembershipStatus.GOLD )|| (member.membershipStatus === MembershipStatus.SILVER )
    ).length;
    const conversionRate = (totalPaidMembers / totalMembers) * 100;

    return {
      totalMembers,
      totalPaidMembers,
      conversionRate,
    };
  }
  addWorkout(memberId, workout){
    const mem=this.members.find((m)=>{
      return m.memberId==memberId
    });
    if(!mem){
      return;
    }
    if(!mem.workouts){
      mem.workouts=[];
    }
    mem.workouts.push(workout);
  }
  getAverageWorkoutDurations(){
    
    let res=new Map();
    for(let m of this.members){
      if(!m.workouts){
        continue;
      }
      let duration=0;
      for(let w of m.workouts){
        duration+=w.getDuration();
      }
      res.set(m.memberId, duration/m.workouts.length);
    }
    return res;
    
  }
  
  
// getDuePayments() {
//   const duePayments = {};
//   const rules = {
//     [MembershipStatus.BRONZE]: { free: 1, rate: 10 },
//     [MembershipStatus.SILVER]: { free: 3, rate: 8 },
//     [MembershipStatus.GOLD]:   { free: 5, rate: 6 }
//   };

//   for (const member of this.members) {
//     const workouts = member.workouts || [];

//     if (workouts.length === 0) {
//       duePayments[member.memberId] = 0;
//       continue;
//     }

    
//     const sortedWorkouts = workouts.slice().sort((a, b) => a.id - b.id);

//     const { free, rate } = rules[member.membershipStatus];

//     let total = 0;

    
//     for (let i = free; i < sortedWorkouts.length; i++) {
//       const workout = sortedWorkouts[i];
//       const minutes = workout.endTime - workout.startTime;
//       const hours = Math.ceil(minutes / 60); 
//       total += hours * rate;
//     }
//     duePayments[member.memberId] = total;
//   }

//   return duePayments;
// }

getDuePayments() {
 const duePayments = {};

 const rules = {
  [MembershipStatus.BRONZE]: {free: 1, rate: 10},
  [MembershipStatus.SILVER]: {free: 3, rate: 8},
  [MembershipStatus.GOLD]: {free: 5, rate: 6}
  };

  for ( const member of this.members) {
    const workout = member.workouts || [];

    if ( workout.length === 0) {
      duePayments [member.memberId] = 0;
      continue;
    }

    const sortedWorkouts = workout.sort((a, b) => a.id - b.id);

    const {free, rate} = rules [member.membershipStatus];

    let total = 0;

    for (let i = free; i < sortedWorkouts.length; i++){
      console.log('i', i);
      const workout = sortedWorkouts[i];
      const minutes = workout.endTime - workout.startTime;
      const hours = Math.ceil(minutes/60);
      total += hours * rate;
    }
    duePayments[member.memberId] = total;
    console.log('duePayments', duePayments);
  }
  return duePayments;
 }
};

const testMethods = {
    testMember: () => {
    const testMember = new Member(1, "John Doe", MembershipStatus.BRONZE);
    assert.strictEqual(testMember.memberId, 1);
    assert.strictEqual(testMember.name, "John Doe");
    assert.strictEqual(testMember.membershipStatus, MembershipStatus.BRONZE);
  },
  testMembership: () => {
    const testMembership = new Membership();
    const testMember = new Member(1, "John Doe", MembershipStatus.BRONZE);
    testMembership.addMember(testMember);
    assert.strictEqual(testMembership.members.length, 1);
    assert.ok(testMembership.members[0].isEqual(testMember));

    testMembership.updateMembership(1, MembershipStatus.SILVER);
    assert.strictEqual(
      testMembership.members[0].membershipStatus,
      MembershipStatus.SILVER
    );

    const testMember2 = new Member(2, "Alex C", MembershipStatus.BRONZE);
    testMembership.addMember(testMember2);

    const testMember3 = new Member(3, "Marie C", MembershipStatus.GOLD);
    testMembership.addMember(testMember3);

    const testMember4 = new Member(4, "Joe D", MembershipStatus.SILVER);
    testMembership.addMember(testMember4);

    const testMember5 = new Member(5, "June R", MembershipStatus.BRONZE);
    testMembership.addMember(testMember5);

    const attendanceStats = testMembership.getMembershipStatistics();
    assert.strictEqual(attendanceStats.totalMembers, 5);
    assert.strictEqual(attendanceStats.totalPaidMembers, 3);
    assert.ok(Math.abs(attendanceStats.conversionRate - 60.00) < 0.1);
  },
  
  testGetAverageWorkoutDurations() {
    const testMembership = new Membership();
    const testMember = new Member(12, "John Doe", MembershipStatus.SILVER);
    testMembership.addMember(testMember);

    const testMember2 = new Member(22, "Alex Cleeve", MembershipStatus.BRONZE);
    testMembership.addMember(testMember2);

    const testMember3 = new Member(31, "Marie Cardiff", MembershipStatus.GOLD);
    testMembership.addMember(testMember3);

    const testMember4 = new Member(37, "George Costanza", MembershipStatus.SILVER);
    testMembership.addMember(testMember4);

    const testWorkout1 = new Workout(11, 10, 20);
    const testWorkout2 = new Workout(24, 15, 35);
    const testWorkout3 = new Workout(32, 45, 90);
    const testWorkout4 = new Workout(47, 100, 155);
    const testWorkout5 = new Workout(56, 120, 200);
    const testWorkout6 = new Workout(62, 300, 400);
    const testWorkout7 = new Workout(78, 1000, 1010);
    const testWorkout8 = new Workout(80, 1010, 1045);

    testMembership.addWorkout(12, testWorkout1);
    testMembership.addWorkout(22, testWorkout2);
    testMembership.addWorkout(31, testWorkout3);
    testMembership.addWorkout(12, testWorkout4);
    testMembership.addWorkout(22, testWorkout5);
    testMembership.addWorkout(31, testWorkout6);
    testMembership.addWorkout(12, testWorkout7);
    testMembership.addWorkout(4, testWorkout8);

    const averageDurations = testMembership.getAverageWorkoutDurations();
    assert.ok(Math.abs(averageDurations.get(12) - 25.0) < 0.1);
    assert.ok(Math.abs(averageDurations.get(22) - 50.0) < 0.1);
    assert.ok(Math.abs(averageDurations.get(31) - 72.5) < 0.1);
    assert.ok(!averageDurations.has(4));
  },
  
  testGetDuePayments() {
    const testMembership = new Membership();
    testMembership.addMember(new Member(1, "John Doe", MembershipStatus.BRONZE));
    testMembership.addMember(new Member(2, "Alex C", MembershipStatus.SILVER));
    testMembership.addMember(new Member(3, "Marie C", MembershipStatus.GOLD));

    const memberWorkouts = {
      1: [
        new Workout(1, 500, 700),
        new Workout(10, 300, 350),
        new Workout(12, 10, 20),
        new Workout(3, 50, 90),
        new Workout(6, 130, 150),
        new Workout(15, 900, 920),
      ],
      2: [
        new Workout(13, 510, 540),
        new Workout(14, 600, 700),
        new Workout(2, 15, 35),
        new Workout(4, 100, 155),
        new Workout(18, 200, 225),
        new Workout(8, 1050, 1155),
      ],
      3: [
        new Workout(5, 120, 135),
        new Workout(17, 140, 190),
        new Workout(9, 210, 255),
        new Workout(11, 400, 450),
        new Workout(16, 910, 940),
        new Workout(7, 1000, 1100),
      ],
    };

    for (const memberIdStr in memberWorkouts) {
      const memberId = parseInt(memberIdStr);
      for (const workout of memberWorkouts[memberId]) {
        testMembership.addWorkout(memberId, workout);
      }
    }

    const duePayments = testMembership.getDuePayments();
    assert.ok(Math.abs(duePayments[1] - 50.0) < 0.1);
    assert.ok(Math.abs(duePayments[2] - 32.0) < 0.1);
    assert.ok(Math.abs(duePayments[3] - 6.0) < 0.1);

    // Test member with no workouts
    testMembership.addMember(new Member(4, "Ron Burgundy", MembershipStatus.SILVER));
    const duePayments2 = testMembership.getDuePayments();
    assert.ok(Math.abs(duePayments2[4] - 0.0) < 0.1);
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