import { useEffect, useState } from 'react';
import './styles/tables.css';

const Tables = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch('https://api.example.com/data')
            .then(response => response.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
                setLoading(false);
                setError(true);
            });
    }, []);

    if (loading) {
        return <p className="loading-message">Chargement des données...</p>;
    }

    if (error) {
        return (
            <div className="table-container">
                <table className="error-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Statut</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="row-red">
                        <td>1</td>
                        <td>Erreur</td>
                        <td>Non disponibles</td>
                    </tr>
                    <tr className="row-yellow">
                        <td>2</td>
                        <td>Erreur</td>
                        <td>Non disponible</td>
                    </tr>
                    <tr className="row-green">
                        <td>3</td>
                        <td>Erreur</td>
                        <td>Non disponible</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Statut</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td className={item.status === 'active' ? 'status-active' : 'status-inactive'}>
                            {item.status}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tables;
