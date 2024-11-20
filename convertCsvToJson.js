import fs from 'fs';
import path from 'path';
import iconv from 'iconv-lite';
import Papa from 'papaparse';
import cron from "node-cron";

const convertCsvToJson = async () => {
    const filePath = path.join(path.resolve(), 'src/data/Export salles AC.csv');


    const buffer = fs.readFileSync(filePath);


    const csvText = iconv.decode(buffer, 'ISO-8859-1');
    Papa.parse(csvText, {
        header: true,
        complete: function (results) {
            const jsonFileName = 'Export salles AC.json';
            const jsonDirPath = path.join(path.resolve(), 'src/data');
            const jsonFilePath = path.join(jsonDirPath, jsonFileName);

            if (!fs.existsSync(jsonDirPath)) {
                fs.mkdirSync(jsonDirPath, { recursive: true });
            }

            const bom = '\uFEFF';
            const jsonData = JSON.stringify(results.data, null, 2);
            fs.writeFileSync(jsonFilePath, bom + jsonData, 'utf8');
            console.log('File saved successfully at:', jsonFilePath);
        }
    });
};

convertCsvToJson();

{/*
cron.schedule('0 2 * * *', () => {
    console.log('Running convertCsvToJson at 2:00 AM');
    convertCsvToJson();
});
*/}
