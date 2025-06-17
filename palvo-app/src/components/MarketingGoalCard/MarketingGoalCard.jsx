import React, { useState, useEffect } from 'react';
import './MarketingGoalCard.css';

// ... (O componente TaskRow permanece o mesmo da versão anterior)
const TaskRow = ({ task, onToggleComplete, onAddSubtask, onDeleteTask }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (task.subtasks && task.subtasks.length > 0) {
            const completedCount = task.subtasks.filter(t => t.isCompleted).length;
            const newProgress = Math.round((completedCount / task.subtasks.length) * 100);
            setProgress(newProgress);
        } else {
            setProgress(0);
        }
    }, [task.subtasks]);

    const showProgressBar = task.level > 1 && task.subtasks && task.subtasks.length >= 2;
    const canAddSubtask = task.level < 3;

    return (
        <React.Fragment>
            <li className={`m-task-item level-${task.level}`}>
                <div
                    className={`m-task-checkbox ${task.isCompleted ? 'checked' : ''}`}
                    onClick={() => onToggleComplete(task.id)}
                >
                  {task.isCompleted && '✔'}
                </div>
                <span className={`m-task-title ${task.isCompleted ? 'completed' : ''}`}>{task.title}</span>
                <div className="m-task-actions">
                    {canAddSubtask && <span className="m-action-icon" onClick={() => onAddSubtask(task.id, task.level)}>+</span>}
                    <span className="m-action-icon" onClick={() => onDeleteTask(task.id)}>🗑️</span>
                </div>
            </li>

            {task.subtasks && task.subtasks.map(subtask => (
                <TaskRow
                    key={subtask.id}
                    task={subtask}
                    onToggleComplete={onToggleComplete}
                    onAddSubtask={onAddSubtask}
                    onDeleteTask={onDeleteTask}
                />
            ))}

            {showProgressBar && (
                <li className={`m-progress-item level-${task.level}`}>
                    <div className="m-partial-progress-bar-container">
                        <div className="m-partial-progress-bar-fill" style={{width: `${progress}%`}}></div>
                    </div>
                    <span className="m-partial-percent">{progress}%</span>
                </li>
            )}
        </React.Fragment>
    );
};


// --- Componente Principal ---
const MarketingGoalCard = () => {
  // 1. Estado para guardar os dados do card (título, descrição, tag)
  const [cardData, setCardData] = useState({
    tag: '#Nova Tag',
    title: 'Objetivo Sem Título',
    description: 'Clique para adicionar uma descrição...',
  });
  
  const [tasks, setTasks] = useState([]);
  const [globalProgress, setGlobalProgress] = useState(0);

  // Função para atualizar os dados do card quando o utilizador edita
  const handleCardDataChange = (field, value) => {
    setCardData(prevData => ({ ...prevData, [field]: value }));
  };

  // As outras funções permanecem as mesmas...
  useEffect(() => {
    const syncParentStatus = (taskList) => {
        return taskList.map(task => {
            if (task.subtasks && task.subtasks.length > 0) {
                const updatedSubtasks = syncParentStatus(task.subtasks);
                const allChildrenCompleted = updatedSubtasks.every(child => child.isCompleted);
                return { ...task, subtasks: updatedSubtasks, isCompleted: allChildrenCompleted };
            }
            return task;
        });
    };
    const calculateGlobalProgress = (currentTasks) => {
        const totalMainTasks = currentTasks.length;
        if (totalMainTasks === 0) {
            setGlobalProgress(0);
            return;
        }
        const completedMainTasks = currentTasks.filter(task => task.isCompleted).length;
        const newProgress = Math.round((completedMainTasks / totalMainTasks) * 100);
        setGlobalProgress(newProgress);
    };
    const syncedTasks = syncParentStatus(tasks);
    calculateGlobalProgress(syncedTasks);
    if (JSON.stringify(syncedTasks) !== JSON.stringify(tasks)) {
      setTasks(syncedTasks);
    }
  }, [tasks]);

  const handleToggleComplete = (taskId) => {
    const toggleRecursively = (currentTasks) => {
        return currentTasks.map(task => {
            if (task.id === taskId) {
                const newCompletedState = !task.isCompleted;
                const updateChildren = (subtasks) => {
                    return subtasks.map(st => ({...st, isCompleted: newCompletedState, subtasks: st.subtasks ? updateChildren(st.subtasks) : [] }));
                }
                return { ...task, isCompleted: newCompletedState, subtasks: task.subtasks ? updateChildren(task.subtasks) : [] };
            }
            if (task.subtasks && task.subtasks.length > 0) {
                return { ...task, subtasks: toggleRecursively(task.subtasks) };
            }
            return task;
        });
    };
    setTasks(toggleRecursively(tasks));
  };

  const handleAddTask = () => {
    const taskTitle = prompt("Digite o nome da nova tarefa:");
    if (taskTitle) {
      const newTask = { id: Date.now(), level: 1, title: taskTitle, isCompleted: false, subtasks: [] };
      setTasks([...tasks, newTask]);
    }
  };

  const handleAddSubtask = (parentId, parentLevel) => {
    if (parentLevel >= 3) {
        alert("Não é possível adicionar mais de 3 níveis de tarefas.");
        return;
    }
    const subtaskTitle = prompt("Digite o nome da nova subtarefa:");
    if (!subtaskTitle) return;
    const newSubtask = { id: Date.now(), level: parentLevel + 1, title: subtaskTitle, isCompleted: false, subtasks: [] };
    const addTaskRecursively = (currentTasks) => {
        return currentTasks.map(task => {
            if (task.id === parentId) {
                return { ...task, subtasks: [...task.subtasks, newSubtask] };
            }
            if (task.subtasks.length > 0) {
                return { ...task, subtasks: addTaskRecursively(task.subtasks) };
            }
            return task;
        });
    };
    setTasks(addTaskRecursively(tasks));
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm("Tem certeza que deseja excluir este item e todos os seus filhos?")) return;
    const removeTaskRecursively = (currentTasks) => {
        const filteredTasks = currentTasks.filter(task => task.id !== taskId);
        if (filteredTasks.length === currentTasks.length) {
            return currentTasks.map(task => {
                if (task.subtasks && task.subtasks.length > 0) {
                    return { ...task, subtasks: removeTaskRecursively(task.subtasks) };
                }
                return task;
            });
        }
        return filteredTasks;
    };
    setTasks(removeTaskRecursively(tasks));
  };


  return (
    <div className="marketing-card">
      <header className="m-card-header">
        {/* 2. Tornamos a tag editável */}
        <span 
          className="m-card-tag editable"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleCardDataChange('tag', e.currentTarget.textContent)}
        >
          {cardData.tag}
        </span>
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
        {/* 3. Tornamos o título e a descrição editáveis */}
        <h2 
          className="editable"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleCardDataChange('title', e.currentTarget.textContent)}
        >
          {cardData.title}
        </h2>
        <p 
          className="editable"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleCardDataChange('description', e.currentTarget.textContent)}
        >
          {cardData.description}
        </p>
        <button className="m-add-task-btn" onClick={handleAddTask}>
          <span className="add-icon">+</span> Adicionar tarefa
        </button>
        <ul className="m-task-list">
          {tasks.map((task) => (
            <TaskRow
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onAddSubtask={handleAddSubtask}
                onDeleteTask={handleDeleteTask}
            />
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

export default MarketingGoalCard;