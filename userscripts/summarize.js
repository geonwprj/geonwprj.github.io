// ==UserScript==
// @name         Summarize
// @version      0.2
// @description  Summarize content
// @match        *://*/*
// @updateURL    https://raw.githubusercontent.com/geonwprj/geonwprj.github.io/main/userscripts/summarize.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Function to save configuration to localStorage
    function saveConfig(apiUrl, headers) {
        localStorage.setItem('apiUrl', apiUrl);
        localStorage.setItem('headers', JSON.stringify(headers));
    }

    // Function to load configuration from localStorage
    function loadConfig() {
        return {
            apiUrl: localStorage.getItem('apiUrl') || '',
            headers: JSON.parse(localStorage.getItem('headers')) || {}
        };
    }

    // Function to send captured content to the API
    function sendToApi(data) {
        const config = loadConfig();
        const apiUrl = config.apiUrl;
        const headers = config.headers;

        if (!apiUrl) {
            alert("API URL is not configured!");
            return;
        }

        if (!data.trim()) {
            alert("No content to send!");
            return;
        }

buttonContainer.style.display = 'none';
    summariesButton.innerHTML = '...'; // Icon for Summarize

        GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                ...headers // Spread operator to include any additional headers
            },
            data: JSON.stringify({
                "model": "gemini2.0",
                "messages": [
                    {"content": "Here is a content from a web page. Please summarize the content in Cantonese. Only show the Traditional Chinese text, no pinyin. No introduction or conclusion.", "role": "system"},
                    {"content": data, "role": "user"}
                ]
            }),
            onload: function(response) {

                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    const summaryContent = jsonResponse.choices[0].message.content;
                    alert(summaryContent);
                } catch (error) {
                    console.error('Error parsing JSON response:', error);
                    alert("Failed to parse response. Please check console for details.");
                }
    summariesButton.innerHTML = '📖'; // Icon for Summarize

            },
            onerror: function(error) {
               alert("Error sending data.");
    summariesButton.innerHTML = '📖'; // Icon for Summarize

            }
        });
    }

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
    summariesButton.innerHTML = '📖'; // Icon for Summarize
    summariesButton.addEventListener('click', () => {
        captureContent(); // Call captureContent when clicked
    });

    // Create the "Config" button
    const configButton = document.createElement('button');
    configButton.innerHTML = '⚙️'; // Icon for Config

    configButton.addEventListener('click', () => {
       const apiUrl = prompt("Enter API URL:", loadConfig().apiUrl||'');
        const headersInput = prompt("Enter Headers (JSON format):", JSON.stringify(loadConfig().headers || {}));
        
        try {
            const headers = JSON.parse(headersInput);
            saveConfig(apiUrl, headers);
            alert("Configuration saved!");
        } catch (e) {
            alert("Invalid headers format. Please enter valid JSON.");
        }
    });

    // Append buttons to the container
    buttonContainer.appendChild(summariesButton);
    buttonContainer.appendChild(configButton);

    // Append elements to the body
    document.body.appendChild(mainButton);
    document.body.appendChild(buttonContainer);

    // Toggle visibility of additional buttons on main button click
    mainButton.onclick = function() {
        buttonContainer.style.display = (buttonContainer.style.display === 'none') ? 'block' : 'none';
    };

   // Function to capture content from the page, excluding images, videos, and buttons
   function captureContent() {
       // Capture remaining text content from the body or specific sections
       const elementsToRemove = document.querySelectorAll('img, video, button'); 
       elementsToRemove.forEach(element => element.style.display = 'none'); // Hide unwanted elements

       const contentToCapture = document.body.innerText; // Get clean text without HTML tags

       sendToApi(contentToCapture); // Call function to send data

       // Restore removed elements after capturing (optional)
       elementsToRemove.forEach(element => element.style.display = '');

       console.log("Captured content without images, videos, and buttons.");        
   };

})();
