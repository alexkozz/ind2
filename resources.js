import { config, dataStruct } from './config.js';

export default class Resources { 
    importDataFromFiles(folder, extension, fileNames, struct) {
        return fileNames.reduce(async (parsedData, fileName) => {
            const filePath = `${folder}/${fileName}.${extension}`;
            const response = await fetch(filePath);
            
            if (response.ok) {
                const fileText = await response.text()
                const fileDataObject = this.parseTextToObject(fileText, struct);
                
                return {
                    ...await parsedData,
                    [fileDataObject.baseId]: fileDataObject
                }
            }
        }, {});
    }

    parseTextToObject(text, struct) {
        var dataObject = {};
        const lines = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].split('=').map((value) => value.trim());

            let lineProperty = line[0];

            if (!this.isValidLine(lineProperty)) {
                continue;
            }

            let path = struct[lineProperty];
 
            if (path === undefined) {
                continue;
            }

            let pathLastIndex = path.length - 1;
            let configProperty = path[pathLastIndex];
            let lineValue = line[1];

            if (lineValue == '') {
                continue;
            }

            path = path.slice(0, pathLastIndex);

            let dataObjectProperty = path.reduce((a, c) => {
                return a.hasOwnProperty(c) ? a[c] : Object.defineProperty(a, c, {
                    value: {},
                    configurable: true,
                    enumerable: true,
                    writable: true
                })[c];
            }, dataObject);

            dataObjectProperty[configProperty] = isNaN(+lineValue) ? lineValue : +lineValue;
        }

        return dataObject;
    }

    isValidLine(line) {
        if (!line) {
            return false;
        }

        return true;
    }

    importFiles(fileNames, callback) {
        /**
         * Импорт файлов
         * 
         * @param {array} data массив названий файлов: [fileName1, fileName2, ...]
        */

        const importedFiles = this.importDataFromFiles(config.folder, config.fileExtension, fileNames, dataStruct);

        importedFiles.then((value) => {
            callback(value);
        });
    }
}