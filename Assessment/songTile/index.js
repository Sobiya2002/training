// const parseDuration = (durationStr) => {
//     const [min, sec] = durationStr.split(':').map(Number);  //'3:41'.split(':') -> ['3','41'].map(number) => [3,41]
//     return min*60+sec;
// };

// const findPair = (songList) => {
//     const target = 7 * 60;
//     const durationMap = new Map();
//     console.log('DurationMap', durationMap);

//     for (let [song, durationStr]of songList){
//         const duration = parseDuration(durationStr);
//         console.log("Duration", duration);
//         const complement = target - duration;
//         console.log('complement', complement);

//         if (durationMap.has(complement)){
//             return [durationMap.get(complement),song];
//         }

//         durationMap.set(duration,song);
//     }
//     return [];
// }

// const song_times_1 = [
//      ["Rock and Roll", "3:41"], ["Hot Dog", "3:19"]]

// console.log(findPair(song_times_1));

const arr = [8,9,4]
const arr1 = arr
arr.push(3)
console.log(arr1);
console.log(arr);