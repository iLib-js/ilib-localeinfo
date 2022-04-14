/*
 * locinfo.js - the overall loc info generator
 *
 * Copyright © 2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs';
import path from 'path';
import stringify from 'json-stable-stringify';
import { Utils } from 'ilib-data-utils';

import genClock from './clock';
import genCurrencies from './currencies';
import genDelimiters from './delimiters';
import genWeekData from './weekdata';
import genMeasurements from './measurements';
import genMeridiems from './meridiems';
import genPaperSizes from './papersizes';
import genNumbers from './numbers';
import genLanguages from './languages';
import genRegions from './regions';
import genScripts from './scripts';
import genLocales from './locales';

let root = {};

genClock(root);
genCurrencies(root);
genDelimiters(root);
genWeekData(root);
genMeasurements(root);
genMeridiems(root);
genNumbers(root);
genPaperSizes(root);
genLanguages(root);
genRegions(root);
genScripts(root);
genLocales(root); // should always be last

console.log("----------------");
console.log("root is:\n" + stringify(root, {space: 4}));

console.log("----------------");
console.log("Merging and pruning locale data...");

Utils.mergeAndPrune(root);

console.log("----------------");
console.log("\nWriting formats...");

function writeFile(dir, data) {
    const dirName = path.join("../locale", ...dir);
    const pathName = path.join(dirName, "localeinfo.json");

    console.log("Writing " + pathName);

    Utils.makeDirs(dirName);
    fs.writeFileSync(pathName, stringify(data, {space: 4}), "utf-8");
}

function write(names, root) {
    for (let property in root) {
        if (property === "data" && root.data && !Utils.isEmpty(root.data)) {
            writeFile(names, root.data);
        } else if (property !== "merged") {
           write(names.concat([property]), root[property]);
        }
    }
}

// write it all out to the individual files
write([], root);