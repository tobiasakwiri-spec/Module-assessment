const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

document.getElementById("searchForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const word = document.getElementById("searchInput").value.trim(); 
    const resultSection = document.getElementById("resultSection");

    if (!word) return;
    resultSection.innerHTML = "<p>Loading...</p>";

    try {
        const targetUrl = API_URL + encodeURIComponent(word);
        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"  
            }
        });

        if (!response.ok) {
            throw new Error("Word not found");
        }

        const data = await response.json();
        if (data && data.length === 0) {  
            resultSection.innerHTML = "<p class='status-msg>Word not found</p>";
            return;
        } 
        resultSection.innerHTML = data.slice(0, 3).map((entry) => {
            return `<div class="word-entry">
                        <h3>${entry.word}</h3>
                        <p>${entry.phonetic}</p>
                        <ul>
                            ${entry.meanings.map((meaning) => `
                                <li>
                                    <strong>${meaning.partOfSpeech}</strong>
                                    <ul>
                                        ${meaning.definitions.map((definition) => `
                                            <li>${definition.definition}</li>
                                        `).join('')}
                                    </ul>
                                </li>
                            `).join('')}
                        </ul>
                    </div>`;
        }).join('');
    } catch (error) {
       console.error(error);
       resultSection.innerHTML = "<p class='status-msg'>Error fetching data. Please try again later.</p>"; 
    }
});