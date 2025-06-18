import React, { useState, useEffect } from "react";
import axios from "axios";
import { ObjetivoCard } from '../ObjetivoCard/ObjetivoCard';
import './Dashboard.css';

const Dashboard = () => {
    const [objetivos, setObjetivos] = useState([]);
    const API_URL = 'http://localhost:8080/api/objetivos';

    const fetchObjetivos = async () => {
        try {
            const response = await axios.get(API_URL);
            setObjetivos(response.data);
        } catch (error) {
            console.error("Erro ao buscar objetivos:", error);
        }
    };

    useEffect(() => {
        fetchObjetivos();
    }, []);

    const handleAddObjetivo = async () => {
        const titulo = prompt("Digite o nome do novo objetivo:");
        if (titulo) {
            try {
                await axios.post(API_URL, { titulo });
                fetchObjetivos();
            } catch (error) {
                console.error("Erro ao adicionar objetivo:", error);
            }
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Meus Objetivos</h1>
                <button className="add-objetivo-btn" onClick={handleAddObjetivo}>
                    + Criar Novo Objetivo
                </button>
            </header>
            <div className="objetivos-grid">
                {objetivos.map(objetivo => (
                    <ObjetivoCard
                        key={objetivo.id}
                        objetivoInicial={objetivo}
                        onUpdate={fetchObjetivos} // Passa a função para que o card possa atualizar a lista
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;