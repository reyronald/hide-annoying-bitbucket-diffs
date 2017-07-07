// ==UserScript==
// @name         Hide Annoying BitBucket Diffs 
// @namespace    http://sagegerard.com
// @version      0.1
// @description  Hides bulky diff blocks for autogenerated files in BitBucket pull requests using RegExp patterns defined by clear-text resource
// @author       Sage Gerard
// @match        https://*.bitbucket.org/*/pull-requests/*
// @resource     ignorePatterns https://pastebin.com/raw/ScaepG5e
// @grant        GM_getResourceText
// ==/UserScript==

// Modified by Ronald Rey (reyronald@gmail.com)

(function() {
    'use strict';

    const textSource = `
.xsd$
.wsdl$
Reference.cs$
Reference.svcmap$
.datasource
.svg$
.jpg$
.bmp$
.png$
.gif$
.cur$
.eot$
.ttf$
.woff$
.resx$
package-lock.json
`.trim();

    const patterns = textSource.split(/\r?\n/).map((pattern) => new RegExp(pattern));

    const timer = setInterval(function() {
        const filesChanged = [...document.querySelectorAll('#commit-files-summary > li')].map(li => li.getAttribute('data-file-identifier'));
        const filesToRemove = filesChanged.filter(filename => patterns.some(re => re.test(filename)));

        if (filesChanged.length) {
            clearInterval(timer);

            setTimeout(function() {
                filesToRemove.forEach(filename => {
                    const diffBlock = document.querySelector(`section[data-identifier="${filename}"]`);
                    if (diffBlock !== null) {
                       diffBlock.remove();
                    }
                });
            }, 1000);
        }
    }, 500);
})();
