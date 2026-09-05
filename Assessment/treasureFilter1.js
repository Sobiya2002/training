/*
/*
You are with your friends in a castle, where there are multiple rooms named after flowers.
Some of the rooms contain 
treasures - we call them the treasure rooms. 

Each room contains a single instruction that tells you which room to go to next.

*** instructions_1 and treasure_rooms_1 *** 

lily* ---------      daisy  sunflower
              |        |     |
              v        v     v
jasmin --> tulip*      violet* ----> rose* -->
           ^    |      ^             ^       |
           |    |      |             |       |
           ------    iris            ---------

* denotes a treasure room, e.g., rose is a treasure room, but jasmin isn't.

This is given as a list of pairs of (source_room, destination_room)

instructions_1 = [ 
    ["jasmin", "tulip"],
    ["lily", "tulip"], tulip 
    ["tulip", "tulip"], 
    ["rose", "rose"],
    ["violet", "rose"], 
    ["sunflower", "violet"],
    ["daisy", "violet"],
    ["iris", "violet"]
]

treasure_rooms_1 = ["lily", "tulip", "violet", "rose"]

Write a function that takes two parameters as input:
* a list of instructions represented as pairs of (source_room, destination_room), and
* a list containing the treasure rooms,

and returns a collection of all the rooms that satisfy the following two conditions:
* at least two *other* rooms have instructions pointing to this room
* this room's instruction immediately points to a treasure room 

filter_rooms(instructions_1, treasure_rooms_1) => ["tulip", "violet"]
* tulip can be accessed from rooms lily and jasmin. Tulip's instruction points to a treasure room (tulip itself)
* violet can be accessed from daisy, sunflower and iris. Violet's instruction points to a treasure room (rose)

Additional inputs

treasure_rooms_2 = ["lily", "jasmin", "violet"]  

filter_rooms(instructions_1, treasure_rooms_2) => []
* none of the rooms reachable from tulip or violet are treasure rooms

*** instructions_2 and treasure_rooms_3 *** 

lily ---------          --------
             |          |      |
             v          v      |
jasmin --> tulip ---> violet*--^  

instructions_2 = [ 
    ["jasmin", "tulip"],
    ["lily", "tulip"],
    ["tulip", "violet"],
    ["violet", "violet"]       
]

treasure_rooms_3 = ["violet"]

filter_rooms(instructions_2, treasure_rooms_3) => ["tulip"]
* tulip can be accessed from rooms lily and jasmin. Tulip's instruction points to a treasure room (violet)

All the test cases: 
filter_rooms(instructions_1, treasure_rooms_1)    => ["tulip", "violet"]
filter_rooms(instructions_1, treasure_rooms_2)    => [] 
filter_rooms(instructions_2, treasure_rooms_3)    => ["tulip"]

Complexity Analysis variables:
T: number of treasure rooms
I: number of instructions given
*/




// "I modeled the instructions as a directed graph. 
// I used one map to track the unique incoming rooms for each room and another map to track each room's outgoing destination.
//  Then I filtered the rooms by checking whether they receive connections from at least two different rooms 
//  and whether they point directly to a treasure room. Any room satisfying both conditions is added to the result."

instructions_1 = [  
    ["jasmin", "tulip"], 
    ["lily", "tulip"], 
    ["tulip", "tulip"],  
    ["rose", "rose"], 
    ["violet", "rose"],  
    ["sunflower", "violet"], 
    ["daisy", "violet"], 
    ["iris", "violet"] 
] 
treasure_rooms_1 = ["lily", "tulip", "violet", "rose"] 
instructions_2 = [  
    ["jasmin", "tulip"], 
    ["lily", "tulip"], 
    ["tulip", "violet"], 
    ["violet", "violet"]        
] 
treasure_rooms_2 = ["lily", "jasmin", "violet"]   
treasure_rooms_3 = ["violet"] 


const filterRooms = (instruction, treasure_rooms) => {
    const map = new Map();
    const nextMap = new Map();
    const treasure_rooms_set = new Set(treasure_rooms);

    for(let [f1,f2] of instruction) {
        if(!map.has(f2)){
            map.set(f2, new Set());
        }
        if(f1!=f2){
            map.get(f2).add(f1);
        }
        nextMap.set(f1,f2);
    }

    const result = [];

    for(let [f1,set1] of map){
        const count = set1.size;
        const nextRoom = nextMap.get(f1);
        if(count >=2 && treasure_rooms_set.has(nextRoom)){
            result.push(f1);
        }
    }
    return result;
}
console.log(filterRooms(instructions_1,treasure_rooms_1)); 
console.log(filterRooms(instructions_1, treasure_rooms_2)); 
console.log(filterRooms(instructions_2, treasure_rooms_3));  
