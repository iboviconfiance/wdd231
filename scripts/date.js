// Dynamically set current year
const yearSpan = document.getElementById("currentyear");
yearSpan.textContent = new Date().getFullYear();

// Dynamically set last modified date
const lastModified = document.getElementById("lastModified");
lastModified.textContent = `Last Modified: ${document.lastModified}`;