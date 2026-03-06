
function parseDuration(durationStr) {
    const [m, s] = durationStr.split(':').map(Number);
    return m * 60 + s;
}

function findPairTwoPointers(songList) {
    const TARGET = 7 * 60; // 420 seconds

    // Transform: [name, "mm:ss"] -> [durationInSeconds, name]
    const arr = songList.map(([name, t]) => [parseDuration(t), name]);
    console.log('before sorting', arr);

    /**
     * before sorting [
    [ 485, 'Stairway to Heaven' ],
    [ 147, 'Immigrant Song' ],
    [ 221, 'Rock and Roll' ],
    [ 149, 'Communication Breakdown' ],
    [ 168, 'Good Times Bad Times' ],
    [ 199, 'Hot Dog' ],
    [ 198, 'The Crunge' ],
    [ 626, 'Achilles Last Stand' ],
    [ 295, 'Black Dog' ]
  ]
     */


    arr.sort((a, b) => a[0] - b[0]);
    console.log('after sorting', arr)
    /*
    after sorting [
   [ 147, 'Immigrant Song' ],
   [ 149, 'Communication Breakdown' ],
   [ 168, 'Good Times Bad Times' ],
   [ 198, 'The Crunge' ],
   [ 199, 'Hot Dog' ],
   [ 221, 'Rock and Roll' ],
   [ 295, 'Black Dog' ],
   [ 485, 'Stairway to Heaven' ],
   [ 626, 'Achilles Last Stand' ]
 ]
    */
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        const sum = arr[left][0] + arr[right][0];
        if (sum === TARGET) {
            return [arr[left][1], arr[right][1]];
        }
        if (sum < TARGET) {
            left++;
        } else {
            right--;
        }
    }
    return [];
}


const song_times_1 = [
    ["Stairway to Heaven", "8:05"],
    ["Immigrant Song", "2:27"],
    ["Rock and Roll", "3:41"],
    ["Communication Breakdown", "2:29"],
    ["Good Times Bad Times", "2:48"],
    ["Hot Dog", "3:19"],
    ["The Crunge", "3:18"],
    ["Achilles Last Stand", "10:26"],
    ["Black Dog", "4:55"]
];


console.log(findPairTwoPointers(song_times_1));