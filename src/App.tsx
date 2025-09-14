import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ThemeProvider } from './components/ThemeProvider';
import { SplashScreen } from './components/SplashScreen';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Dashboard } from './components/Dashboard';
import { PatientRegistration } from './components/PatientRegistration';
import { AnalysisPage } from './components/AnalysisPage';
import { AnalysisResults } from './components/AnalysisResults';
import { PatientHistory } from './components/PatientHistory';
import { PatientDetail } from './components/PatientDetail';
import { MedicalReport } from './components/MedicalReport';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { supabase, api, setDemoSession, clearDemoSession } from './utils/supabase/client';

type AppState = 
  | 'splash' 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'register-patient' 
  | 'analysis' 
  | 'analysis-results' 
  | 'patient-history' 
  | 'patient-detail'
  | 'report';

interface User {
  id: string;
  hospitalName: string;
  location: string;
  email: string;
  patientId: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  contactNo: string;
  email: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  mrn: string;
  existingConditions: string[];
  registrationDate: string;
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check for demo session in localStorage first
        const demoSession = localStorage.getItem('demo-session');
        if (demoSession) {
          const sessionData = JSON.parse(demoSession);
          setDemoSession(sessionData);
          
          // Set demo user data
          setUser({
            id: 'demo-user-123',
            hospitalName: 'Demo General Hospital',
            location: 'Mumbai, Maharashtra',
            email: 'demo@hospital.com',
            patientId: 'DEMO001'
          });
          
          // Load patients
          const response = await api.getPatients();
          if (response.patients) {
            setPatients(response.patients);
          }
          setCurrentState('dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    
    checkSession();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await api.getPatients();
      if (response.patients && Array.isArray(response.patients)) {
        setPatients(response.patients);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      setPatients([]);
    }
  };

  const handleSplashComplete = () => {
    setCurrentState('login');
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.signin(email, password);
      
      if (response.error) {
        toast.error('Login failed', {
          description: response.error,
        });
        setLoading(false);
        return;
      }

      const userData = response.userData;
      
      // Store demo session if it's a demo user
      if (response.session?.access_token === 'demo-token-123') {
        setDemoSession(response.session);
        localStorage.setItem('demo-session', JSON.stringify(response.session));
      }
      
      setUser({
        id: response.user.id,
        hospitalName: userData.hospitalName,
        location: userData.location,
        email: response.user.email,
        patientId: userData.patientId
      });

      // Load patients
      loadPatients();
      
      setCurrentState('dashboard');
      
      toast.success(`Welcome to ${userData.hospitalName}! Successfully logged in.`, {
        description: 'You can now access the CHRONOCardioAI platform.',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: 'An unexpected error occurred. Please try again.',
      });
    }
    setLoading(false);
  };

  const handleRegister = async (userData: any) => {
    setLoading(true);
    try {
      const response = await api.signup(
        userData.email,
        userData.password,
        userData.hospitalName,
        userData.location
      );
      
      if (response.error) {
        toast.error('Registration failed', {
          description: response.error,
        });
        setLoading(false);
        return;
      }

      // Auto-login after registration
      await handleLogin(userData.email, userData.password);
      
      toast.success(`Registration successful for ${userData.hospitalName}!`, {
        description: 'Your account has been created. Welcome to CHRONOCardioAI.',
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed', {
        description: 'An unexpected error occurred. Please try again.',
      });
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear demo session if it exists
      localStorage.removeItem('demo-session');
      clearDemoSession();
      
      await supabase.auth.signOut();
      setUser(null);
      setPatients([]);
      setAnalysisData(null);
      setReportData(null);
      setSelectedPatient(null);
      setCurrentState('login');
      toast.info('Successfully logged out. See you next time!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'analysis-results') {
      setAnalysisData(data);
    } else if (page === 'report') {
      setReportData(data);
    } else if (page === 'patient-detail') {
      setSelectedPatient(data);
    }
    setCurrentState(page as AppState);
  };

  const handleRegisterPatient = async (patientData: any) => {
    setLoading(true);
    try {
      const response = await api.createPatient(patientData);
      
      if (response.error) {
        toast.error('Patient registration failed', {
          description: response.error,
        });
        setLoading(false);
        return;
      }

      // Refresh patients list
      await loadPatients();
      
      toast.success('Patient registered successfully!', {
        description: `${patientData.firstName} ${patientData.lastName} has been added to the system.`,
      });

      // Navigate back to dashboard after successful registration
      setCurrentState('dashboard');
    } catch (error) {
      console.error('Patient registration error:', error);
      toast.error('Patient registration failed', {
        description: 'An unexpected error occurred. Please try again.',
      });
    }
    setLoading(false);
  };

  const renderCurrentPage = () => {
    switch (currentState) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      
      case 'login':
        return (
          <LoginPage 
            onLogin={handleLogin}
            onNavigateToRegister={() => setCurrentState('register')}
            loading={loading}
          />
        );
      
      case 'register':
        return (
          <RegisterPage 
            onRegister={handleRegister}
            onNavigateToLogin={() => setCurrentState('login')}
            loading={loading}
          />
        );
      
      case 'dashboard':
        return user ? (
          <Dashboard 
            hospitalName={user.hospitalName}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        ) : null;
      
      case 'register-patient':
        return user ? (
          <PatientRegistration 
            hospitalName={user.hospitalName}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onRegisterPatient={handleRegisterPatient}
            loading={loading}
          />
        ) : null;
      
      case 'analysis':
        return user ? (
          <AnalysisPage 
            hospitalName={user.hospitalName}
            patients={patients}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        ) : null;
      
      case 'analysis-results':
        return user && analysisData ? (
          <AnalysisResults 
            hospitalName={user.hospitalName}
            analysisData={analysisData}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        ) : null;
      
      case 'patient-history':
        return user ? (
          <PatientHistory 
            hospitalName={user.hospitalName}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        ) : null;
      
      case 'patient-detail':
        return user && selectedPatient ? (
          <PatientDetail 
            hospitalName={user.hospitalName}
            patientData={selectedPatient}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        ) : null;
      
      case 'report':
        return user && reportData ? (
          <MedicalReport 
            hospitalName={user.hospitalName}
            reportData={reportData}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background font-sans antialiased">
        <AnimatePresence mode="wait">
          {renderCurrentPage()}
        </AnimatePresence>
        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
}