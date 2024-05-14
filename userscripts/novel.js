// ==UserScript==
// @name         Content Character Replacer for bg3.co
// @description  Replace '曰' with '日' in <p> elements
// @match        https://www.bg3.co/novel/pagea/*
// @updateURL    https://raw.githubusercontent.com/geonwprj/geonwprj.github.io/main/userscripts/novel.js
// @version      0.1
// ==/UserScript==

(function() {
    'use strict';

    // Main function to run the script
    function main() {
//        setDebug();
        logging("init"); // Fixed quotation marks
        window.addEventListener('load', replaceCharInParagraphs);
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
        var paragraphs = document.getElementsByTagName('p');
        for (var i = 0; i < paragraphs.length; i++) {
            paragraphs[i].textContent = paragraphs[i].textContent.replace(/曰/g, '日');
            paragraphs[i].textContent = paragraphs[i].textContent.replace(/……+/g, '……').replace(/——+/g, '——');
        }
    }

  // Run the main function
    main();
})();
