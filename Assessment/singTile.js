// "We have a catalog of song titles (and their lengths) that we play at a local radio station. 
//  We have been asked to play two of those songs in a row, and they must add up to exactly
//  seven minutes long.  
 
// Given a list of songs and their durations, write a function that
//  returns the names of any two distinct songs that add up to exactly seven minutes.  
//  If there is no such pair, return an empty collection. 
 
// Example:
// song_times_1 = [
//     [""Stairway to Heaven"", ""8:05"], [""Immigrant Song"", ""2:27"],
//     [""Rock and Roll"", ""3:41"], [""Communication Breakdown"", ""2:29"],
//     [""Good Times Bad Times"", ""2:48"], [""Hot Dog"", ""3:19"],
//     [""The Crunge"", ""3:18"], ["Achilles Last Stand", "10:26"],
//     ("Black Dog", "4:55"]
// ]
// find_pair(song_times_1) => ["Rock and Roll", "Hot Dog"] (3:41 + 3:19 = 7:00)"


"I first convert all song durations into seconds and sort them.
Then I use a two-pointer approach. One pointer starts at the shortest song and the other at the longest song. If their sum is greater than 7 minutes,
I move the right pointer left to reduce the sum. If the sum is less than 7 minutes, I move the left pointer right to increase the sum. 
Because the list is sorted, each move eliminates impossible combinations and finds a valid pair in O(n) time after sorting."

  song_times_1 = [
    ["Stairway to Heaven", "8:05"], ["Immigrant Song", "2:27"],
    ["Rock and Roll", "3:41"], ["Communication Breakdown", "2:29"],
    ["Good Times Bad Times", "2:48"], ["Hot Dog", "3:19"],
    ["The Crunge", "3:18"], ["Achilles Last Stand", "10:26"],
    ["Black Dog", "4:55"]
]

const find_pairs = (songTimes) => {
    const sorted = [...songTimes].sort((a,b) => toSec(a[1])-toSec(b[1]));
    
    let target = 60*7;
    let result = [];
    let left =0;
    let right = sorted.length-1;

    while(left<right){
        let sum = toSec(sorted[left][1]) + toSec(sorted[right][1]);
        console.log(sum);
        if(sum > target){
            right--;
        }
        else if(sum < target){
            left++;
        }
        else{
            result.push([sorted[left][0],sorted[right][0]]);
            break;
        }
    
    }
    return result;
}

const toSec = (time) =>{
    const [min,sec] = time.split(":");
    return parseInt(min)*60+parseInt(sec);
}
console.log(find_pairs(song_times_1));

















































