import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './tables.css';
import planningData from '../../data/Export salles AC.json';
import Canvas from '../plans/plans2.jsx';

// Composant principal Tables
const Tables = () => {
    // Déclarations des états
    const [data, setData] = useState([]); // Stocke les données de planning
    const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
    const [setError] = useState(false); // Indique si une erreur s'est produite
    const [selectedTeacher, setSelectedTeacher] = useState(''); // Enseignant sélectionné pour filtrage
    const [selectedProgram, setSelectedProgram] = useState(''); // Programme sélectionné pour filtrage
    const [filterActive, setFilterActive] = useState(true); // Active ou désactive le filtrage horaire
    const [isModalOpen, setIsModalOpen] = useState(false); // Contrôle l'ouverture de la fenêtre modale
    const [pointPosition, setPointPosition] = useState({ x: 0, y: 0 }); // Position du point à afficher sur le canvas
    const [selectedRoom, setSelectedRoom] = useState(''); // Salle sélectionnée

    // Positions spécifiques pour certaines salles sur le plan
    const roomPositions = {
        '35': { x: -500, y: 5 },
        '49': { x: -570, y: -130 },
        '131': { x: -415, y: 150 },
        '235': { x: -435, y: 90 },
        '340': { x: -380, y: 100 },
        '441': { x: -540, y: -80 },
    };

    // Chargement initial des données
    useEffect(() => {
        try {
            setData(planningData); // Chargement des données depuis le fichier JSON
            setLoading(false); // Indique que le chargement est terminé
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            setLoading(false); // Arrête le chargement même en cas d'erreur
            setError(true); // Indique une erreur
        }
    }, []);

    // Filtrage des cours en fonction de l'heure toutes les 60 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => prevData.filter(item => isCourseOngoing(item['Heure Debut'])));
        }, 60000);

        return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
    }, [filterActive]);

    // Vérifie si un cours est en cours ou commence dans les 30 prochaines minutes
    const isCourseOngoing = (courseStartTime) => {
        const [hours, minutes] = courseStartTime.split(':').map(Number); // Extraction des heures et minutes
        const startTime = new Date().setHours(hours, minutes, 0, 0); // Conversion en date
        const now = new Date().getTime(); // Heure actuelle
        const halfHourAfterStart = startTime + 30 * 60 * 1000; // Heure 30 minutes après le début
        return now < startTime || (now >= startTime && now <= halfHourAfterStart);
    };

    // Trie les données par heure de début
    const sortDataByStartTime = (data) => {
        return data.sort((a, b) => {
            const [aHours, aMinutes] = a['Heure Debut'].split(':').map(Number);
            const [bHours, bMinutes] = b['Heure Debut'].split(':').map(Number);
            return new Date().setHours(aHours, aMinutes, 0, 0) - new Date().setHours(bHours, bMinutes, 0, 0);
        });
    };

    // Filtre les données selon les critères sélectionnés
    const filteredData = sortDataByStartTime(data
        .filter(item => !filterActive || isCourseOngoing(item['Heure Debut'])) // Filtrage horaire
        .filter(item => selectedTeacher ? item['Intervenant'] === selectedTeacher : true) // Filtrage par enseignant
        .filter(item => selectedProgram ? item['Valeur brute champ,Libellé.Service'] === selectedProgram : true) // Filtrage par programme
    );

    // Gestion des clics sur les enseignants
    const handleTeacherClick = (teacher) => {
        setSelectedTeacher(teacher === selectedTeacher ? '' : teacher);
    };

    // Gestion des clics sur l'en-tête des enseignants (réinitialisation)
    const handleTeacherHeaderClick = () => {
        setSelectedTeacher('');
    };

    // Gestion des clics sur les programmes
    const handleProgramClick = (program) => {
        setSelectedProgram(program === selectedProgram ? '' : program);
    };

    // Gestion des clics sur l'en-tête des programmes (réinitialisation)
    const handleProgramHeaderClick = () => {
        setSelectedProgram('');
    };

    // Activation ou désactivation du filtrage horaire
    const toggleFilter = () => {
        setFilterActive(!filterActive);
    };

    // Ouverture de la fenêtre modale pour une salle donnée
    const openModal = (room) => {
        const newPosition = roomPositions[room] || { x: 0, y: 0 }; // Position du point sur le plan
        setPointPosition(newPosition);
        setSelectedRoom(room.toString());
        setIsModalOpen(true);
    };

    // Fermeture de la fenêtre modale
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Formate une heure au format "hh:mm"
    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    // Affiche un message de chargement si les données ne sont pas prêtes
    if (loading) {
        return <p className="loading-message">Chargement des données...</p>;
    }

    // Rendu du tableau des données
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
                        <th onClick={handleProgramHeaderClick} style={{ cursor: 'pointer', color: 'yellow' }}>
                            PROGRAM
                        </th>
                        <th>COURSE</th>
                        <th>ROOM</th>
                        <th onClick={handleTeacherHeaderClick} style={{ cursor: 'pointer', color: 'yellow' }}>
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
                                    color: item['Valeur brute champ,Libellé.Service'] === selectedProgram ? 'blue' : 'black',
                                }}
                            >
                                {item['Valeur brute champ,Libellé.Service']}
                            </td>
                            <td>{item['Nom du cours']}</td>
                            <td
                                onClick={() => openModal(item['Salle'])}
                                style={{ cursor: 'pointer', color: 'black' }}
                            >
                                {item['Salle']}
                            </td>
                            <td
                                onClick={() => handleTeacherClick(item['Intervenant'])}
                                style={{
                                    cursor: 'pointer',
                                    color: item['Intervenant'] === selectedTeacher ? 'blue' : 'black',
                                }}
                            >
                                {item['Intervenant']}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal pour afficher le plan avec le point positionné */}
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
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
                contentLabel="Canvas Modal"
            >
                <Canvas pointPosition={pointPosition} />
            </Modal>
        </div>
    );
};

export default Tables;
