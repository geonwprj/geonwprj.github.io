// ==UserScript==
// @name         Fix Content Character
// @description  Replace char in contents
// @match        https://www.bg3.co/novel/pagea/*
// @updateURL    https://raw.githubusercontent.com/geonwprj/geonwprj.github.io/main/userscripts/novel.js
// @version      0.2
// ==/UserScript==

(function() {
    'use strict';

    function getDetails() {
        try {
    	let title = document.getElementsByTagName('title')[0].textContent.split(' - ').slice(0,-1).join(' - ').trim().split(" ");
    	let subtitle = title.slice(2).join(" ").trim();
    	title = title[1].trim();
            let currentURL = window.location.href;
            let htmlPage = currentURL.split("/").slice(-1)[0].split(".")[0].split("_");
            logging(JSON.stringify({
        		"title": title,
        		"subtitle": subtitle,
                "author": htmlPage[0].split("-")[1],
                "book": htmlPage[0].split("-")[0],
                "index": htmlPage[1]
            }));
        } catch (e) {
            logging(e);
        }
    }

    // Main function to run the script
    function main() {
        setDebug();
        logging("init"); // Fixed quotation marks

        if (document.readyState === 'complete') {
            replaceCharInParagraphs();
		    getDetails();
        } else {
            // Use DOMContentLoaded for better reliability
            document.addEventListener('DOMContentLoaded', replaceCharInParagraphs);
            document.addEventListener('DOMContentLoaded', getDetails);
        }
    	logging(`ready`);
    }

    // Function to log messages
    function logging(message) {
        try {
            var logArea = document.getElementById('logArea'); // Fixed missing parentheses
            var logEntry = document.createElement('div');
            logEntry.textContent = new Date().toLocaleTimeString() + ': ' + message;
            logArea.insertBefore(logEntry, logArea.firstChild);
        } catch (e) {
            return;
        }
    }

    // Function to set up the debug log area
    function setDebug() {
        var logArea = document.createElement('div');
        logArea.id = 'logArea';
        logArea.style.position = 'fixed';
        logArea.style.bottom = '0';
        logArea.style.width = '100%';
        logArea.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        logArea.style.color = 'white';
        logArea.style.zIndex = '9999';
        logArea.style.overflowY = 'scroll';
        logArea.style.maxHeight = '200px';
        logArea.style.padding = '10px';
        logArea.style.boxSizing = 'border-box';
        logArea.style.fontSize = '12px';
        document.body.appendChild(logArea);
    }

    // Function to replace characters in <p> elements
    function replaceCharInParagraphs() {
	logging(`replaceCharInParagraphs - start`);
       var paragraphs = document.getElementsByTagName('p');
        for (var i = 0; i < paragraphs.length; i++) {
            paragraphs[i].textContent = paragraphs[i].textContent.replace(/曰/g, '日');
            paragraphs[i].textContent = paragraphs[i].textContent.replace(/……+/g, '……').replace(/——+/g, '——').replace(/\s?[Wωшw]{3}(.*)[￠CC]\s?[ΟO0]\n/g, '');
        }
	logging(`replaceCharInParagraphs - end`);
   }

  // Run the main function
    main();
})();
