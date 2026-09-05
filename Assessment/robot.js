we have a list of robot names and the parts as given below

allParts=
"Rosie_sensor",
"optimus_speaker",
"Rosie_horn",
"Ruby_antenna",
"victor_display",
"Rosie_speaker",
"Optimus_sensor",
"Ruby_sensor",
"Nova_claw",
"Optimus_display",
"Rosie_display",
"Ruby_claw",
"Optimus_claw",
"Victor_antenna"

required_parts1=[ "sensor","speaker","display","claw"]

required_parts2=["sensor","speaker","dispay"]

required_part3=["antenna","claw"]

return the robots that requires all the parts in required_parts.

get_robot_for_required_part_1=[optimus]

get_robot_for_required_part_2=[rosie,optimus]

get_robot_for_required_part_3=[Ruby]

I first group all parts by robot using a Map<String, Set>.
The Map stores each robot and its unique parts, while the Set gives fast lookups. 
After building the map, I iterate through every robot and use every() to verify that all required parts exist in that robot's Set.
If all checks pass, I add the robot name to the result




const allParts = [
  "Rosie_sensor",
  "Optimus_speaker",
  "Rosie_horn",
  "Ruby_antenna",
  "Victor_display",
  "Rosie_speaker",
  "Optimus_sensor",
  "Ruby_sensor",
  "Nova_claw",
  "Optimus_display",
  "Rosie_display",
  "Ruby_claw",
  "Optimus_claw",
  "Victor_antenna",
];

const required_parts1 = ["sensor", "speaker", "display", "claw"];
const required_parts2 = ["sensor", "speaker", "display"]; // typo as originally provided
const required_part3 = ["antenna", "claw"];

const robot = (allParts, requiredParts) => {
    const map = new Map();

    for(let entry of allParts){
        const [name, part] = entry.split('_');
        const key = name.toLowerCase();
        const value = part.toLowerCase();

        if(!map.has(key)){
            map.set(key, new Set());
        }

        map.get(key).add(value);
        // console.log(map)
    }

    const req = requiredParts.map(r => r.toLowerCase());

    const result = [];

    for(let [name,parts] of map){
        const hasAll = req.every(r => parts.has(r));
        if(hasAll){
            result.push(name);
        }
    }

    return result;
}

console.log(robot(allParts, required_part3));
console.log(robot(allParts, required_parts1));
console.log(robot(allParts, required_parts2));
