import React, { useState } from 'react';
import './Task.css';
import { formatDistance } from 'date-fns';

const Task = ({ task, assignment, isAdminCreated }) => {
  const [showDetail, setShowDetail] = useState(false);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'pending';
      case 'in_progress':
        return 'in-progress';
      case 'completed':
        return 'completed';
      default:
        return 'pending';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  };

  return (
    <>
      <div 
        className={`task-tile ${isAdminCreated ? 'admin-created' : 'self-created'}`}
        onClick={() => setShowDetail(true)}
      >
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <span className={`task-status ${getStatusClass(assignment.status)}`}>
            {assignment.status.replace('_', ' ')}
          </span>
        </div>

        <span className="task-assignment">
          {assignment.assignmentName}
        </span>

        <div className="task-meta">
          <span className="task-meta-item">
            <i>⏰</i>
            {formatDate(task.deadline)}
          </span>
          <span className="task-meta-item">
            <i>📅</i>
            Assigned {formatDate(assignment.assignedAt)}
          </span>
        </div>

        <p className="task-description">{task.description}</p>

        <div className="task-footer">
          <div className="task-reward">
            <i>🏆</i>
            {task.rewardPoints} Points
          </div>
          {assignment.status === 'COMPLETED' && assignment.rewardGiven && (
            <div className="task-meta-item">
              <i>✨</i>
              Reward Claimed
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {showDetail && (
        <div className={`task-detail-modal ${showDetail ? 'show' : ''}`}>
          <div className="task-detail-content">
            <div className="task-detail-header">
              <h2 className="task-detail-title">{task.title}</h2>
              <div className="task-detail-assignment">
                From Assignment: {assignment.assignmentName}
              </div>
            </div>

            <div className="task-detail-meta">
              <div className="task-meta-item">
                <i>👤</i>
                Created by: {task.createdBy.name}
              </div>
              <div className="task-meta-item">
                <i>⏰</i>
                Deadline: {formatDate(task.deadline)}
              </div>
              <div className="task-meta-item">
                <i>📅</i>
                Assigned: {formatDate(assignment.assignedAt)}
              </div>
              {assignment.completedAt && (
                <div className="task-meta-item">
                  <i>✅</i>
                  Completed: {formatDate(assignment.completedAt)}
                </div>
              )}
            </div>

            <div className="task-detail-description">
              {task.description}
            </div>

            {task.attachmentUrl && (
              <div className="task-detail-attachment">
                <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer">
                  📎 View Attachment
                </a>
              </div>
            )}

            <div className="task-detail-actions">
              <button 
                className="btn btn--ghost"
                onClick={() => setShowDetail(false)}
              >
                Close
              </button>
              {assignment.status !== 'COMPLETED' && (
                <button className="btn btn--primary">
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Task;
