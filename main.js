let words = document.querySelectorAll(".word");
var selected_count = 0;
var selected = new Set();
var parsedData = []
var failed=1;
var compline = 0;
var notneededwords = [];
var foundareas= [false, false, false, false]
var log = "";
function logToDebugger(message) {
    let dubugconsole = document.getElementById("console")
    if (log=="") {
        log = message
        
    } else {
        log+="\n\n"+message 
    }
    dubugconsole.innerText=log
    
}
logToDebugger("app started!")
function getDifferentCount(set1, set2) {
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

    return differenceCount; // True if exactly one element is different
}
function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
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
    word.addEventListener("mousedown", function() {
        
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
            this.classList.add('clicked');

            // Remove the 'clicked' class after 0.3s to allow for future clicks
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 100);
        } else {
            if (selected_count < 4) {
                this.classList.add("selected");
                selected.add(this.innerText.toLowerCase())
                console.log(selected)
                selected_count += 1;
                if (selected_count == 1) {
                    document.getElementById("deselect").classList.remove("disabledbutton");
                }
                this.classList.add('clicked');

                // Remove the 'clicked' class after 0.3s to allow for future clicks
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 100);
            }
            if (selected_count == 4) {
                document.getElementById("submit").classList.remove("disabledbutton");
            }
        }
    });
});

