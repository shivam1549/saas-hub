"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Kanban, ListFilter, Calendar, Users, BarChart, Settings as SettingsIcon } from 'lucide-react';
import KanbanBoardView from '@/components/KanbanBoardView';
import SprintPlannerView from '@/components/SprintPlannerView';
import TaskModal from '@/components/TaskModal';
import TeamView from '@/components/TeamView';
import SettingsView from '@/components/SettingsView';
import { useParams } from 'next/navigation';
import api from '@/api/axios';
import SprintModal from '@/components/SprintModal';
import InviteModal from '@/components/InviteModal';
import DashboardView from '@/components/DashboardView';
import { useEchoListener } from '@/hooks/useEcho';
import CrossWindowSyncTester from '@/components/CrossWindowSyncTester';
import toast from 'react-hot-toast';
export default function ProjectDetail({ params }) {
    const { id: projectId } = useParams();
    const [activeTab, setActiveTab] = useState('Board');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // --- LLD: Central Data Store ---
    // status: 'todo' | 'in_progress' | 'done'
    // sprintId: null means it's in the Backlog
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [sprints, setSprints] = useState([]);

   const handleDeleteTask = async (taskId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (!isConfirmed) return;

    console.log("Starting deletion for:", taskId); // <-- CHECK THIS

    const previousTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== taskId));

    try {
        const response = await api.delete(`/tasks/${taskId}`);
        console.log("API response:", response); // <-- CHECK THIS
        toast.success('Task deleted successfully!');
    } catch (error) {
        console.error("Delete error details:", error); // <-- CHECK THIS
        setTasks(previousTasks);
    }
};

    const fetchData = async () => {
        try {
            const [projectRes, tasksRes, sprintsRes, usersRes] = await Promise.all([
                api.get(`/projects/${projectId}`),
                api.get(`/tasks?project_id=${projectId}`),
                api.get(`/sprints?project_id=${projectId}`),
                api.get('/users')
            ]);
            setTasks(tasksRes.data);
            setProject(projectRes.data);
            setSprints(sprintsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Error fetching project data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [projectId]);
// This forces the library to print everything it hears to the browser console
// window.Pusher.logToConsole = true;
    // --- Event: Handle Real-time Task Updates via Echo/Pusher ---
    const handleTaskUpdated = useCallback((event) => {
       
        const timestamp = new Date().toLocaleTimeString();
        console.log(`%c[Page] 📨 TaskUpdated callback fired at ${timestamp}`, 'color: #2196f3; font-weight: bold;', event);

        // Validate event structure
        if (!event) {
            console.error(`%c[Page] ❌ Event is null/undefined`, 'color: #f44336; font-weight: bold;');
            return;
        }

        if (!event.task) {
            console.error(`%c[Page] ❌ Event.task is missing. Event structure:`, 'color: #f44336; font-weight: bold;', Object.keys(event));
            return;
        }

        if (!event.task.id) {
            console.error(`%c[Page] ❌ Event.task.id is missing. Task object:`, 'color: #f44336; font-weight: bold;', event.task);
            return;
        }

        console.log(`%c[Page] 🔍 Updating task #${event.task.id}`, 'color: #4caf50; font-weight: bold;', event.task);
        
        // Update the specific task in state
        setTasks(prevTasks => {
            console.log(`%c[Page] Current tasks count: ${prevTasks.length}`, 'color: #9c27b0;');
            
            const updatedTasks = prevTasks.map(task => {
                if (task.id === event.task.id) {
                    console.log(`%c[Page] ✓ Found task #${task.id}, updating status from "${task.status}" to "${event.task.status}"`, 'color: #00bcd4; font-weight: bold;');
                    return { ...task, ...event.task };
                }
                return task;
            });

            // Check if update actually happened
            const wasUpdated = updatedTasks.some((t, idx) => {
                if (t.id === event.task.id && (t.status !== prevTasks[idx].status)) {
                    return true;
                }
                return false;
            });

            if (wasUpdated) {
                console.log(`%c[Page] ✅ State update confirmed - task #${event.task.id} changed`, 'color: #4caf50; font-weight: bold; font-size: 12px;');
            } else {
                console.warn(`%c[Page] ⚠️  State update may not have changed anything - task #${event.task.id} not found or identical`, 'color: #ff9800; font-weight: bold;');
            }

            return updatedTasks;
        });
    }, []);

    // Setup Echo listener for real-time updates
    const { isSubscribed, error: echoError, isReady: echoReady, setupId } = useEchoListener(
        `project.${projectId}`,
        '.TaskUpdated',
        handleTaskUpdated,
        !!projectId // Only enable when we have a projectId
    );

    // Monitor Echo connection status
    useEffect(() => {
        if (echoError) {
            console.error(`%c[Page] Echo error:`, 'color: #f44336; font-weight: bold;', echoError);
        }
        if (isSubscribed) {
            console.log(`%c[Page] ✓ Subscribed to project.${projectId} (setup #${setupId})`, 'color: #4caf50; font-weight: bold; font-size: 12px;');
            
            // 🔍 DEBUG: Check listener status
            const debugKey = `project.${projectId}:TaskUpdated`;
            if (window.__echoDebug && window.__echoDebug[debugKey]) {
                console.log(`%c[Page] 🔍 Listener Debug Info:`, 'color: #2196f3; font-weight: bold;', window.__echoDebug[debugKey]);
            }
        } else if (echoReady && projectId && !echoError) {
            console.log(`%c[Page] ⏳ Subscription not ready yet for project.${projectId}`, 'color: #ff9800; font-weight: bold;');
        }
    }, [isSubscribed, echoError, projectId, echoReady, setupId]);

    // --- Logic: Add Task ---
    const handleSaveTask = (taskData) => {
        const newTask = {
            ...taskData,
            id: Date.now(),
            assigneeInitials: 'JD', // Default for now
            status: 'todo',
        };
        setTasks([...tasks, newTask]);
        setIsTaskModalOpen(false);
    };

    // This function finds a task by ID and gives it the SPECIFIC Sprint ID you selected
    const planTask = async (taskId, newSprintId) => {

        // 1. Optimistic UI Update (Make it feel instant)
        setTasks(prevTasks =>
            prevTasks.map(task =>
                // Make sure to use sprint_id (snake_case) to match Laravel!
                // We also use parseInt because the select dropdown returns a string
                task.id === taskId ? { ...task, sprint_id: parseInt(newSprintId) } : task
            )
        );

        // 2. Background API Call (Save it to the database)
        try {
            await api.put(`/tasks/${taskId}`, {
                sprint_id: newSprintId
            });
        } catch (error) {
            console.error("Failed to plan task in database", error);

            // If the internet drops or Laravel rejects it, re-fetch the data 
            // to snap the UI back to reality so it doesn't get out of sync.
            fetchData();
        }
    };
    return (
        <div className="flex flex-col h-full">
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                projectId={projectId}
                sprints={sprints} // <--- Pass the sprints here!
                // users={users}  // <--- Pass users here if you fetch them!
                onSuccess={() => {
                    setIsTaskModalOpen(false);
                    fetchData(); // Instantly reload the board/planner!
                }}
            />

            <SprintModal
                isOpen={isSprintModalOpen}
                onClose={() => setIsSprintModalOpen(false)}
                projectId={projectId}
                onSuccess={() => {
                    setIsSprintModalOpen(false);
                    fetchData(); // Instantly refresh the data so the new sprint appears!
                }}
            />

            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={() => {
                    setIsInviteModalOpen(false);
                    fetchData(); // Instantly reload so the new user appears on the Team board!
                }}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
               <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        {project ? project.title : 'Loading Project...'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {project?.description || 'No description provided.'}
                    </p>
                </div>

             <div className="flex -space-x-2">
        {/* Map through real users, max 4 */}
        {users.slice(0, 4).map((user) => (
            <div 
                key={user.id} 
                title={user.name}
                className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shadow-sm"
            >
                {user.name.charAt(0).toUpperCase()}
            </div>
        ))}
        
        {/* Show +X if there are more than 4 users */}
        {users.length > 4 && (
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                +{users.length - 4}
            </div>
        )}
        
        {/* <button 
            onClick={() => setIsTaskModalOpen(true)} 
            className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors shadow-sm z-10"
            title="Invite User"
        >
            +
        </button> */}
    </div>
            </div>

            <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
                <button onClick={() => setActiveTab('Board')}>
                    <TabItem icon={<Kanban size={18} />} label="Board" active={activeTab === 'Board'} />
                </button>
                <button onClick={() => setActiveTab('Planner')}>
                    <TabItem icon={<Calendar size={18} />} label="Sprint Planner" active={activeTab === 'Planner'} />
                </button>
                <TabItem icon={<ListFilter size={18} />} label="Backlog" />
                <button onClick={() => setActiveTab('Team')}> <TabItem icon={<Users size={18} />} label="Team" /></button>
                <button onClick={() => setActiveTab('Settings')}> <TabItem icon={<SettingsIcon size={18} />} label="Settings" /></button>
                <button onClick={() => setActiveTab('Analytics')}> <TabItem icon={<BarChart size={18} />} label="Analytics" /></button>

            </div>

            <div className="flex-1">
                {activeTab === 'Board' && (
                    <KanbanBoardView
                        // Filter tasks that belong to a sprint (Watch out for snake_case here!)
                        tasks={tasks.filter(t => t.sprint_id !== null)}

                        // PASS THIS DOWN: The child needs to update the parent's state on drag end
                        setTasks={setTasks}
                        users={users}
                     
                        onAddtask={() => setIsTaskModalOpen(true)}
                        onDeleteTask={handleDeleteTask}
                    />
                )}
                {activeTab === 'Planner' && (
                    <div className="h-full flex flex-col">
                        {/* 5. ADD THE "CREATE SPRINT" BUTTON AT THE TOP OF THE PLANNER */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setIsSprintModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                            >
                                + Create Sprint
                            </button>
                        </div>

                        {/* PASS SPRINT DATA TO YOUR UI */}
                        <SprintPlannerView
                            tasks={tasks} // Pass all tasks so Planner can filter Backlog vs Sprint
                            sprints={sprints} // Pass the sprints!
                            onPlanTask={planTask}
                        />
                    </div>
                )}
                {/* ADD THIS LINE */}
                {activeTab === 'Team' &&
                    <TeamView
                        users={users}
                        tasks={tasks}
                        onInviteClick={() => setIsInviteModalOpen(true)} // <-- Pass the trigger
                    />
                }
                {activeTab === 'Settings' && <SettingsView />}
                {activeTab === 'Analytics' && (
                    <DashboardView 
                        projectId={projectId} 
                         // So it knows whether to show the team chart!
                    />
                )}
            </div>

            {/* Cross-Window Sync Tester - For debugging real-time updates */}
            <CrossWindowSyncTester projectId={projectId} />
        </div>
    );
}

const TabItem = ({ icon, label, active = false }) => (
    <div className={`
        flex items-center gap-2 pb-4 text-sm font-medium transition-all relative
        ${active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}
    `}>
        {icon}
        {label}
        {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
    </div>
);