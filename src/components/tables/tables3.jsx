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
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

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

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timeInterval);
    }, []);

    const isCourseOngoing = (courseStartTime) => {
        const [hours, minutes] = courseStartTime.split(':').map(Number);
        const startTime = new Date().setHours(hours, minutes, 0, 0);
        const now = new Date().getTime();
        const halfHourAfterStart = startTime + 30 * 60 * 1000;
        return now < startTime || (now >= startTime && now <= halfHourAfterStart);
    };

    const sortDataByStartTime = (data) => {
        return data.sort((a, b) => {
            const [aHours, aMinutes] = a['Heure Debut'].split(':').map(Number);
            const [bHours, bMinutes] = b['Heure Debut'].split(':').map(Number);
            return new Date().setHours(aHours, aMinutes, 0, 0) - new Date().setHours(bHours, bMinutes, 0, 0);
        });
    };

    const filteredData = sortDataByStartTime(data
        .filter(item => !filterActive || isCourseOngoing(item['Heure Debut']))
        .filter(item => selectedTeacher ? item['Intervenant'] === selectedTeacher : true)
        .filter(item => selectedProgram ? item['Valeur brute champ,Libellé.Service'] === selectedProgram : true)
    );

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

    const formatTime = (startTime, endTime) => {
        const [startHours, startMinutes] = startTime.split(':');
        const [endHours, endMinutes] = endTime.split(':');
        return (
            <span>
            <span style={{ color: 'rgba(246,213,2,0.97)', fontWeight: 700 }}>{`${startHours}:${startMinutes}`}</span>
            <span style={{ color: 'rgba(244,244,243,0.97)', fontSize: '0.8em' }}>{` - ${endHours}:${endMinutes}`}</span>
        </span>
        );
    };

    if (loading) {
        return <p className="loading-message">Chargement des données...</p>;
    }

    return (
        <div className="table-container">
            <h1>Atlantic Campus <span style={{ color: 'rgba(246,213,2,0.97)', fontSize: '2rem', fontWeight: 'bold' }}>{currentTime}</span></h1>
            <button className="filtre" onClick={toggleFilter}>
                {filterActive ? 'Désactiver le filtrage horaire' : 'Activer le filtrage horaire'}
            </button>
            <div className="table-scroll">
                <table className="data-table fixed-width-table fixed-header">
                    <thead>
                    <tr>
                        <th className="column-time">TIME</th>
                        <th className="column-program" onClick={handleProgramHeaderClick} style={{cursor: 'pointer'}}>
                            PROGRAM
                        </th>
                        <th className="column-course">COURSE</th>
                        <th className="column-room">ROOM</th>
                        <th className="column-teacher" onClick={handleTeacherHeaderClick} style={{cursor: 'pointer'}}>
                            TEACHER
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                            <td className="column-time">{formatTime(item['Heure Debut'], item['Heure Fin'])}</td>
                            <td
                                className={`scrollable-text column-program ${item['Valeur brute champ,Libellé.Service'].length > 20 ? 'scroll' : ''}`}
                                onClick={() => handleProgramClick(item['Valeur brute champ,Libellé.Service'])}
                                style={{cursor: 'pointer'}}
                            >
                                <span>{item['Valeur brute champ,Libellé.Service']}</span>
                            </td>
                            <td
                                className={`scrollable-text column-course ${item['Nom du cours'].length > 20 ? 'scroll' : ''}`}
                            >
                                <span>{item['Nom du cours']}</span>
                            </td>                            <td className="column-room "
                                onClick={() => openModal(item['Salle'])}
                                style={{cursor: 'pointer', color: 'rgba(246,213,2,0.97)', fontWeight: 700}}
                            >
                                {item['Salle']}
                            </td>
                            <td
                                className={`scrollable-text column-teacher ${item['Intervenant'].length > 20 ? 'scroll' : ''}`}
                                onClick={() => handleTeacherClick(item['Intervenant'])}
                                style={{cursor: 'pointer'}}
                            >
                                <span>{item['Intervenant']}</span>
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