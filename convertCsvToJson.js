import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const convertCsvToJson = async () => {
    const filePath = path.join(path.resolve(), 'src/data/Export salles AC.csv');
    const csvText = fs.readFileSync(filePath, 'utf8');

    Papa.parse(csvText, {
        header: true,
        complete: function(results) {
            const jsonFileName = 'Export salles AC.json';
            const jsonDirPath = path.join(path.resolve(), 'src/data');
            const jsonFilePath = path.join(jsonDirPath, jsonFileName);

            // Ensure the data directory exists
            if (!fs.existsSync(jsonDirPath)) {
                fs.mkdirSync(jsonDirPath, { recursive: true });
            }

            fs.writeFileSync(jsonFilePath, JSON.stringify(results.data, null, 2));
            console.log('File saved successfully at:', jsonFilePath);
        }
    });
};

convertCsvToJson();