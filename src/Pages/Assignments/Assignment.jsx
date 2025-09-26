import React, { useState, useEffect } from 'react';
import Task from '../../Components/Task/Task';
import './Assignment.css';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';

const AssignmentPage = () => {
  // Sample data structure - replace with actual API calls
  const [assignments, setAssignments] = useState({
    backlog: [],
    pending: [],
    completed: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = () => {
      // Simulating API call with dummy data
      const dummyData = [
      // Backlog Tasks
      {
        id: 1,
        assignmentName: "React Fundamentals",
        status: "PENDING",
        assignedAt: new Date(2025, 7, 15).toISOString(),
        task: {
          title: "Build a Todo App",
          description: "Create a basic todo application using React hooks and state management",
          deadline: new Date(2025, 8, 1).toISOString(),
          rewardPoints: 100,
          createdBy: { name: "Admin", role: "ADMIN" }
        }
      },
      {
        id: 2,
        assignmentName: "Data Structures",
        status: "PENDING",
        assignedAt: new Date(2025, 7, 16).toISOString(),
        task: {
          title: "Implement Binary Search Tree",
          description: "Create a BST implementation with insert, delete, and search operations",
          deadline: new Date(2025, 8, 5).toISOString(),
          rewardPoints: 150,
          createdBy: { name: "John Doe", role: "USER" }
        }
      },
      {
        id: 3,
        assignmentName: "API Development",
        status: "PENDING",
        assignedAt: new Date(2025, 7, 17).toISOString(),
        task: {
          title: "REST API Documentation",
          description: "Document the API endpoints using Swagger/OpenAPI specification",
          deadline: new Date(2025, 8, 10).toISOString(),
          rewardPoints: 80,
          createdBy: { name: "Admin", role: "ADMIN" }
        }
      },
      
      // In Progress Tasks
      {
        id: 4,
        assignmentName: "Advanced JavaScript",
        status: "IN_PROGRESS",
        assignedAt: new Date(2025, 7, 10).toISOString(),
        task: {
          title: "Implement Promise.all",
          description: "Create a custom implementation of Promise.all with proper error handling",
          deadline: new Date(2025, 7, 25).toISOString(),
          rewardPoints: 200,
          createdBy: { name: "Admin", role: "ADMIN" }
        }
      },
      {
        id: 5,
        assignmentName: "System Design",
        status: "IN_PROGRESS",
        assignedAt: new Date(2025, 7, 12).toISOString(),
        task: {
          title: "Design URL Shortener",
          description: "Create a high-level design for a URL shortening service like bit.ly",
          deadline: new Date(2025, 7, 28).toISOString(),
          rewardPoints: 250,
          createdBy: { name: "Jane Smith", role: "USER" }
        }
      },
      {
        id: 6,
        assignmentName: "Testing",
        status: "IN_PROGRESS",
        assignedAt: new Date(2025, 7, 14).toISOString(),
        task: {
          title: "Unit Testing Practice",
          description: "Write comprehensive unit tests for the authentication module",
          deadline: new Date(2025, 7, 30).toISOString(),
          rewardPoints: 120,
          createdBy: { name: "Admin", role: "ADMIN" }
        }
      },

      // Completed Tasks
      {
        id: 7,
        assignmentName: "Git Basics",
        status: "COMPLETED",
        assignedAt: new Date(2025, 7, 1).toISOString(),
        completedAt: new Date(2025, 7, 5).toISOString(),
        rewardGiven: true,
        task: {
          title: "Git Branching Strategy",
          description: "Implement and document a Git branching strategy for the team",
          deadline: new Date(2025, 7, 10).toISOString(),
          rewardPoints: 100,
          createdBy: { name: "Admin", role: "ADMIN" }
        }
      },
      {
        id: 8,
        assignmentName: "Database Design",
        status: "COMPLETED",
        assignedAt: new Date(2025, 7, 2).toISOString(),
        completedAt: new Date(2025, 7, 8).toISOString(),
        rewardGiven: true,
        task: {
          title: "Schema Design",
          description: "Design a normalized database schema for the e-commerce module",
          deadline: new Date(2025, 7, 15).toISOString(),
          rewardPoints: 180,
          createdBy: { name: "Sarah Connor", role: "USER" }
        }
      },
      {
        id: 9,
        assignmentName: "Security",
        status: "COMPLETED",
        assignedAt: new Date(2025, 7, 5).toISOString(),
        completedAt: new Date(2025, 7, 10).toISOString(),
        rewardGiven: true,
        task: {
          title: "Security Audit",
          description: "Perform a security audit of the authentication system",
          deadline: new Date(2025, 7, 20).toISOString(),
          rewardPoints: 300,
          createdBy: { name: "Admin", role: "ADMIN" }
        }
      },
      {
        id: 10,
        assignmentName: "DevOps",
        status: "COMPLETED",
        assignedAt: new Date(2025, 7, 6).toISOString(),
        completedAt: new Date(2025, 7, 12).toISOString(),
        rewardGiven: false,
        task: {
          title: "CI/CD Pipeline",
          description: "Set up a CI/CD pipeline using GitHub Actions",
          deadline: new Date(2025, 7, 25).toISOString(),
          rewardPoints: 250,
          attachmentUrl: "https://example.com/cicd-diagram.pdf",
          createdBy: { name: "Admin", role: "ADMIN" }
        }
      }
    ];

    // Group assignments by status
    const grouped = dummyData.reduce((acc, assignment) => {
      const status = assignment.status.toLowerCase();
      if (status === 'pending') {
        acc.backlog.push(assignment);
      } else if (status === 'in_progress') {
        acc.pending.push(assignment);
      } else if (status === 'completed') {
        acc.completed.push(assignment);
      }
      return acc;
    }, { backlog: [], pending: [], completed: [] });

    setAssignments(grouped);
    setLoading(false);
    };
    
    fetchAssignments();
  }, []);

  const renderColumn = (title, tasks, icon) => (
    <div className={`assignment-column ${title.toLowerCase()}-column`}>
      <div className="column-header">
        <h2 className="column-title">
          <span>{icon}</span>
          {title}
        </h2>
        <span className="column-count">{tasks.length}</span>
      </div>
      
      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p className="empty-state-text">No tasks in {title}</p>
          </div>
        ) : (
          tasks.map((assignment) => (
            <Task
              key={assignment.id}
              task={assignment.task}
              assignment={assignment}
              isAdminCreated={assignment.task.createdBy.role === 'ADMIN'}
            />
          ))
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="assignment-page">
        <div className="assignment-banner">
          <h1 className="banner-title">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="sb-app">
     
      <div className="assignment-page">
        <div className="assignment-banner">
        <h1 className="banner-title">Task Management Dashboard</h1>
        <div className="banner-stats">
          <div className="banner-stat">
            <span className="stat-number">{assignments.backlog.length}</span>
            <span className="stat-label">To Do</span>
          </div>
          <div className="banner-stat">
            <span className="stat-number">{assignments.pending.length}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="banner-stat">
            <span className="stat-number">{assignments.completed.length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <p className="banner-subtitle">
          Your central hub for tracking assignments and managing tasks. Stay organized, meet deadlines, and earn rewards.
        </p>
      </div>

      <div className="assignment-board">
        {renderColumn('Backlog', assignments.backlog, '📋')}
        {renderColumn('In Progress', assignments.pending, '⏳')}
        {renderColumn('Completed', assignments.completed, '✅')}
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default AssignmentPage;
