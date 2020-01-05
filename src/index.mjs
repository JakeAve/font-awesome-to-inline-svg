import path from "path";
import fs from "fs";
import input from "./input.mjs";

const __dirname = path.resolve();
process.chdir(__dirname);

// const htmlFiles = input.htmlFiles;
// const fontAwesomeDesktopRoot = input.fontAwesomeDesktopRoot;
// const insertSvgTag = input.insertSvgTag;
// const svgFolder = input.svgFolder;

const { htmlFiles, fontAwesomeDesktopRoot, fontAwesomeWebRoot, insertSvgTag } = input;

function findIconsInHTML(HTMLData) {
    const matches = [...HTMLData.matchAll(/<i.*"(fa[bdlrs])\sfa-(.*)".*<\/i>/g)];
    const svgsFolder = fontAwesomeDesktopRoot ? path.join(fontAwesomeDesktopRoot, "/fontawesome-free-5.9.0-desktop/svgs") : path.join(fontAwesomeWebRoot, "/fontawesome-free-5.9.0-web/svgs");
    const icons = matches.map((m, i) => {
        const fullSvgPath = makeFullFAPath(svgsFolder, m[1], m[2]);
        const dataPromise = new Promise((resolve, reject) => {
            fs.readFile(fullSvgPath, 'utf8', (err, data) => {
                if (err)
                    reject(err);
                else resolve(data);
            });
        })
            .then(res => {
                icons[i].data = res;
            })
            .catch(err => console.error(err));
        return { ...m, fullSvgPath, dataPromise }
    })
    const promises = icons.map(icon => icon.dataPromise);
    return Promise.all(promises).then(() => icons).catch(err => console.error(err));
}

function readHTMLFiles() {
    htmlFiles.forEach(f => fs.readFile(f, 'utf8', async (err, data) => {
        if (err)
            console.error(err);
        else {
            const icons = await findIconsInHTML(data);
            findAndReplace(icons, { insertSvgTag })
        }
    }))
}

readHTMLFiles();

function findAndReplace(icons, { insertSvgTag }) {
    let htmlData = icons[0].input;
    if (insertSvgTag) {
        icons.forEach((icon) => {
            htmlData = htmlData.replace(icon[0], icon.data);
        })
    }
    fs.mkdir(path.dirname(input.htmlOutput[0]), { recursive: true }, (err) => {
        if (err) console.error(err)
        fs.writeFile(input.htmlOutput[0], htmlData, (err) => {
            if (err) console.error(err);
        })
    })
}

function makeFullFAPath(svgsFolder, prefix, name) {
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
            console.error(`Unknown FontAwesome prefix: ${prefix}`);
    }
    const svgPath = path.join(svgsFolder, subFolder, `${name}.svg`);
    return svgPath;
}
