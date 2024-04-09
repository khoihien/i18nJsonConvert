console.log('start')
const { readdir, readFile, open } = require('node:fs/promises');
const { readFileSync, writeFile } = require('fs')
require('dotenv').config();

async function convertTextToJson() {
    console.log(`[convertTextToJson] call`);
    const srcPath = __dirname + '/source';
    const descPath = __dirname + '/destination';
    const files = await readdir(__dirname + '/source');
    const keyLenght = +(process.env.KEY_LENGTH || 40)
    for await (const path of files) {
        console.log(path);
        // const data = fs.readFileSync(srcPath + '/' + path);
        // // const lines = await file.readLines();
        // console.log(`lines`, data);
        if (path.endsWith('.txt')) {
            const file = await open(srcPath + '/' + path);
            const textJson = {};
            for await (const line of file.readLines()) {
                console.log(line);
                const tmp = line.split('.')[0].replace(/[-.'?#!%&,]/g, '')
                let key = tmp.split(' ').join('_').toLowerCase();
                if (key.length > keyLenght) {

                    key = key.slice(0, keyLenght);
                }
                textJson[key] = line;
            }
            writeFile(descPath + '/' + path.replace('.txt', '.json'), JSON.stringify(textJson), (value) => {
                console.log(`writeFile`, value);
            })
        } else {
            console.log(`${path} not text file`);
        }

    }
    console.log(`[convertTextToJson] done`);
}

convertTextToJson();
