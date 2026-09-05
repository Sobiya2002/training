// Build a frequency map of the secret to count how many characters present in secret
// Iterate through each word.
// Build the word's frequency map.
// Compare the secret frequencies against the word frequencies.
// If every secret character exists with at least the required count, return that word.
// If no word satisfies the condition, return "No Match".

words = ["Cat", "tac", "act"];
secret = "cat";

const findSecretWord =(words, secret) => {
    const secretFreq = {};

    for(const char of secret){
        secretFreq[char] = (secretFreq[char] || 0) + 1;
    }


    const hasAll = (word) => {
        const wordFreq = {};
        for(const char of word){
            wordFreq[char] = (wordFreq[char]||0) + 1;
        }

        for(const char in secretFreq){
            if((wordFreq[char] || 0) < secretFreq[char]){
                return false;
            }
        }
        return true
    }

    for(const word of words){
        if(word === secret){
            return word;
        }
    }

     for(const word of words){
        if(hasAll(word)){
            return word;
        }
    }

    return 'no match';
}

console.log(findSecretWord(words, secret));
