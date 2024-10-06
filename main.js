let words = document.querySelectorAll(".word");
let selected_count = 0;
let selected = new Set();
let parsedData = []
let failed=1;
let compline = 0;
let notneededwords = [];
function isOneElementDifferent(set1, set2) {
    // Check if the sets have the same size + 1
    if (set1.size !== set2.size && set1.size + 1 !== set2.size && set2.size + 1 !== set1.size) {
        return false;
    }

    // Convert sets to arrays
    const arr1 = Array.from(set1);

    let differenceCount = 0;

    // Loop through the first set
    for (const element of arr1) {
        if (!set2.has(element)) {
            differenceCount++;
        }
    }

    return differenceCount === 1; // True if exactly one element is different
}
function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }
function parseJsonTags(inputString) {
    console.log(inputString);
    
    // Regular expression to match <json>...</json>
    const jsonPattern = /<json>((.|\n)*?)<\/json>/g;
    let matches;
    let lastMatch = null;

    // Iterate through all matches and store the last one
    while ((matches = jsonPattern.exec(inputString)) !== null) {
        lastMatch = matches;
    }

    if (lastMatch) {
        const jsonString = lastMatch[1];
        console.log(jsonString);
        const jsonObject = JSON.parse(jsonString);

        return jsonObject;
    } else {
        throw new Error("No <json> tags found");
    }
}

// Example usage:
words.forEach(word => {
    word.innerText = "Loading...";
    word.addEventListener("click", function() {
        this.classList.add('clicked');

        // Remove the 'clicked' class after 0.3s to allow for future clicks
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 100);
        if (selected_count == 4) {
            document.getElementById("submit").classList.add("disabledbutton");
        }
        if (this.classList.contains("selected")) {
            selected.delete(this.innerText.toLowerCase())
            console.log(selected)
            this.classList.remove("selected");
            if (selected_count == 4) {
                document.getElementById("submit").classList.add("disabledbutton");
            }
            selected_count -= 1;
            if (selected_count == 0) {
                document.getElementById("deselect").classList.add("disabledbutton");
            }
        } else {
            if (selected_count < 4) {
                this.classList.add("selected");
                selected.add(this.innerText.toLowerCase())
                console.log(selected)
                selected_count += 1;
                if (selected_count == 1) {
                    document.getElementById("deselect").classList.remove("disabledbutton");
                }
            }
            if (selected_count == 4) {
                document.getElementById("submit").classList.remove("disabledbutton");
            }
        }
    });
});
const word1 = nouns[Math.floor(Math.random() * nouns.length)];
const word2 = nouns[Math.floor(Math.random() * nouns.length)];
const word3 = nouns[Math.floor(Math.random() * nouns.length)];
const word4 = nouns[Math.floor(Math.random() * nouns.length)];
console.log(word1, word2, word3, word4)
const deepInfraToken = ""; // Make sure to set your token in environment variables

const requestData = {
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
    messages: [
        {
            role: "user",
            content: `Create four lists, each containing four words that are interconnected through a common theme or concept. However, some words from different lists should be ambiguous enough that they could be mistaken for belonging to the same list, even though they don’t actually share a common theme. This means that certain words from separate lists might appear to have a connection or overlap, but they belong to distinct groups. Avoid repeating words within the lists.

The themes for each group should be crafted to be relatively challenging, aiming for complexity without straying too far from words that a middle schooler would know. Consider using words with multiple definitions or meanings, which could further enhance the ambiguity between the lists.

The difficulty levels should not simply rely on harder vocabulary but should also involve more intricate or layered themes. Each level should be defined as follows:

Easy (1): Basic themes with familiar words. make it based on the word "`+word1+`
Easy-Medium (2): Slightly more complex themes, requiring deeper connections. make it based on the word "`+word2+`
Medium-Hard (3): Themes that introduce multiple definitions or cultural references. make it based on the word "`+word3+`
Hard (4): Thematic layers that challenge the usual associations and require critical thinking. make it based on the word "`+word4+`
don't make the themes just be the words, be a little clever
Please format the output in JSON, ensuring that it is encapsulated within the following tags: <json>[{"difficulty":1, "theme":"", "words":["", "", "", ""]},{"difficulty":2, "theme":"", "words":["", "", "", ""]},{"difficulty":3, "theme":"", "words":["", "", "", ""]},{"difficulty":4, "theme":"", "words":["", "", "", ""]}]</json> even though the challange isn't vocabluary doesn't mean that you need to use basic vocabulary. only put your FINAL output in json tags, multiple json tags WILL cause errors. State your thought process BEFORE your output`
        }
    ],
    temperature: 0.8
};

fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${deepInfraToken}`
    },
    body: JSON.stringify(requestData)
})
.then(response => response.json())
.then(data => {
    parsedData = parseJsonTags(data["choices"][0]["message"]["content"].toLowerCase());
    console.log(parsedData); // Handle the response data here
    madewords=[];
    for(let y=0;y<4;y++) {
        for(let x=0;x<4;x++) {
            madewords.push(parsedData[y].words[x]);
        }
    }
    shuffle(madewords)
    let i=0;
    words.forEach(word => {
        word.innerText=madewords[i];
        i++
    })
})
.catch(error => {
    console.error('Error:', error); // Handle errors here
});

document.getElementById("deselect").addEventListener("click", function() {
    if (!this.classList.contains("disabledbutton")) {
        this.classList.add('clicked');

        // Remove the 'clicked' class after 0.3s to allow for future clicks
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 100);
        if (selected_count == 4) {
            document.getElementById("submit").classList.add("disabledbutton");
        }
        words.forEach(word => {
            if (word.classList.contains("selected")) {
                word.classList.remove("selected");
            }
        });
        this.classList.add("disabledbutton");
        selected_count = 0;
        selected.clear();
    }
});
document.getElementById("shuffle").addEventListener("click", function() {
    words = document.querySelectorAll(".word");
    this.classList.add('clicked');

      // Remove the 'clicked' class after 0.3s to allow for future clicks
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 100);
    madewords=[];
    for(let y=0;y<4;y++) {
        for(let x=0;x<4;x++) {
            if (!notneededwords.includes(parsedData[y].words[x])) {
                madewords.push(parsedData[y].words[x]);
            }
            
        }
    }
    shuffle(madewords)
    let i=0;
    words.forEach(word => {
        word.innerText=madewords[i];
        i++
    })
})
document.getElementById("submit").addEventListener("click", function() {
    if (!this.classList.contains("disabledbutton")) {
        this.classList.add('clicked');

        // Remove the 'clicked' class after 0.3s to allow for future clicks
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 100);
        let works=false
        let found={}
        let oneaway = false
        parsedData.forEach(line => {
            linewords = new Set(line.words);
            console.log(linewords, selected)
            if (!works) {
                if (!oneaway) {
                    oneaway = isOneElementDifferent(linewords, selected)
                }
                works= linewords.size == selected.size && selected.isSubsetOf(linewords);
                if (works) {
                    found = line;
                }
            }
        })
        if (!works) {
            document.getElementById(failed.toString()).classList.add("usedguess");
            failed++;
            if (failed==5) {
                document.getElementById("overlay").classList.remove("invisible")
            } else if (oneaway) {
                document.getElementById("oneaway").classList.remove("invisible")
                setTimeout(() => {
                    document.getElementById("oneaway").classList.add("invisible")
                }, 2000);
            }
        } else {
            found.words.forEach(word => {
                notneededwords.push(word);
            })
            compline++
            lineele = document.getElementById("line"+compline.toString())
            lineele.classList.add("correctline")
            switch(found.difficulty) {
                case 1:
                  lineele.id = "easy"
                  break;
                case 2:
                    lineele.id = "medium"
                  break;
                case 3:
                    lineele.id = "hard"
                  break;
                case 4:
                    lineele.id = "veryhard"
                  break;
            }
            lineele.innerHTML="<div class=\"themeheader\">"+found.theme+"</div><div class=\"commawords\">"+found.words.join(", ");
            words = document.querySelectorAll(".word");
            madewords=[];
            for(let y=0;y<4;y++) {
                for(let x=0;x<4;x++) {
                    if (!notneededwords.includes(parsedData[y].words[x])) {
                        madewords.push(parsedData[y].words[x]);
                    }
                    
                }
            }
            shuffle(madewords)
            let i=0;
            words.forEach(word => {
                word.innerText=madewords[i];
                i++
            })
            
        }
        if (selected_count == 4) {
            document.getElementById("submit").classList.add("disabledbutton");
        }
        words.forEach(word => {
            if (word.classList.contains("selected")) {
                word.classList.remove("selected");
            }
        });
        this.classList.add("disabledbutton");
        selected_count = 0;
        selected.clear();
        
    }
});
