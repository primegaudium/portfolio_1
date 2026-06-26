// Run this from your project root:
// node check-assets.js
// It prints the EXACT filenames Vercel will see (case-sensitive)

const fs = require("fs");
const path = require("path");

const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((e) => {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else console.log(full.replace(/\\/g, "/"));
    });
};

console.log("\n=== EXACT filenames in assets/ ===\n");
walk("assets");
console.log("\nCopy these paths exactly into slides-data.js\n");