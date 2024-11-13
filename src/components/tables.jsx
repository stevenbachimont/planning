import { useEffect, useState } from 'react';
import './styles/tables.css';
import planningData from '../data/planning.json';

const Tables = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedCampus, setSelectedCampus] = useState('');
    const [filterActive, setFilterActive] = useState(true);

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

    if (loading) {
        return <p className="loading-message">Chargement des données...</p>;
    }

    {/* } if (error) {
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
    }*/}

    return (
        <div className="table-container">
            <h1>Planning</h1>
            <button onClick={toggleFilter}>
                {filterActive ? 'Désactiver le filtrage horaire' : 'Activer le filtrage haoraire'}
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
                        <th onClick={handleCampusHeaderClick} style={{cursor: 'pointer', color: 'yellow'}}>
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
                            <td>{item.ROOM}</td>
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
        </div>
    );
}

export default Tables;