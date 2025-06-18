import React, { useState, useEffect } from 'react';
import './GoalCard.css';

// DADOS MODIFICADOS: Adicionamos a propriedade "isCompleted" em todas as tarefas
const initialData = [
  {
    id: 1,
    title: 'Tarefa 1',
    isOpen: false,
    subtasks: [
        { id: 11, title: 'Primeira subtarefa de 1', isCompleted: false },
        { id: 12, title: 'Segunda subtarefa de 1', isCompleted: false }
    ],
  },
  {
    id: 2,
    title: 'Tarefa 2',
    isOpen: true,
    subtasks: [
        { id: 21, title: 'Primeira subtarefa de 2', isCompleted: true },
        { id: 22, title: 'Segunda subtarefa de 2', isCompleted: false }
    ],
  },
  {
    id: 3,
    title: 'Tarefa 3',
    isOpen: false,
    subtasks: [
        { id: 31, title: 'Primeira subtarefa de 3', isCompleted: false },
        { id: 32, title: 'Segunda subtarefa de 3', isCompleted: false }
    ],
  },
  {
    id: 4,
    title: 'Tarefa 4',
    isOpen: false,
    subtasks: [
        { id: 41, title: 'Primeira subtarefa de 4', isCompleted: false },
        { id: 42, title: 'Segunda subtarefa de 4', isCompleted: false }
    ],
  },
];

const GoalCard = () => {
  const [tasks, setTasks] = useState(initialData);
  const [progress, setProgress] = useState(0);

  // Efeito que recalcula o progresso sempre que as tarefas mudam
  useEffect(() => {
    const totalTasks = tasks.length;
    if (totalTasks === 0) {
      setProgress(0);
      return;
    }

    const completedTasks = tasks.filter(task => {
      // Uma tarefa é completa se não tiver subtarefas ou se todas as subtarefas estiverem completas
      return task.subtasks.length > 0 && task.subtasks.every(st => st.isCompleted);
    }).length;

    const newProgress = Math.round((completedTasks / totalTasks) * 100);
    setProgress(newProgress);
  }, [tasks]);


  const handleToggle = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isOpen: !task.isOpen } : task
      )
    );
  };

  // Função para marcar uma SUBTAREFA como completa/incompleta
  const handleToggleSubtaskComplete = (taskId, subtaskId) => {
    setTasks(tasks.map(task => {
        if (task.id === taskId) {
            return {
                ...task,
                subtasks: task.subtasks.map(subtask => 
                    subtask.id === subtaskId 
                        ? { ...subtask, isCompleted: !subtask.isCompleted } 
                        : subtask
                )
            };
        }
        return task;
    }));
  };

  const handleAddSubtask = (taskId, e) => {
    e.stopPropagation();
    const newSubtaskTitle = prompt('Digite o nome da nova subtarefa:');
    if (newSubtaskTitle) {
      const newSubtask = { id: Date.now(), title: newSubtaskTitle, isCompleted: false };
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? { ...task, subtasks: [...task.subtasks, newSubtask] }
            : task
        )
      );
    }
  };

  const handleDeleteTask = (taskId, e) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja apagar esta tarefa e suas subtarefas?')) {
        setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  // Função para marcar uma TAREFA PRINCIPAL como completa/incompleta
  const handleToggleTaskComplete = (taskId) => {
      setTasks(tasks.map(task => {
          if (task.id === taskId) {
              const allSubtasksCompleted = !task.subtasks.every(st => st.isCompleted);
              return {
                  ...task,
                  subtasks: task.subtasks.map(st => ({...st, isCompleted: allSubtasksCompleted}))
              };
          }
          return task;
      }));
  };

  return (
    <div className="goal-card">
      <header className="card-header">
        <div className="card-tag-placeholder"></div>
        <div className="card-icon-placeholder"></div>
      </header>

      <h2>Título</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed
        vehicula nunc. Praesent ac varius leo. Nunc mattis sapien sem...
      </p>

      <ul className="task-list">
        {tasks.map((task) => {
          const isTaskCompleted = task.subtasks.length > 0 && task.subtasks.every(st => st.isCompleted);
          return (
            <li key={task.id}>
              <div className="task-item expandable">
                <div 
                  className={`task-checkbox ${isTaskCompleted ? 'completed' : ''}`}
                  onClick={(e) => {
                      e.stopPropagation();
                      handleToggleTaskComplete(task.id);
                  }}
                >
                  {isTaskCompleted && '✔'}
                </div>
                <span className="task-title" onClick={() => handleToggle(task.id)}>
                  {task.title}
                  {task.isOpen ? ' ▼' : ' ▶'}
                </span>
                <div className="task-actions">
                  <span className="icon-btn" onClick={(e) => handleAddSubtask(task.id, e)}>+</span>
                  <span className="icon-btn" onClick={(e) => handleDeleteTask(task.id, e)}>🗑️</span>
                </div>
              </div>

              {task.isOpen && (
                <ul className="subtask-list">
                  {task.subtasks.map((subtask) => (
                    <li key={subtask.id} className="subtask-item">
                      <div 
                        className={`task-checkbox ${subtask.isCompleted ? 'completed' : ''}`}
                        onClick={() => handleToggleSubtaskComplete(task.id, subtask.id)}
                      >
                         {subtask.isCompleted && '✔'}
                      </div>
                      <span className={subtask.isCompleted ? 'completed-text' : ''}>
                          {subtask.title}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <footer className="card-footer">
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-percent">{progress}%</span>
      </footer>
    </div>
  );
};

export default GoalCard;