
const { JSDOM } = require("jsdom");
const fs = require('fs');

const USER_AGENT = "UFCEventScraper/2.0 (barta3738@gmail.com)";
const WIKI_URL = "https://en.wikipedia.org/w/api.php?action=parse&page=List_of_UFC_events&format=json&prop=text&origin=*";

let id = 0;

// array that will turn into the json
let allMatches = [];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// returns all the matches from the list of ufc events wikipedia page
async function getAllMatchLinks() {

    console.log("Trying to get event links from Wikipedia");
    try {
        const response = await fetch(WIKI_URL, {
            headers: { 'User-Agent': USER_AGENT }
        });

        const data = await response.json();
        
        // Extract the raw HTML string provided by Wikipedia's parse API
        const htmlContent = data.parse.text["*"];
        
        // load the HTML into JSDOM so we can use standard DOM methods
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;

        const pastEventsHeading = document.getElementById("Past_events");
        
        if (!pastEventsHeading) {
            console.error("Could not find the Past Events section.");
            return;
        }

        let currentElement = pastEventsHeading.parentElement;
        let pastEventsTable = null;
        
        while (currentElement) {
            if (currentElement.tagName === "TABLE" && currentElement.classList.contains("wikitable")) {
                pastEventsTable = currentElement;
                break;
            }
            currentElement = currentElement.nextElementSibling;
        }

        if (!pastEventsTable) {
            console.error("Could not find the past events wikitable.");
            return;
        }

        const rowLinks = pastEventsTable.querySelectorAll("tbody tr td a");
        
        const events = [];
        const seenUrls = new Set();

        rowLinks.forEach(link => {
            const title = link.getAttribute("title");
            const href = link.getAttribute("href");

            // check if its a real link has a title and skip red links (pages that don't exist yet)
            if (href && href.startsWith("/wiki/") && title && !link.classList.contains("new")) {
                const fullUrl = `https://en.wikipedia.org${href}`;
                
                // Keeps only unique links
                if (!seenUrls.has(fullUrl) && title.includes("UFC") && !title.includes("Apex")) {
                    events.push({
                        title: title,
                        url: fullUrl
                    });
                }
            }
        });

        console.log(`\n✅ Success! Successfully extracted ${events.length} past UFC events from the table.`);
        console.log("Here is a preview of the most recent past events:");
        // Shows the first 5
        console.log(events.slice(0, 5));
        
        return events;

    } catch (error) {
        console.error("❌ Error getting data from Wikipedia:", error);
    }

}

// parses the name from the html element that contains the name
async function getFighterName(text) {

    let final = text.replaceAll("\n", "");
    final = final.replaceAll(" (fighter)", "");

    // if text includes "title=" i assume it is a <a> html element 
    if (final.includes("title=")) {
        const splitText = final.split("title=");

        return splitText[1].split("\"")[1];
    }

    return final;

}

// scrapes a wikipedia event page for results of the matches for that event
async function scrapeEvent(title, eventNum, numOfEvents) {

    // the api url (has a ton of json)
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&prop=text&origin=*`;
    // Example: `https://en.wikipedia.org/w/api.php?action=parse&page=Las_Vegas&format=json&prop=text&origin=*`;
    
    console.log(eventNum, "/", numOfEvents ,"Finding fighters for event: ", title);

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': USER_AGENT }
        });

        const data = await response.json();
        
        // Extract the raw HTML string provided by Wikipedia's parse API
        const htmlContent = data.parse.text["*"];
        
        // load the HTML into JSDOM so we can use standard DOM methods
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;

        const resultsHeading = document.getElementById("Results");

        if (!resultsHeading) {
            console.error(`❌ Could not find the "Results" section heading for: `, title);
            return;
        }

        let currentElement = resultsHeading.parentElement;
        let targetTable = null;

        while (currentElement) {
            if (currentElement.tagName === "TABLE") {
                targetTable = currentElement;
                break;
            }
            currentElement = currentElement.nextElementSibling;
        }

        if (!targetTable) {
            console.error("❌ Could not find any table directly after the Results section for: ", title);
            return;
        }

        console.log(`✅ Successfully targeted the Results table for: ${title}`);

            
        // This safely isolates the table cells and links
        const rowLinks = targetTable.querySelectorAll("td");

        let arrayHTML = [];
        
        rowLinks.forEach(item => {
            const linkTitle = item.innerHTML;
            
            // Print out the fighter links, weight classes, or method details found inside the table
            if (linkTitle) {
                arrayHTML.push(item.innerHTML);
            }
        });

        for (let i = 0; i < arrayHTML.length; i++) {
            // finds the element with "def" which is always between two fighters, and the fighter on the left is always the winner
            if (arrayHTML[i].includes('def.')) {

                allMatches.push({
                    fighter1: await getFighterName(arrayHTML[i-1]),
                    fighter2: await getFighterName(arrayHTML[i+1]),
                    winner: await getFighterName(arrayHTML[i-1])
                })
            // if the element is "vs" it means the fighters either drew or the match DNF, we skip dnfs, but we include draws in the data
            } else if (arrayHTML[i].includes('vs.') && arrayHTML[i+2].includes('Draw')) {
                allMatches.push({
                    fighter1: await getFighterName(arrayHTML[i-1]),
                    fighter2: await getFighterName(arrayHTML[i+1]),
                    winner: "Draw"
                })
            }
        }

    } catch (error) {
        console.error("Error getting data from: ", title, " Error: ", error);
    }
    

}

async function scrapeWikipedia() {

    const links = await getAllMatchLinks();

    for (let i = 0; i < links.length; i++) {

            await scrapeEvent(links[i].title, i, links.length);

            // pauses for 0.3 seconds
            await sleep(300);
    }

    console.log(allMatches);

    fs.writeFileSync('allMatches.json', JSON.stringify(allMatches, null, 2), 'utf-8');

}

scrapeWikipedia();

// scrapeEvent('UFC 116', 1, 1);
