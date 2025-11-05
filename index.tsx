
import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useTaskManager } from './hooks/useTaskManager';
import { useSession, useSupabaseClient, useSessionContext, SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClient } from '@supabase/supabase-js';
import { View, Settings } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TaskList from './components/TaskList';
import ScheduleView from './components/ScheduleView';
import SettingsView from './components/SettingsView';
import AddTaskModal from './components/AddTaskModal';
import Icon from './components/Icon';
import InboxView from './components/InboxView';
import SyncPrompt from './components/SyncPrompt';
import Onboarding from './components/Onboarding';
import HelpView from './components/HelpView';
import CalendarView from './components/CalendarView';
import DashboardView from './components/GroupsView';
import AddToHomeScreenPrompt from './components/AddToHomeScreenPrompt';
import Auth from './components/Auth';
import Loader from './components/Loader';
import Logo from './components/Logo';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const WelcomeScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    return (
        <div className="h-full w-full bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <Logo className="w-24 h-24 mx-auto mb-6 text-emerald-500" />
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to <span className="text-emerald-500">DarTrack</span></h1>
                    <p className="text-lg text-gray-400 mb-8">The smartest way to organize your academic life.</p>
                    <button onClick={onComplete} className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

const EmailDomainScreen: React.FC<{ onComplete: (domain: string) => void; initialDomain: string; }> = ({ onComplete, initialDomain }) => {
    const [domain, setDomain] = useState(initialDomain);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete(domain);
    };

    return (
        <div className="h-full w-full bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
                <form onSubmit={handleSubmit}>
                    <Icon name="inbox" className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
                    <h2 className="text-2xl font-bold text-white text-center mb-2">Connect your School Email</h2>
                    <p className="text-gray-400 text-center mb-6">Our AI finds tasks in professor's emails so you don't have to.</p>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-400 bg-gray-900 p-3 rounded-lg border border-gray-700">
                                This app uses mock email data. To use your real email, a secure backend is required to handle authentication via OAuth 2.0. This flow simulates that.
                            </p>
                        </div>
                        <div>
                            <label htmlFor="schoolDomain" className="block text-sm font-medium text-gray-300">School Email Domain</label>
                            <input
                                type="text"
                                id="schoolDomain"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="e.g., dartmouth.edu"
                                required
                                className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <p className="mt-2 text-xs text-gray-500">For security, the app will only process emails from this domain.</p>
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="w-full px-4 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                Continue to Sign In
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};


const MainApp = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncPromptDismissed, setIsSyncPromptDismissed] = useState(false);
  const [isAddToHomeScreenPromptOpen, setIsAddToHomeScreenPromptOpen] = useState(false);
  const [hasSeenAddToHomeScreenPrompt, setHasSeenAddToHomeScreenPrompt] = useLocalStorage('hasSeenAddToHomeScreenPrompt', false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [tempSchoolEmailDomain] = useLocalStorage('temp_school_email_domain', 'dartmouth.edu');

  const taskManager = useTaskManager();
  const {
    tasks,
    pendingTasks,
    courses,
    settings,
    isLoading,
    error,
    lastSync,
    syncData,
    addTask,
    toggleTaskCompleted,
    deleteTask,
    snoozeTask,
    addCourse,
    deleteCourse,
    setSettings,
    acceptPendingTask,
    rejectPendingTask,
    updateAndAcceptPendingTask,
    acceptAllPending,
    rejectAllPending,
  } = taskManager;

  useEffect(() => {
    if (!isLoading) {
      if (!settings) {
        setIsOnboarding(true);
      }
    }
  }, [settings, isLoading]);
  
  const handleOnboardingComplete = async (initialSettings: Pick<Settings, 'canvasIcalUrl'>) => {
    const completeSettings: Settings = {
      syncTimes: settings?.syncTimes || [],
      schoolEmailDomain: tempSchoolEmailDomain,
      ...initialSettings,
    };
    await setSettings(completeSettings);
    await syncData();
    setIsOnboarding(false);
  };


  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator && (navigator as any).setAppBadge && (navigator as any).clearAppBadge) {
      const now = new Date();
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const urgentTasks = tasks.filter(task => !task.completed && new Date(task.due_date) <= twentyFourHoursFromNow);
      if (urgentTasks.length > 0) {
        (navigator as any).setAppBadge(urgentTasks.length);
      } else {
        (navigator as any).clearAppBadge();
      }
    }
  }, [tasks]);

  const performSyncAndNavigate = async () => {
    await syncData();
    setCurrentView('inbox');
  };

  const SYNC_THRESHOLD_HOURS = 24;

  const showSyncPrompt = useMemo(() => {
    if (isSyncPromptDismissed || !lastSync) return false;
    const hoursSinceSync = (new Date().getTime() - new Date(lastSync).getTime()) / (1000 * 60 * 60);
    return hoursSinceSync > SYNC_THRESHOLD_HOURS;
  }, [lastSync, isSyncPromptDismissed]);
  
  const handleCloseAddToHomeScreenPrompt = () => {
    setIsAddToHomeScreenPromptOpen(false);
    setHasSeenAddToHomeScreenPrompt(true);
  };
  
  useEffect(() => {
    if (lastSync && !hasSeenAddToHomeScreenPrompt) {
        setTimeout(() => {
            setIsAddToHomeScreenPromptOpen(true);
        }, 2500);
    }
  }, [lastSync, hasSeenAddToHomeScreenPrompt]);

  if (isLoading && !isOnboarding) {
    return (
        <div className="h-full w-full bg-gray-900 flex items-center justify-center">
            <Loader message="Loading your data..." />
        </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full w-full bg-gray-900 flex items-center justify-center p-8 text-center">
        <div className="text-red-400 bg-red-900/30 p-6 rounded-lg max-w-md">
          <h1 className="text-xl font-bold mb-2">Failed to Load Data</h1>
          <p>{error}</p>
          <p className="text-xs text-gray-500 mt-4">
            There was a problem fetching your tasks and settings. Please try refreshing the page.
            If the problem persists, check your network connection.
          </p>
        </div>
      </div>
    );
  }

  if (isOnboarding) {
      return <Onboarding onComplete={handleOnboardingComplete} isLoading={isLoading} />
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            {showSyncPrompt && (
              <SyncPrompt onSync={performSyncAndNavigate} onDismiss={() => setIsSyncPromptDismissed(true)} isLoading={isLoading} />
            )}
            <DashboardView tasks={tasks} onToggleCompleted={toggleTaskCompleted} onSnoozeTask={snoozeTask} onDeleteTask={deleteTask} onNavigate={setCurrentView} />
          </>
        );
      case 'tasks':
         return <TaskList tasks={tasks} onToggleCompleted={toggleTaskCompleted} onSnoozeTask={snoozeTask} onDeleteTask={deleteTask} isLoading={isLoading} error={error} />;
      case 'inbox':
        return <InboxView pendingTasks={pendingTasks} courses={courses} onAccept={acceptPendingTask} onReject={rejectPendingTask} onUpdateAndAccept={updateAndAcceptPendingTask} onAcceptAll={acceptAllPending} onRejectAll={rejectAllPending} onNavigate={setCurrentView} />;
      case 'schedule':
        return <ScheduleView courses={courses} onAddCourse={addCourse} onDeleteCourse={deleteCourse} />;
      case 'calendar':
        return <CalendarView tasks={tasks} onToggleCompleted={toggleTaskCompleted} onSnoozeTask={snoozeTask} onDeleteTask={deleteTask} />;
      case 'settings':
        return <SettingsView settings={settings} setSettings={setSettings} setCurrentView={setCurrentView} />;
      case 'help':
        return <HelpView onNavigate={setCurrentView} />;
      default:
        return <DashboardView tasks={tasks} onToggleCompleted={toggleTaskCompleted} onSnoozeTask={snoozeTask} onDeleteTask={deleteTask} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="h-full w-full bg-gray-900 flex flex-col max-w-4xl mx-auto">
      {currentView !== 'help' && (
        <Header currentView={currentView} onSync={performSyncAndNavigate} isLoading={isLoading} lastSync={lastSync} />
      )}
      <main className="flex-1 overflow-y-auto pb-24 pt-4">{renderView()}</main>
      {currentView === 'home' && (
        <button onClick={() => setIsModalOpen(true)} className="fixed bottom-24 right-4 z-30 bg-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105" aria-label="Add new task">
          <Icon name="add" className="w-8 h-8"/>
        </button>
      )}
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={addTask} courses={courses} />
      <AddToHomeScreenPrompt isOpen={isAddToHomeScreenPromptOpen} onClose={handleCloseAddToHomeScreenPrompt} />
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} pendingTaskCount={pendingTasks.length}/>
    </div>
  );
};


