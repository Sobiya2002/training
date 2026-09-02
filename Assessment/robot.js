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
