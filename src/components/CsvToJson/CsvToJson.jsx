// CsvToJson.jsx
import Papa from 'papaparse';

const CsvToJson = async (csvFile) => {
    return new Promise((resolve, reject) => {
        Papa.parse(csvFile, {
            header: true,
            delimiter: ';',
            complete: (result) => {
                console.log("Données brutes après parsing:", result);
                if (result.errors.length) {
                    reject(result.errors);
                } else {
                    const jsonData = result.data.map(item => ({
                        TIME: `${item['Heure Debut']} - ${item['Heure Fin']}`,
                        ROOM: item['Salle'] || '',
                        PROGRAM: item['Nom du cours'] || '',
                        TEACHER: item['Intervenant'] || '',
                        COURSE: item['Valeur brute champ'] || '',
                    }));
                    console.log("Données JSON après formatage:", jsonData);
                    resolve(jsonData);
                }
            },
            error: (error) => reject(error),
        });
    });
};

export default CsvToJson;
