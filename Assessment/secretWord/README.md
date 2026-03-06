You are given:
 
An array of lowercase strings:
 
const words = ["bonney", "bubble", "carrrot", "zack"];
 
A lowercase secret string:
 
const secret = "cat";
 
 
Your task is to write a function findSecretWord(words, secret) that:
Returns the first word from the list that contains all characters in secret with equal or higher frequency.
The order of characters in secret does not matter (i.e., it can be jumbled).
If no such word exists, return "No Match".
 
✅ Function Signature
function findSecretWord(words: string[], secret: string): string
  
✅ Input Constraints
1 <= words.length <= 10^4
1 <= words[i].length <= 100
1 <= secret.length <= 100
 
All words and the secret string consist of lowercase English letters only
 
✅ Examples
 
Example 1:
 
Input:
words = ["bonney", "bubble", "carrrot", "zack"];
secret = "cat";
 
Output:
"carrrot"
 
Example 2:
 
Input:
words = ["calculattor", "submarine", "banana"];
secret = "tac";
 
Output:
"calculattor"
 
> Note: tac is a jumbled form of "cat" → frequency match still valid
  
Example 3:
 
Input:
words = ["book", "boo", "boooook", "rookie"];
secret = "ookb";
 
Output:
"book"
 
---🧪 Edge Cases
 
Test Case Input Output Reason
 
🔹 Empty List [], "abc" "No Match" No candidates
🔹 Repeated Letters ["cabbage", "cab", "cabb"], "cabb" "cabb" 2 'b' required
🔹 Secret Letters Missing ["loop", "pool", "looped"], "pool" "pool" Valid letter counts
🔹 Long Noisy Words ["distraction", "construction", "accurate"], "ace" "accurate" All letters present
🔹 Case Sensitivity ["Cat", "tac", "act"], "cat" "No Match" Only lowercase allowed