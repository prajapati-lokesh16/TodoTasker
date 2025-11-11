"use client"
import react, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import ToastContainer from "@/components/ToastContainer";

const taskContext = createContext();

export const useTaskContext = () => {
    return useContext(taskContext);
};

export const TaskProvider = ({ children }) => {
    const router = useRouter();

    const [tasks, setTasks] = useState([]);
    const [profile, setProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [deleteArray, setDeleteArray] = useState([]);
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'error') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const fetchProfile = useCallback(async () => {
        setIsLoadingProfile(true);
        try {
            let r = await fetch(`${process.env.NEXT_PUBLIC_URL}/fetchProfile`, { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } });
            let x = await r.json();
            if (r.status === 401 || r.status === 403) {
                showToast('Session expired. Redirecting to login.', 'error');
                router.replace('/login');
                return null;
            }
            if (!r.ok) {
                throw new Error('Failed to fetch profile.')
            }
            setProfile(x);
        } catch (error) {
            showToast(error.message || 'Failed to fetch profile', 'error');
        }
        finally {
            setIsLoadingProfile(false);
        }
    }, [setIsLoadingProfile, setProfile, router, showToast]);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            let r = await fetch(`${process.env.NEXT_PUBLIC_URL}/fetchTasks`, { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } });
            let x = await r.json();
            if (r.status === 401 || r.status === 403) {
                showToast('Session expired. Redirecting to login.', 'error');
                router.replace('/login');
                return null;
            }
            if (!r.ok) {
                throw new Error('Failed to fetch Tasks.')
            }
            setTasks(x);
        } catch (error) {
            showToast(error.message || 'Failed to fetch tasks', 'error');
        }
        finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setTasks, router, showToast]);

    const addTasks = useCallback(async (data) => {
        try {
            let r = await fetch(`${process.env.NEXT_PUBLIC_URL}/addTasks`, { method: 'POST', credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
            let x = await r.json();
            if (r.status === 401 || r.status === 403) {
                showToast('Session expired. Redirecting to login.', 'error');
                router.replace('/login');
                return false;
            }
            if (!r.ok) {
                throw new Error('Unauthorized Access Denied. Please Login!')
            }
            if (r.ok && x.success) {
                setTasks(prevTasks => [...prevTasks, x.task])
                showToast('Task added successfully', 'success');
                return true;
            }
            else {
                showToast(x.message || 'Adding Task failed.', 'error');
                return false;
            }
        } catch (error) {
            showToast(error.message || 'Error adding task', 'error');
            return false;
        }
        
    }, [router, showToast]);

    const deleteTasks = useCallback(async () => {
        if (deleteArray.length === 0) {
            showToast("Please select tasks to delete", 'error');
            return;
        }
        try {
            let r = await fetch(`${process.env.NEXT_PUBLIC_URL}/deleteTasks`, { method: 'DELETE', credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: deleteArray }) });
            let x = await r.json();
            if (r.ok && x.success) {
                setTasks(prevTasks => prevTasks.filter(task => !deleteArray.includes(task._id)));
                setDeleteArray([]);
                setIsSelectMode(false);
                showToast('Tasks deleted successfully', 'success');
                router.refresh();
            }
            else {
                showToast(x.message || 'Deleting Task failed.', 'error');
            }
        } catch (error) {
            showToast(error.message || 'Error deleting tasks', 'error');
        }
        
    }, [deleteArray, setDeleteArray, setIsSelectMode, router, showToast]);

    const ToggleTaskStatus = useCallback(async (TaskID, isComplete) => {
        try {
            let r = await fetch(`${process.env.NEXT_PUBLIC_URL}/toggleTasks`, { method: 'PUT', credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: TaskID, status: isComplete }) });
            let x = await r.json();
            if (r.ok && x.success) {
                setTasks(prevTasks =>
                    prevTasks.map(task => {
                        if (task._id === TaskID) {
                            return { ...task, isComplete: !isComplete };
                        }
                        return task;
                    }));
                showToast('Task status updated', 'success');
                router.refresh();
            }
            else {
                showToast(x.message || 'Changing Task status failed.', 'error');
            }
        } catch (error) {
            showToast(error.message || 'Error toggling task status', 'error');
        }
        
    }, [setTasks, router, showToast]);


    

    const contextValue = useMemo(() => ({
        tasks, setTasks,
        profile, setProfile,
        isLoading,
        isLoadingProfile,
        filterStatus, setFilterStatus,
        isSelectMode, setIsSelectMode,
        deleteArray, setDeleteArray,
        fetchTasks,
        fetchProfile,
        addTasks,
        deleteTasks,
        ToggleTaskStatus,
        toasts,
        showToast,
        removeToast
    }), [tasks, setTasks, profile, setProfile, isLoading, isLoadingProfile, filterStatus, setFilterStatus, isSelectMode, setIsSelectMode, deleteArray, setDeleteArray,
        fetchTasks, fetchProfile, addTasks, deleteTasks, ToggleTaskStatus, toasts, showToast, removeToast]);

    return (
        <taskContext.Provider value={contextValue}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </taskContext.Provider>
    );

};
