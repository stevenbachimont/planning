import { useEffect, useState } from 'react';
import './styles/tables.css';
import planningData from '../data/planning.json';

const Tables = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedCampus, setSelectedCampus] = useState('');

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

    const filteredData = selectedTeacher
        ? data.filter(item => item.TEACHER === selectedTeacher)
        : selectedCampus
            ? data.filter(item => item.CAMPUS === selectedCampus)
            : data;


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
            <table className="data-table">
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
                        <td>{item.PROGRAMME}</td>
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
    );
};

export default Tables;
