// Select DOM elements
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const clearButton = document.getElementById("clearButton");
const searchButton = document.getElementById("searchButton");


const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// Handle form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // prevent page reload

    const word = input.value.trim().toLowerCase();

    if (word === "") {
        showError("Please enter a word.");
        return;
    }

    fetchWord(word);
    searchButton.disabled = true;
});

// Handle clear button
clearButton.addEventListener("click", () => {
    resultsDiv.innerHTML = "";
    input.value = "";
});

// Fetch word data from API
async function fetchWord(word) {
    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(API_URL + word);

        if (!response.ok) {
            throw new Error("Word not found");
        }

        const data = await response.json();
        displayResults(data[0]);
    } catch (error) {
        showError("Sorry, that word was not found.");
    }
}

// Display results in the DOM
function displayResults(data) {
    resultsDiv.innerHTML = "";

    const wordTitle = document.createElement("div");
    wordTitle.className = "word";
    wordTitle.textContent = data.word;

    const phonetic = document.createElement("p");
    phonetic.textContent = data.phonetic || "";

    const meaning = data.meanings[0];

    const partOfSpeech = document.createElement("p");
    partOfSpeech.className = "part-of-speech";
    partOfSpeech.textContent = "Part of speech: " + meaning.partOfSpeech;

    const definition = document.createElement("p");
    definition.className = "definition";
    definition.textContent ="Definition: " + meaning.definitions[0].definition;

    resultsDiv.appendChild(wordTitle);
    resultsDiv.appendChild(phonetic);
    resultsDiv.appendChild(partOfSpeech);
    resultsDiv.appendChild(definition);

    // sentence Example
    if (meaning.definitions[0].example) {
        const example = document.createElement("p");
        example.textContent =
            "Example: " + meaning.definitions[0].example;
        resultsDiv.appendChild(example);
    }

    // Synonyms display
    if (meaning.definitions[0].synonyms &&
        meaning.definitions[0].synonyms.length > 0) {
        const synonyms = document.createElement("p");
        synonyms.textContent =
            "Synonyms: " + meaning.definitions[0].synonyms.join(", ");
        resultsDiv.appendChild(synonyms);
    }

    //pronunciation 
    const audioData = data.phonetics.find(p => p.audio);
    if (audioData) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = audioData.audio;
        resultsDiv.appendChild(audio);
    }

    searchButton.disabled = false;

}

// Display error messages
function showError(message) {
    resultsDiv.innerHTML = `<p class="error">${message}</p>`;
    searchButton.disabled = false;
}
