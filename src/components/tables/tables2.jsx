import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './tables.css';
import Canvas from '../plans/plans.jsx';
import CsvToJson from '../CsvToJson/CsvToJson.jsx';

const Tables = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedCampus, setSelectedCampus] = useState('');
    const [filterActive, setFilterActive] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 });
    const [selectedRoom, setSelectedRoom] = useState('');

    const roomPositions = {
        '35': { x: -500, y: 5 },
        '49': { x: -570, y: -130 },
        '131': { x: -415, y: 150 },
        '235': { x: -435, y: 90 },
        '340': { x: -380, y: 100 },
        '441': { x: -540, y: -80 },
    };

    useEffect(() => {
        console.log('Début du chargement des données...');
        const fetchData = async () => {
            try {
                console.log('Tentative de récupération du fichier CSV...');
                const csvFilePath = '/path/to/your/planning.csv'; // Remplace par le chemin correct
                const jsonData = await CsvToJson(csvFilePath); // Conversion CSV en JSON
                console.log('Données JSON après conversion:', jsonData);

                const formattedData = jsonData.map(item => ({
                    ...item,
                    TIME: item.TIME.replace(/:/g, ':') // Transformation des heures
                }));

                console.log('Données formatées:', formattedData);
                setData(formattedData);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
                setLoading(false);
                setError(true);
            }
        };
        fetchData();
    }, []);



    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => prevData.filter(item => isCourseOngoing(item.TIME)));
        }, 60000);

        return () => clearInterval(interval);
    }, [filterActive]);

    const isCourseOngoing = (courseTime) => {
        const [startTime] = courseTime.split(' - ').map(time => {
            const [hours, minutes] = time.split(':').map(Number);
            return new Date().setHours(hours, minutes, 0, 0);
        });
        const now = new Date().getTime();
        const halfHourAfterStart = startTime + 30 * 60 * 1000;
        return now < startTime || (now >= startTime && now <= halfHourAfterStart);
    };

    const filteredData = data
        .filter(item => !filterActive || isCourseOngoing(item.TIME))
        .filter(item => selectedTeacher ? item.TEACHER === selectedTeacher : true)
        .filter(item => selectedCampus ? item.CAMPUS === selectedCampus : true);

    const handleTeacherClick = (teacher) => {
        setSelectedTeacher(teacher === selectedTeacher ? '' : teacher);
    };

    const handleTeacherHeaderClick = () => {
        setSelectedTeacher('');
    };

    const handleCampusClick = (campus) => {
        setSelectedCampus(campus === selectedCampus ? '' : campus);
    };

    const handleCampusHeaderClick = () => {
        setSelectedCampus('');
    };

    const toggleFilter = () => {
        setFilterActive(!filterActive);
    };

    const openModal = (room) => {
        const newPosition = roomPositions[room] || { x: 0, y: 0 };
        setPointPosition(newPosition);
        setIsModalOpen(true);
        setSelectedRoom(room);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <p className="loading-message">Chargement des données...</p>;
    }

    if (error) {
        return (
            <div className="table-container">
                <table className="error-table">
                    <thead>
                    <tr>
                        <th>TIME</th>
                        <th>PROGRAM</th>
                        <th>COURSE</th>
                        <th>ROOM</th>
                        <th>TEACHER</th>
                        <th>CAMPUS</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="row-red">
                        <td colSpan="5">Erreur : Données non disponibles</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="table-container">
            <h1>Planning</h1>
            <button onClick={toggleFilter}>
                {filterActive ? 'Désactiver le filtrage horaire' : 'Activer le filtrage horaire'}
            </button>
            <div className="table-scroll">
                <table className="data-table fixed-width-table fixed-header">
                    <thead>
                    <tr>
                        <th>TIME</th>
                        <th>PROGRAM</th>
                        <th>COURSE</th>
                        <th>ROOM</th>
                        <th onClick={handleTeacherHeaderClick} style={{ cursor: 'pointer', color: 'yellow' }}>
                            TEACHER
                        </th>
                        <th onClick={handleCampusHeaderClick} style={{ cursor: 'pointer', color: 'yellow' }}>
                            CAMPUS
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                            <td>{item.TIME}</td>
                            <td>{item.PROGRAM}</td>
                            <td>{item.COURSE}</td>
                            <td
                                onClick={() => openModal(item.ROOM)}
                                style={{ cursor: 'pointer', color: 'black' }}
                            >
                                {item.ROOM}
                            </td>
                            <td
                                onClick={() => handleTeacherClick(item.TEACHER)}
                                style={{ cursor: 'pointer', color: item.TEACHER === selectedTeacher ? 'blue' : 'black' }}
                            >
                                {item.TEACHER}
                            </td>
                            <td
                                onClick={() => handleCampusClick(item.CAMPUS)}
                                style={{ cursor: 'pointer', color: item.CAMPUS === selectedCampus ? 'blue' : 'black' }}
                            >
                                {item.CAMPUS}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '0px',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
                contentLabel="Canvas Modal"
            >
                <Canvas pointPosition={pointPosition} room={selectedRoom} />
            </Modal>
        </div>
    );
};

export default Tables;
