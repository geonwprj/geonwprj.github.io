// ==UserScript==
// @name         Content Character Replacer for bg3.co
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace '曰' with '日' in <p> elements
// @author       You
// @match        https://www.bg3.co/novel/pagea/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace characters in <p> elements
    function replaceCharInParagraphs() {
        // Get all <p> elements on the page
        var paragraphs = document.getElementsByTagName('p');
        for (var i = 0; i < paragraphs.length; i++) {
            // Replace '曰' with '日' in each paragraph
            if (i==0) alert(paragraphs[i]);
            paragraphs[i].textContent = paragraphs[i].textContent.replace(/曰/g, '日').replace(/……+/g, '……');
        }
    }

    // Run the replace function after the page content has loaded
    window.addEventListener('load', replaceCharInParagraphs);
})();
