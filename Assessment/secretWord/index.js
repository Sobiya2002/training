const getFreq = (str) =>{
    let freq = {};
    for (let ch of str) {
        freq[ch] = (freq[ch] || 0) + 1;
    }
    return freq;
}

const secretWord = (words, secret) => {
    const getSecretFreq = getFreq(secret);
    for(let word of words ){
        const getWordFreq = getFreq(word);

        let isMatch = true;
        for (ch in getSecretFreq){
            if(!getWordFreq[ch] || getWordFreq[ch] < getSecretFreq[ch]){
                isMatch = false;
                break
            }
        }

        if(isMatch){return word};
    }

    return 'No Match Found';
}


const words = ['pappaya', 'carrot', 'rabbit', 'apple'];
const secret = 'abr'
console.log(secretWord(words, secret));