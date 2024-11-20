import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './tables.css';
import planningData from '../../data/Export salles AC.json';
import Canvas from '../plans/plans2.jsx';

const Tables = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [setError] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
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
        try {
            setData(planningData);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            setLoading(false);
            setError(true);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => prevData.filter(item => isCourseOngoing(item['Heure Debut'])));
        }, 60000);

        return () => clearInterval(interval);
    }, [filterActive]);

    const isCourseOngoing = (courseStartTime) => {
        const [hours, minutes] = courseStartTime.split(':').map(Number);
        const startTime = new Date().setHours(hours, minutes, 0, 0);
        const now = new Date().getTime();
        const halfHourAfterStart = startTime + 30 * 60 * 1000;
        return now < startTime || (now >= startTime && now <= halfHourAfterStart);
    };

    const filteredData = data
        .filter(item => !filterActive || isCourseOngoing(item['Heure Debut']))
        .filter(item => selectedTeacher ? item['Intervenant'] === selectedTeacher : true)
        .filter(item => selectedProgram ? item['Valeur brute champ,Libellé.Service'] === selectedProgram : true);

    const handleTeacherClick = (teacher) => {
        setSelectedTeacher(teacher === selectedTeacher ? '' : teacher);
    };

    const handleTeacherHeaderClick = () => {
        setSelectedTeacher('');
    };

    const handleProgramClick = (program) => {
        setSelectedProgram(program === selectedProgram ? '' : program);
    };

    const handleProgramHeaderClick = () => {
        setSelectedProgram('');
    };

    const toggleFilter = () => {
        setFilterActive(!filterActive);
    };

    const openModal = (room) => {
        const newPosition = roomPositions[room] || { x: 0, y: 0 };
        setPointPosition(newPosition);
        setSelectedRoom(room.toString());
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    if (loading) {
        return <p className="loading-message">Chargement des données...</p>;
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
                        <th onClick={handleProgramHeaderClick} style={{cursor: 'pointer', color: 'yellow'}}>
                            PROGRAM
                        </th>
                        <th>COURSE</th>
                        <th>ROOM</th>
                        <th onClick={handleTeacherHeaderClick} style={{cursor: 'pointer', color: 'yellow'}}>
                            TEACHER
                        </th>

                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                            <td>{`${formatTime(item['Heure Debut'])} - ${formatTime(item['Heure Fin'])}`}</td>
                            <td
                                onClick={() => handleProgramClick(item['Valeur brute champ,Libellé.Service'])}
                                style={{
                                    cursor: 'pointer',
                                    color: item['Valeur brute champ,Libellé.Service'] === selectedProgram ? 'blue' : 'black'
                                }}
                            >
                                {item['Valeur brute champ,Libellé.Service']}</td>
                            <td>{item['Nom du cours']}</td>
                            <td
                                onClick={() => openModal(item['Salle'])}
                                style={{cursor: 'pointer', color: 'black'}}
                            >
                                {item['Salle']}
                            </td>
                            <td
                                onClick={() => handleTeacherClick(item['Intervenant'])}
                                style={{
                                    cursor: 'pointer',
                                    color: item['Intervenant'] === selectedTeacher ? 'blue' : 'black'
                                }}
                            >
                                {item['Intervenant']}
                            </td>
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
                <Canvas pointPosition={pointPosition} room={selectedRoom}/>
            </Modal>
        </div>
    );
}

export default Tables;