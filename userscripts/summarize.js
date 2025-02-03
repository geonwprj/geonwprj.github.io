// ==UserScript==
// @name         My Custom Button Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to capture content and send to an API
// @include      https://example.com/*  // Change this to your target website(s)
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

        GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                ...headers // Spread operator to include any additional headers
            },
            data: JSON.stringify({ content: data }),
            onload: function(response) {
                console.log('Response:', response.responseText);
                alert("Data sent successfully!");
            },
            onerror: function(error) {
                console.error('Error:', error);
                alert("Error sending data.");
            }
        });
    }

    // Create and append the main button to capture content
    const button = document.createElement('button');
    button.innerText = 'Send Content';
    button.style.position = 'fixed'; // Make it fixed position for easy access
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        const content = document.body.innerText; // Capture content
        sendToApi(content); // Call function to send data
    });

    // Create and append the configuration button
    const configButton = document.createElement('button');
    configButton.innerText = 'Configure API';
    configButton.style.position = 'fixed'; // Make it fixed position for easy access
    configButton.style.bottom = '60px';
    configButton.style.right = '20px';
    configButton.style.zIndex = '1000';
    document.body.appendChild(configButton);

    configButton.addEventListener('click', () => {
        const apiUrl = prompt("Enter API URL:", loadConfig().apiUrl);
        const headersInput = prompt("Enter Headers (JSON format):", JSON.stringify(loadConfig().headers));
        
        try {
            const headers = JSON.parse(headersInput);
            saveConfig(apiUrl, headers);
            alert("Configuration saved!");
        } catch (e) {
            alert("Invalid headers format. Please enter valid JSON.");
        }
    });

})();
