// ==UserScript==
// @name         Q&A button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add Q&A button for every web. Powered by OpenAI
// @match        *://*/*  // Adjust this to your specific website
// @inject-into  content
// @grant        GM_xmlhttpRequest
// @updateURL	https://raw.githubusercontent.com/geonwprj/geonwprj.github.io/main/userscripts/qna-button.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the main button with a question mark icon
    const mainButton = document.createElement('button');
    mainButton.style.position = 'fixed';
    mainButton.style.bottom = '20px';
    mainButton.style.right = '20px';
    mainButton.style.zIndex = '1000';
    mainButton.innerHTML = '❓'; // Unicode for question mark icon
    mainButton.style.fontSize = '24px';
    mainButton.style.border = 'none';
    mainButton.style.backgroundColor = 'transparent';
    mainButton.style.cursor = 'pointer';

    // Create a container for the additional buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '70px'; // Position above the main button
    buttonContainer.style.right = '20px';
    buttonContainer.style.zIndex = '1000';
    buttonContainer.style.display = 'none'; // Initially hidden

    // Create the "Summaries" button
    const summariesButton = document.createElement('button');
    summariesButton.innerHTML = 'Summaries'; // You can replace with an icon if desired
    summariesButton.onclick = function() {
        alert('Summaries clicked!'); // Replace with your functionality
    };

    // Create the "Config" button
    const configButton = document.createElement('button');
    configButton.innerHTML = 'Config'; // You can replace with an icon if desired
    configButton.onclick = function() {
        alert('Config clicked!'); // Replace with your functionality
    };

    // Append buttons to the container
    buttonContainer.appendChild(summariesButton);
    buttonContainer.appendChild(configButton);

    // Append elements to the body
    document.body.appendChild(mainButton);
    document.body.appendChild(buttonContainer);

    // Toggle visibility of additional buttons on main button click
    mainButton.onclick = function() {
        if (buttonContainer.style.display === 'none') {
            buttonContainer.style.display = 'block';
        } else {
            buttonContainer.style.display = 'none';
        }
    };
})();
