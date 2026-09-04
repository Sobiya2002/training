



"I modeled the instructions as a directed graph.
  I used a reverse adjacency map to count how many rooms point to each room, a lookup map to find a room's next destination,
    and a set for constant-time treasure room checks. Then I filtered rooms that have at least two incoming paths and whose next room is a treasure room."
  
"map helps me calculate how many rooms lead into a room. Once I find a room that has multiple incoming paths,
  I use nextMap to find where that room itself leads. Then I check whether that destination is a treasure room."

