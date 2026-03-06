const allParts = [
  "Rosie_sensor", "optimus_speaker", "Rosie_horn", "Ruby_antenna",
  "victor_display", "Rosie_speaker", "Optimus_sensor", "Ruby_sensor",
  "Nova_claw", "Optimus_display", "Rosie_display", "Ruby_claw",
  "Optimus_claw", "Victor_antenna"
];

const required_parts1 = ["sensor", "speaker", "display", "claw"];
const required_parts2 = ["sensor", "speaker", "display"];
const required_parts3 = ["antenna", "claw"];

const getRobotMap = (allParts) => {
  let map = {};

  allParts.forEach(item =>{
    const [robot, part] = item.split('_');
    const robotKey = robot.toLowerCase();

    if(!map[robotKey]) map[robotKey] = new Set();
    map[robotKey].add(part.toLowerCase());
  });

  return map;
}

const getRobotParts = (allParts, requiredParts) => {
  const robotMap = getRobotMap(allParts);
  const req = requiredParts.map(r => r.toLowerCase());

  return Object.entries(robotMap)
    .filter(([robot, part]) => req.every(r => part.has(r)))
    .map(([robot]) => robot);
}

console.log(getRobotParts(allParts, required_parts2));
