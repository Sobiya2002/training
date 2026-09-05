You are running a classroom and suspect that some of your students are passing around the answer to a multiple-choice question disguised as a random note.
 
Your task is to write a function that, given a list of words and a note, finds and returns the word in the list that is scrambled inside the note, if any exists. If none exist, it returns the result "-" as a string. There will be at most one matching word. The letters need to be in order or next to each other. The letters can reused.
 
Example:  
words = ["baby", "referee", "cat", "dada", "dog", "bird", "ax", "baz"]
note1 = "ctay"
find(words, note1) => "cat"   (the letters do not have to be in order)  
sort words once use any letter 
cat
  
note2 = "bcanihjsrrrferet"
find(words, note2) => "cat"   (the letters do not have to be together)  
Sort ->"cat"
 
note3 = "tbaykkjlga"
find(words, note3) => "-"     (the letters cannot be reused)  
  
note4 = "bbbblkkjbaby"
find(words, note4) => "baby"    
sort ->"cat","baby"
 
note5 = "dad"
find(words, note5) => "-"    
Sort->"cat","baby","dad"
 
note6 = "breadmaking"
find(words, note6) => "bird"    
Sort->"cat","baby","dad","bird"
 
note7 = "dadaa"
find(words, note7) => "dada"    
Sort->"cat","baby","dad","bird","dada"
 
All Test Cases:
find(words, note1) -> "cat"
find(words, note2) -> "cat"
find(words, note3) -> "-"
find(words, note4) -> "baby"
find(words, note5) -> "-"
find(words, note6) -> "bird"
find(words, note7) -> "dada"
  
Complexity analysis variables:  
  
W = number of words in `words`  
S = maximal length of each word or of the note  


function find(words, secret) {
    // Build frequency map for secret
    const secretFreq = new Map();

    for (const char of secret) {
        secretFreq.set(char, (secretFreq.get(char) || 0) + 1);
    }

    // Check each word
    for (const word of words) {
        const wordFreq = new Map();

        // Build frequency map for current word
        for (const char of word) {
            wordFreq.set(char, (wordFreq.get(char) || 0) + 1);
        }

        let isMatch = true;

        // Compare frequencies
        for (const [char, count] of wordFreq.entries()) {
            if ((secretFreq.get(char) || 0) < count) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            return word;
        }
    }

    return "-";
}

const words = [
    "baby",
    "referee",
    "cat",
    "dada",
    "dog",
    "bird",
    "ax",
    "baz"
];

console.log(find(words, "ctay"));             // cat
console.log(find(words, "bcanihjsrrrferet")); // cat
console.log(find(words, "tbaykkjlga"));       // -
console.log(find(words, "bbbblkkjbaby"));     // baby
console.log(find(words, "dad"));              // -
console.log(find(words, "breadmaking"));      // bird
console.log(find(words, "dadaa"));            // dada
