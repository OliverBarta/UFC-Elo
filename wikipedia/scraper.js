
const { JSDOM } = require("jsdom");
const fs = require('fs');

const USER_AGENT = "UFCEventScraper/2.0 (barta3738@gmail.com)";
const WIKI_URL = "https://en.wikipedia.org/w/api.php?action=parse&page=List_of_UFC_events&format=json&prop=text&origin=*";

let id = 0;

let allMatches = [];

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
                if (!seenUrls.has(fullUrl) && title.includes("UFC")) {
                    events.push({
                        title: title,
                        url: fullUrl
                    });
                }
            }
        });

        console.log(`\nSuccess! Successfully extracted ${events.length} past UFC events from the table.`);
        console.log("Here is a preview of the most recent past events:");
        // Shows the first 5
        console.log(events.slice(0, 5));
        
        return events;

    } catch (error) {
        console.error("Error getting data from Wikipedia:", error);
    }

}

async function scrapeEvent(title) {

    // the api url (has a ton of json)
    const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&prop=text&origin=*`;
    // const url = `https://en.wikipedia.org/w/api.php?action=parse&page=Las_Vegas&format=json&prop=text&origin=*`;
    console.log("Trying to get data from event: ", title);
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

        const tables = document.querySelectorAll("table");


        if (tables.length === 0) {
            console.error("Could not find any Results tables for: ", title);
            return;
        }

        const table1 = tables[0];

            
        // This safely isolates the table cells and links
        const rowLinks = table1.querySelectorAll("a");
        
        rowLinks.forEach(link => {
            const linkTitle = link.getAttribute("title");
            
            // Print out the fighter links, weight classes, or method details found inside the table
            if (linkTitle) {
                console.log(`Found item: ${linkTitle}`);
            }
        });

        // tables.forEach((tableElement, index) => {
        //     console.log(`--- Processing Table #${index + 1} ---`);
            
        //     // This safely isolates the table cells and links
        //     const rowLinks = tableElement.querySelectorAll("tr td");
            
        //     rowLinks.forEach(link => {
        //         const linkTitle = link.getAttribute("title");
                
        //         // Print out the fighter links, weight classes, or method details found inside the table
        //         if (linkTitle) {
        //             console.log(`Found item: ${linkTitle}`);
        //         }
        //     });
        // });
        

    } catch (error) {
        console.error("Error getting data from: ", title, " Error: ", error);
    }
    

}

// async function scrapeWikipedia() {

//     const links = await getAllMatchLinks();

//     for (let i = 0; i < links.length; i++) {
        
            // await scrapeEvent(links[i].title);
//     }




// }

// scrapeWikipedia();

// getAllMatchLinks();

scrapeEvent('UFC Fight Night: Song vs. Figueiredo');