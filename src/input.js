const path = require('path');
const fs = require('fs');

const input = {
    htmlFiles: ["../input/something.html"],
    cssFiles: [],
    fontAwesomeDesktopRoot: "../fontawesome-free-5.9.0-desktop",
    fontAwesomeWebRoot: "",
    svgFolder: "",
    insertSvgTag: true,
    htmlOutput: ['../output/something.html']
}

const htmlFiles = input.htmlFiles;
const fontAwesomeDesktopRoot = input.fontAwesomeDesktopRoot;
const insertSvgTag = input.insertSvgTag;
const svgFolder = input.svgFolder;

function findIconsInHTML(HTMLData) {
    const matches = [...HTMLData.matchAll(/<i.*"(fa[bdlrs])\sfa-(.*)".*<\/i>/g)];
    const fullPath = makeFullPath(fontAwesomeDesktopRoot);
    const icons = matches.map((m, i) => {
        const folder = fullPath;
        const svgPath = findSVG(folder, m[1], m[2]);
        const dataPromise = new Promise((resolve, reject) => {
            fs.readFile(svgPath, 'utf8', (err, data) => {
                if (err)
                    reject(err);
                else resolve(data);
            });
        })
            .then(res => {
                icons[i].data = res;
            })
            .catch(err => console.log(err));
        return { ...m, folder, svgPath, dataPromise }
    })
    const promises = icons.map(icon => icon.dataPromise);
    return Promise.all(promises).then(() => icons).catch(err => console.log(err));
}

function readHTMLFiles() {
    htmlFiles.forEach(f => fs.readFile(f, 'utf8', async (err, data) => {
        if (err)
            console.log(err);
        else {
            const icons = await findIconsInHTML(data);
            findAndReplace(icons, {insertSvgTag, svgFolder})
        }
    }))
}

readHTMLFiles();

function findAndReplace(icons, {insertSvgTag, svgsFolder}) {
    let htmlData = icons[0].input;
    if (insertSvgTag) {
        icons.forEach(icon => {
            htmlData = htmlData.replace(icon[0], icon.data);
        })
    }
    // console.log(htmlData);
    fs.mkdir(path.dirname(input.htmlOutput[0]), {recursive: true}, err => {
        if (err) console.log(err)
        fs.writeFile(input.htmlOutput[0], htmlData, (err) => {
            if (err) console.log(err);
        })
    })
}

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
            console.error('Error');
    }
    const svgPath = path.join(folder, subFolder, `${name}.svg`);
    return svgPath;
}
