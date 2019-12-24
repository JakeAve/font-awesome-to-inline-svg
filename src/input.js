const path = require('path');
const fs = require('fs');

const input = {
    htmlFiles: ["../input/something.html"],
    cssFiles: [],
    fontAwesomeDesktopRoot: "../fontawesome-free-5.9.0-desktop",
    fontAwesomeWebRoot: "",
    svgFolder: "",
    insertSvg: ""
}

const htmlFiles = input.htmlFiles;
const fontAwesomeDesktopRoot = input.fontAwesomeDesktopRoot;

htmlFiles.forEach(f => fs.readFile(f, 'utf8', (err, data) => {
    if (err)
        console.log(err);
    else {
        const matches = [...data.matchAll(/<i.*"(fa[bdlrs])\sfa-(.*)".*<\/i>/g)];
        // console.log(matches[0]);
        const fullPath = makeFullPath(fontAwesomeDesktopRoot);
        matches.forEach(m => {
            const folder = fullPath;
            const prefix = m[1];
            const name = m[2];
            const newPath = findSVG(folder, prefix, name);
            const data = fs.readFileSync(newPath, 'utf8');
            console.log(data);
        })
    }
}))

function makeFullPath(root) {
    const svgsFolder = path.join(root, "/fontawesome-free-5.9.0-desktop/svgs");
    return svgsFolder;
}

function findSVG(folder, prefix, name) {
    let subFolder = "";
    switch (prefix) {
        case "fas":
            subFolder = "solid";
            break;
        case "far":
            subFolder = "regular";
            break;
        case "fal":
            subFolder = "light";
            break;
        case "fad":
            subFolder = "duotone";
            break;
        case "fab":
            subFolder = "brands";
            break;
        default:
            console.log("error, you idiot");
    }
    const svgPath = path.join(folder, subFolder, `${name}.svg`);
    return svgPath;
}

