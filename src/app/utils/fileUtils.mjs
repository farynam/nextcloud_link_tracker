import fs from "fs";
import path from "path";


export function saveAsJSON(outPutFileName, dataObj, messageOut) {
    var newData2 = JSON.stringify(dataObj);
    saveToFile(outPutFileName, newData2, messageOut);
}    

export function saveToFile(outPutFileName, text, messageOut) {
    const dir = path.dirname(outPutFileName);

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    fs.writeFileSync(outPutFileName, text, (err) => {
        if (err) {
            throw err;
        }
        messageOut(`created file:${outPutFileName}`);
    });
}

export function readJSON(fileName) {
    if (fs.existsSync(fileName)) {
        // Read the JSON file synchronously
        const data = fs.readFileSync(fileName, 'utf8');
    
        // Parse the JSON data into a JavaScript object
        return JSON.parse(data);
    }

    return null;
}

export function getFileList(inputFilesDir) {
    const fileList = [];
    fs.readdirSync(inputFilesDir).forEach( async file => {
        fileList.push(file);
    });
    return fileList.sort();
}

export function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
}

export function rmDir(dirPath, force) {
    if (isEmpty(dirPath) || force) {
        fs.rmSync(dirPath, { recursive: true });
    }
}