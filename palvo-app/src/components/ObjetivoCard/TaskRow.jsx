import React from "react";

export const TaskRow = ({ task, onToggleComplete, onAddSubtask, onDeleteTask }) => {
    const canAddSubtask = (task.level || 1) < 3;

    return (
        <React.Fragment>
            {/* CORREÇÃO: Usando as classes "m-task-item", "m-task-checkbox", etc. do CSS */}
            <li className={`m-task-item level-${task.level || 1}`}>
                <div
                    className={`m-task-checkbox ${task.isCompleted ? 'checked' : ''}`}
                    onClick={() => onToggleComplete(task)}
                >
                    {task.isCompleted && '✔'}
                </div>
                <span className={`m-task-title ${task.isCompleted ? 'completed' : ''}`}>{task.titulo}</span>
                <div className="m-task-actions">
                    {canAddSubtask && <span className="m-action-icon" onClick={() => onAddSubtask(task)}>+</span>}
                    <span className="m-action-icon" onClick={() => onDeleteTask(task)}>🗑️</span>
                </div>
            </li>
            
            {task.subtarefas && task.subtarefas.map(subtarefa => (
                <TaskRow
                    key={subtarefa.id}
                    task={subtarefa}
                    onToggleComplete={onToggleComplete}
                    onAddSubtask={onAddSubtask}
                    onDeleteTask={onDeleteTask}
                />
            ))}
        </React.Fragment>
    );
};