if (localStorage.getItem("queuedconnections")==null) {
    const word1 = nouns[Math.floor(Math.random() * nouns.length)];
    const word2 = nouns[Math.floor(Math.random() * nouns.length)];
    const word3 = nouns[Math.floor(Math.random() * nouns.length)];
    const word4 = nouns[Math.floor(Math.random() * nouns.length)];
    const deepInfraToken = ""; // Make sure to set your token in environment variables

    const requestData = {
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
        messages: [
            {
                role: "user",
                content: `You are creating a custom new york times connections game. Create four lists, each containing four words that are interconnected through a common theme or concept. However, some words from different lists should seem like they fit together, but they actually don’t. This means that certain words from separate lists might appear to have a connection or overlap, but they belong to distinct groups. Only use each word one.

    The words should not be complex or difficult words, as that is not the point of the puzzle

    The difficulty levels should not simply rely on harder vocabulary but should also involve harder themes. Each level should be defined as follows:

    Easy (1): Basic themes with familiar words with multiple definitions. make it based on the word "`+word1+`”
    Easy-Medium (2): Slightly more complex themes, requiring deeper connections. make it based on the word "`+word2+`”
    Medium-Hard (3): Themes with multiple definitions or harder references. make it based on the word "`+word3+`”
    Hard (4): Thematic layers that challenge the usual associations and require critical thinking. make it based on the word "`+word4+`”
    don't make the themes just be the words, be a little clever.
Make sure all the words make sense within their themes
    Please format the output in JSON, ensuring that it is encapsulated within the following tags: <json>[{"difficulty":1, "theme":"", "words":["", "", "", ""]},{"difficulty":2, "theme":"", "words":["", "", "", ""]},{"difficulty":3, "theme":"", "words":["", "", "", ""]},{"difficulty":4, "theme":"", "words":["", "", "", ""]}]</json> even though the challange isn't vocabluary doesn't mean that you need to use basic vocabulary.
`
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
        logToDebugger(parsedData[0].words.toString()+"\n"+parsedData[1].words.toString()+"\n"+parsedData[2].words.toString()+"\n"+parsedData[3].words.toString())
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
} else {
    parsedData = JSON.parse(localStorage.getItem("queuedconnections"))
    logToDebugger(parsedData[0].words.toString()+"\n"+parsedData[1].words.toString()+"\n"+parsedData[2].words.toString()+"\n"+parsedData[3].words.toString())
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
}
const word1 = nouns[Math.floor(Math.random() * nouns.length)];
const word2 = nouns[Math.floor(Math.random() * nouns.length)];
const word3 = nouns[Math.floor(Math.random() * nouns.length)];
const word4 = nouns[Math.floor(Math.random() * nouns.length)];

const deepInfraToken = ""; // Make sure to set your token in environment variables

const requestData = {
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
    messages: [
        {
            role: "user",
            content: `You are creating a custom new york times connections game. Create four lists, each containing four words that are interconnected through a common theme or concept. However, some words from different lists should seem like they fit together, but they actually don’t. This means that certain words from separate lists might appear to have a connection or overlap, but they belong to distinct groups. Only use each word one.

    The words should not be complex or difficult words, as that is not the point of the puzzle

    The difficulty levels should not simply rely on harder vocabulary but should also involve harder themes. Each level should be defined as follows:

    Easy (1): Basic themes with familiar words with multiple definitions. make it based on the word "`+word1+`”
    Easy-Medium (2): Slightly more complex themes, requiring deeper connections. make it based on the word "`+word2+`”
    Medium-Hard (3): Themes with multiple definitions or harder references. make it based on the word "`+word3+`”
    Hard (4): Thematic layers that challenge the usual associations and require critical thinking. make it based on the word "`+word4+`”
    don't make the themes just be the words, be a little clever.
Make sure all the words make sense within their themes
    Please format the output in JSON, ensuring that it is encapsulated within the following tags: <json>[{"difficulty":1, "theme":"", "words":["", "", "", ""]},{"difficulty":2, "theme":"", "words":["", "", "", ""]},{"difficulty":3, "theme":"", "words":["", "", "", ""]},{"difficulty":4, "theme":"", "words":["", "", "", ""]}]</json> even though the challange isn't vocabluary doesn't mean that you need to use basic vocabulary.
`        }
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
    nextData = parseJsonTags(data["choices"][0]["message"]["content"].toLowerCase());
    localStorage.setItem("queuedconnections", JSON.stringify(nextData));
    logToDebugger("next one generated!")
})
.catch(error => {
    console.error('Error:', error); // Handle errors here
});

document.getElementById("deselect").addEventListener("mousedown", function() {
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
document.getElementById("shuffle").addEventListener("mousedown", function() {
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
function showall() {

    if (selected_count == 4) {
        document.getElementById("submit").classList.add("disabledbutton");
    }
    words.forEach(word => {
        if (word.classList.contains("selected")) {
            word.classList.remove("selected");
        }
    });
    selected_count = 0;
    selected.clear();
    let j=0;
    let t=0.5;
    console.log(foundareas)
    console.log(parsedData)
    foundareas.forEach(run => {
        j++
        
        let myj = j.valueOf()
        if (!run) {
            t+=1.0
            setTimeout(() => {
            
                parsedData.forEach(line=>{
                    if (line.difficulty==myj) {
                        console.log(line.words, line.theme)
                        words = document.querySelectorAll(".word");
                        setTimeout(() => {
                            compline++
                            lineele = document.getElementById("line"+compline.toString())
                            lineele.classList.add("correctline")
                            switch(line.difficulty) {
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
                            lineele.innerHTML="<div class=\"themeheader\">"+line.theme+"</div><div class=\"commawords\">"+line.words.join(", ");
                            words = document.querySelectorAll(".word");
                            madewords=[];
                            line.words.forEach(word => {
                                notneededwords.push(word);
                            })
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
                            
                        }, 400);
                        words.forEach(word=>{
                            
                            if (line.words.includes(word.innerText.toLowerCase())) {
                                word.classList.add("antic")
                                setTimeout(() => {
                                    word.classList.remove('antic');
                                    word.classList.add('anticend');
                                }, 300);
                                setTimeout(() => {
                                    word.classList.remove('anticend');
                                }, 400);
                                
                            }
                        })
                    }
                })
            
            }, 1100*(t-1))
        }
    })
}
document.getElementById("debug").addEventListener("mousedown", function() {
    this.classList.add('clicked');
    document.getElementById("console").classList.toggle("invisible")
    // Remove the 'clicked' class after 0.3s to allow for future clicks
    setTimeout(() => {
        this.classList.remove('clicked');
    }, 100);
})
document.getElementById("submit").addEventListener("mousedown", function() {
    try {
        logToDebugger(Array.from(selected))
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
                        oneaway = getDifferentCount(linewords, selected)===1
                    }
                    works= getDifferentCount(linewords, selected)===0
                    if (works) {
                        found = line;
                    }
                }
            })
            if (!works) {
                document.getElementById(failed.toString()).classList.add("usedguess");
                failed++;
                if (failed==5) {
                    //document.getElementById("overlay").classList.remove("invisible")
                } else if (oneaway) {
                    document.getElementById("oneaway").classList.remove("invisible")
                    setTimeout(() => {
                        document.getElementById("oneaway").classList.add("invisible")
                    }, 800);
                }
            } else {
                selected_count = 0;
                selected.clear();
                document.getElementById("deselect").classList.add("disabledbutton")
                this.classList.add("disabledbutton")
                found.words.forEach(word => {
                    notneededwords.push(word);
                })
                compline++
                setTimeout(() => {
                    lineele = document.getElementById("line"+compline.toString())
                    lineele.classList.add("correctline")
                    foundareas[found.difficulty-1]=true
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
                }, 400);
                
                
            }
            setTimeout(()=> {
                if (failed==5) {
                    showall()
                }
            }, 800)
            words.forEach(word => {
                if (word.classList.contains("selected")) {
                    if (selected_count == 0) {
                        word.classList.remove("selected")
                        word.classList.add("antic")
                        setTimeout(() => {
                            word.classList.remove('antic');
                            word.classList.add('anticend');
                        }, 300);
                        setTimeout(() => {
                            word.classList.remove('anticend');
                        }, 400);
                    } else {
                        word.classList.add("shake");
                        setTimeout(() => {
                            word.classList.remove('shake');
                        }, 800);
                    }
                    
                }
                
            });

            
            
        }
    } catch(error) {
        logToDebugger("ERROR: "+error.stack)
    }
})