function Home() {
  const session = useSession();
  const { isLoading: isSessionLoading, error: sessionError } = useSessionContext();

  if (isSessionLoading) {
    return (
        <div className="h-full w-full bg-gray-900 flex items-center justify-center">
            <Loader message="Authenticating..." />
        </div>
    );
  }
  
  if (sessionError) {
    return (
        <div className="h-full w-full bg-gray-900 flex items-center justify-center p-8 text-center">
            <div className="text-red-400 bg-red-900/30 p-6 rounded-lg max-w-md">
              <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
              <p>{sessionError.message}</p>
              <p className="text-xs text-gray-500 mt-4">Could not connect to the authentication service. Please check your Supabase URL and Key, and your network connection.</p>
            </div>
        </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return <MainApp />;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseClient = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const App = () => {
  const [authFlowStep, setAuthFlowStep] = useLocalStorage('dartrak_auth_flow_step', 'welcome');
  const [schoolEmailDomain, setSchoolEmailDomain] = useLocalStorage('temp_school_email_domain', 'dartmouth.edu');

  if (!supabaseClient) {
    return (
      <div className="h-full w-full bg-gray-900 flex items-center justify-center p-8 text-center">
        <div className="text-red-400 bg-red-900/30 p-6 rounded-lg max-w-md">
          <h1 className="text-xl font-bold mb-2">Application Configuration Error</h1>
          <p>The application could not connect to the backend service.</p>
          <p className="text-xs text-gray-500 mt-4" style={{ textAlign: 'left', fontFamily: 'monospace' }}>
            Ensure the following environment variables are set in your .env.local file:<br/>
            - VITE_SUPABASE_URL<br/>
            - VITE_SUPABASE_ANON_KEY
          </p>
        </div>
      </div>
    );
  }

  const handleWelcomeComplete = () => {
    setAuthFlowStep('email_domain');
  };

  const handleEmailDomainComplete = (domain: string) => {
    setSchoolEmailDomain(domain);
    setAuthFlowStep('auth');
  };

  if (authFlowStep === 'welcome') {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  if (authFlowStep === 'email_domain') {
    return <EmailDomainScreen onComplete={handleEmailDomainComplete} initialDomain={schoolEmailDomain} />;
  }

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <Home />
    </SessionContextProvider>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
