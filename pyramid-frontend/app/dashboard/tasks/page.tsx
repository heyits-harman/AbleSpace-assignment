'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { tasksAPI } from '../../services/api';
import { Task, Project } from '../../types';
import { initializeSocket, onTaskChange, onTaskUpdated } from '../../services/socket';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [showFields, setShowFields] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleFields, setVisibleFields] = useState({
    priority: true,
    members: true,
    dueDate: true,
  });

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
    initializeSocket();

    // Listen for real-time updates
    onTaskChange((data) => {
      loadTasks();
    });

    onTaskUpdated((data) => {
      loadTasks();
    });
  }, []);

  const loadTasks = async () => {
    try {
      const response = await tasksAPI.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    'To Do': 'bg-gray-100',
    'Doing': 'bg-blue-50',
    'Completed': 'bg-green-50',
    'On Hold': 'bg-yellow-50',
  };

  const priorityColors: Record<string, string> = {
    'Urgent': 'text-red-600',
    'High': 'text-red-500',
    'Medium': 'text-orange-500',
    'Low': 'text-green-500',
    'No Priority': 'text-gray-400',
  };

  const groupedTasks = {
    'To Do': tasks.filter(t => t.status === 'To Do'),
    'Doing': tasks.filter(t => t.status === 'Doing'),
    'Completed': tasks.filter(t => t.status === 'Completed'),
    'On Hold': tasks.filter(t => t.status === 'On Hold'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">Tasks</h1>
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="p-2 hover:bg-gray-100 rounded">
              🔍
            </button>

            {/* Fields Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowFields(!showFields)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded"
              >
                <span>⊟</span>
                <span className="text-sm font-medium">Fields</span>
              </button>

              {showFields && (
                <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-48 z-10">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleFields.priority}
                        onChange={(e) =>
                          setVisibleFields({ ...visibleFields, priority: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Priority</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleFields.members}
                        onChange={(e) =>
                          setVisibleFields({ ...visibleFields, members: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Members</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleFields.dueDate}
                        onChange={(e) =>
                          setVisibleFields({ ...visibleFields, dueDate: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Due Date</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  viewMode === 'list' ? 'bg-white' : 'text-gray-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  viewMode === 'board' ? 'bg-white' : 'text-gray-600'
                }`}
              >
                Board
              </button>
            </div>

            {/* Filter */}
            <button className="p-2 hover:bg-gray-100 rounded">
              ⊕
            </button>

            {/* Add Task */}
            <button className="bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-900 text-sm">
              + Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        {viewMode === 'board' ? (
          // Kanban Board View
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(groupedTasks).map(([status, statusTasks]) => (
              <div key={status} className={`${statusColors[status]} rounded-lg p-4 min-h-96`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-black">{status}</h3>
                  <span className="text-xs text-gray-600">{statusTasks.length}</span>
                </div>

                <div className="space-y-3">
                  {statusTasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer">
                      <h4 className="font-medium text-black text-sm mb-3">{task.title}</h4>

                      <div className="space-y-2 text-xs">
                        {/* Avatar + Name */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {task.user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-700">{task.user.name}</span>
                        </div>

                        {/* Priority */}
                        {visibleFields.priority && (
                          <div className={`font-medium ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </div>
                        )}

                        {/* Due Date */}
                        {visibleFields.dueDate && task.dueDate && (
                          <div className="flex items-center gap-1 text-red-500">
                            📅 {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <button className="w-full text-center py-2 text-gray-600 hover:bg-gray-200 rounded text-sm">
                    + Add Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Task</th>
                  {visibleFields.priority && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
                  )}
                  {visibleFields.members && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Members</th>
                  )}
                  {visibleFields.dueDate && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Due Date</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                  <React.Fragment key={status}>
                    {statusTasks.length > 0 && (
                      <>
                        <tr className="bg-gray-50">
                          <td colSpan={5} className="px-6 py-3">
                            <span className="font-semibold text-gray-700">▼ {status}</span>
                          </td>
                        </tr>
                        {statusTasks.map((task) => (
                          <tr key={task.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-black">{task.title}</td>
                            {visibleFields.priority && (
                              <td className={`px-6 py-4 text-sm font-medium ${priorityColors[task.priority]}`}>
                                {task.priority}
                              </td>
                            )}
                            {visibleFields.members && (
                              <td className="px-6 py-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {task.user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-gray-700">{task.user.name}</span>
                                </div>
                              </td>
                            )}
                            {visibleFields.dueDate && (
                              <td className="px-6 py-4 text-sm text-gray-700">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                              </td>
                            )}
                            <td className="px-6 py-4 text-sm">
                              <button className="text-gray-600 hover:text-black">⋮</button>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}