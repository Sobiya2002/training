// Build a frequency map of the secret to count how many characters present in secret
// Iterate through each word.
// Build the word's frequency map.
// Compare the secret frequencies against the word frequencies.
// If every secret character exists with at least the required count, return that word.
// If no word satisfies the condition, return "No Match".

words = ["Cat", "tac", "act"];
secret = "cat";

const findSecretWord = (words, secret) => {
    const secretFreq = new Map();

    // Build secret frequency map
    for (const char of secret) {
        secretFreq.set(char, (secretFreq.get(char) || 0) + 1);
    }

    const hasAllLetters = (word) => {
        const wordFreq = new Map();

        // Build word frequency map
        for (const char of word) {
            wordFreq.set(char, (wordFreq.get(char) || 0) + 1);
        }

        // Verify required frequencies
        for (const [char, count] of secretFreq) {
            if ((wordFreq.get(char) || 0) < count) {
                return false;
            }
        }

        return true;
    };

    // Priority 1: Exact match
    for (const word of words) {
        if (word === secret) {
            return word;
        }
    }

    // Priority 2: Frequency match
    for (const word of words) {
        if (hasAllLetters(word)) {
            return word;
        }
    }

    return "No Match";
};
console.log(findSecretWord(words, secret));
