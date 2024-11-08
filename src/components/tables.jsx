import { useEffect, useState } from 'react';
import './styles/tables.css';
import planningData from '../data/planning.json';

const Tables = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState('');

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

    // Extraire la liste des professeurs sans doublons
    const teachers = [...new Set(planningData.map(item => item.TEACHER))];

    // Filtrer les cours par le professeur sélectionné
    const filteredData = selectedTeacher
        ? data.filter(item => item.TEACHER === selectedTeacher)
        : data;

    const handleTeacherChange = (event) => {
        setSelectedTeacher(event.target.value);
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
            <div className="filter-container">
                <label htmlFor="teacher-select">Filtrer par professeur :</label>
                <select
                    id="teacher-select"
                    value={selectedTeacher}
                    onChange={handleTeacherChange}
                >
                    <option value="">Tous les professeurs</option>
                    {teachers.map((teacher, index) => (
                        <option key={index} value={teacher}>{teacher}</option>
                    ))}
                </select>
            </div>
            <table className="data-table">
                <thead>
                <tr>
                    <th>TIME</th>
                    <th>PROGRAM</th>
                    <th>COURSE</th>
                    <th>ROOM</th>
                    <th>TEACHER</th>
                </tr>
                </thead>
                <tbody>
                {filteredData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                        <td>{item.TIME}</td>
                        <td>{item.PROGRAM}</td>
                        <td>{item.COURSE}</td>
                        <td>{item.ROOM}</td>
                        <td>{item.TEACHER}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tables;
