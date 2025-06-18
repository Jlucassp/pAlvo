import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { TaskRow } from './TaskRow';
import './ObjetivoCard.css';

export const ObjetivoCard = ({ objetivoId }) => {
    const [objetivo, setObjetivo] = useState(null);
    const [globalProgress, setGlobalProgress] = useState(0);
    const API_URL = `http://localhost:8080/api/objetivos`;

    const fetchObjetivo = useCallback(async () => {
        if (!objetivoId) return;
        try {
            const response = await axios.get(`${API_URL}/${objetivoId}`);
            setObjetivo(response.data);
        } catch(error) {
            console.error("Erro ao buscar objetivo:", error);
            setObjetivo(null);
        }
    }, [objetivoId, API_URL]);

    useEffect(() => {
        fetchObjetivo();
    }, [fetchObjetivo]);

    useEffect(() => {
        if (!objetivo || !objetivo.subtarefas) {
            setGlobalProgress(objetivo?.isCompleted ? 100 : 0);
            return;
        }
        const total = objetivo.subtarefas.length;
        if (total === 0) {
            setGlobalProgress(objetivo.isCompleted ? 100 : 0);
            return;
        }
        const concluidas = objetivo.subtarefas.filter(t => t.isCompleted).length;
        setGlobalProgress(Math.round((concluidas / total) * 100));
    }, [objetivo]);

    const handleUpdateField = async (field, value) => {
        try {
            const response = await axios.put(`${API_URL}/${objetivo.id}`, { [field]: value });
            setObjetivo(prev => ({ ...prev, ...response.data }));
        } catch(error) {
            console.error(`Erro ao atualizar ${field}:`, error);
        }
    };

    const handleAddSubtask = async (parentTask) => {
        const titulo = prompt(`Digite a nova subtarefa para "${parentTask.titulo}":`);
        if (titulo) {
            try {
                const response = await axios.post(`${API_URL}/${objetivo.id}/subtarefas`, {
                    parentId: parentTask.id,
                    level: parentTask.level,
                    titulo: titulo,
                });
                setObjetivo(response.data);
            } catch (error) {
                console.error("Erro ao adicionar subtarefa:", error);
            }
        }
    };
    
    const handleDelete = async (taskToDelete) => {
        if (window.confirm(`Tem certeza que deseja excluir "${taskToDelete.titulo}"?`)) {
            try {
                const response = await axios.delete(`${API_URL}/${objetivo.id}/tarefas/${taskToDelete.id}`);
                setObjetivo(response.data);
            } catch (error) {
                console.error("Erro ao deletar:", error);
            }
        }
    };

    const handleToggleComplete = async (taskToToggle) => {
        try {
            const response = await axios.put(`${API_URL}/${objetivo.id}/tarefas/${taskToToggle.id}`, { 
                isCompleted: !taskToToggle.isCompleted 
            });
            setObjetivo(response.data);
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        }
    };
    
    if (!objetivo) {
        return <div className="objetivo-card">Carregando...</div>;
    }

    return (
        <div className="objetivo-card">
            <header className="m-card-header">
                <span className="m-card-tag editable" contentEditable suppressContentEditableWarning onBlur={e => handleUpdateField('tag', e.target.textContent)}>{objetivo.tag}</span>
                <div className="m-card-priority">
                    <div className="priority-icon-container">
                        <span className="priority-icon-symbol">!</span>
                    </div>
                    <div className="priority-text">
                        <span>Média</span>
                        <span>prioridade</span>
                    </div>
                </div>
            </header>
            <main className="m-card-body">
                <h2 className="editable" contentEditable suppressContentEditableWarning onBlur={e => handleUpdateField('titulo', e.target.textContent)}>{objetivo.titulo}</h2>
                <p className="editable" contentEditable suppressContentEditableWarning onBlur={e => handleUpdateField('descricao', e.target.textContent)}>{objetivo.descricao}</p>
                <button className="m-add-task-btn" onClick={() => handleAddSubtask(objetivo)}><span className="add-icon">+</span> Adicionar Tarefa</button>
                <ul className="m-task-list">
                    {objetivo.subtarefas && objetivo.subtarefas.map((tarefa) => (
                        <TaskRow key={tarefa.id} task={tarefa} onToggleComplete={handleToggleComplete} onAddSubtask={handleAddSubtask} onDeleteTask={handleDelete} />
                    ))}
                </ul>
            </main>
            <footer className="m-card-footer">
                <div className="m-global-progress-bar-container">
                    <div className="m-global-progress-bar-fill" style={{ width: `${globalProgress}%` }}></div>
                </div>
                <span className="m-global-percent">{globalProgress}%</span>
            </footer>
        </div>
    );
};