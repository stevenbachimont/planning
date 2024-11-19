import Papa from "papaparse";

export default function CsvToJson() {
    const saveFile = async (data, fileName) => {
        const filePath = `data/${fileName}`;
        try {
            const writable = await window.showSaveFilePicker({
                suggestedName: filePath,
                types: [{
                    description: 'JSON Files',
                    accept: {'application/json': ['.json']},
                }],
            });
            const writableStream = await writable.createWritable();
            await writableStream.write(new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}));
            await writableStream.close();
            console.log('File saved successfully.');
        } catch (err) {
            console.error('Error saving file:', err);
        }
    };

    const fetchCsvFile = async (filePath) => {
        const response = await fetch(filePath);
        const csvText = await response.text();
        return csvText;
    };

    const handleFileChange = async () => {
        const filePath = "src/data/Export salles AC.csv";
        const csvText = await fetchCsvFile(filePath);
        Papa.parse(csvText, {
            header: true,
            complete: async function(results) {
                console.log("Finished:", results.data);
                const jsonFileName = "specific_name.json"; // Specify your desired file name here
                await saveFile(results.data, jsonFileName);
            }
        });
    };

    return (
        <div className="App">
            <button onClick={handleFileChange}>Convert CSV to JSON</button>
        </div>
    );
}