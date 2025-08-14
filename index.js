let commonWords = [];

// Load common words list from MIT .txt file
fetch("commonWords.txt")
    .then(response => response.text())
    .then(text => {
        commonWords = text.split("\n").map(word => word.trim().toLowerCase());
    });

async function simplifyText() {
    let input = document.getElementById("inputText").value;
    let words = input.split(" ");
    let simplifiedWords = [];

    for (let i = 0; i < words.length; i++) {
        let word = words[i];

        // Handle punctuation
        let punctuation = "";
        if (word.endsWith(".") || word.endsWith(",") || word.endsWith("!") || word.endsWith("?")) {
            punctuation = word[word.length - 1];
            word = word.slice(0, word.length - 1);
        }

        let cleanWord = word.toLowerCase();
        let synonym = cleanWord;

        // Only use Datamuse if word is not in common words
        if (!commonWords.includes(cleanWord)) {
            try {
                let response = await fetch(`https://api.datamuse.com/words?ml=${cleanWord}&max=1`);
                let data = await response.json();
                if (data.length > 0) {
                    synonym = data[0].word;
                }
            } catch (error) {
                console.log("API Error:", error);
            }
        }

        // Preserve capitalization
        if (word[0] === word[0].toUpperCase()) {
            synonym = synonym.charAt(0).toUpperCase() + synonym.slice(1);
        }

        // Add punctuation back
        synonym += punctuation;
        simplifiedWords.push(synonym);
    }

    let simplified = simplifiedWords.join(" ");
    document.getElementById("outputText").value = simplified;
}

// Event listener for button
document.getElementById("simplifyButton").addEventListener("click", simplifyText);
