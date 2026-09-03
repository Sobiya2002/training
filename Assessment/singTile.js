"I first convert all song durations into seconds and sort them.
Then I use a two-pointer approach. One pointer starts at the shortest song and the other at the longest song. If their sum is greater than 7 minutes,
I move the right pointer left to reduce the sum. If the sum is less than 7 minutes, I move the left pointer right to increase the sum. 
Because the list is sorted, each move eliminates impossible combinations and finds a valid pair in O(n) time after sorting."
