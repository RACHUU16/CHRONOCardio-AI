import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Store demo session if needed
let demoSession: any = null;

// Demo data storage
let demoPatients: any[] = [];
let demoAnalyses: any[] = [];

// Helper function to get authenticated headers
export const getAuthHeaders = async () => {
  // Check for demo session first
  if (demoSession?.access_token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${demoSession.access_token}`
    };
  }

  // Otherwise get real Supabase session
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || publicAnonKey}`
  };
};

// Helper to set demo session
export const setDemoSession = (session: any) => {
  demoSession = session;
  // Initialize demo data when demo session is set
  if (demoPatients.length === 0) {
    initializeDemoData();
  }
};

// Helper to clear demo session
export const clearDemoSession = () => {
  demoSession = null;
  demoPatients = [];
  demoAnalyses = [];
};

// Initialize simplified demo data
const initializeDemoData = () => {
  const now = new Date();
  
  demoPatients = [
    {
      id: 'PAT001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      age: '45',
      gender: 'Female',
      contactNo: '+1-555-0123',
      email: 'sarah.johnson@email.com',
      state: 'California',
      district: 'Los Angeles',
      city: 'Los Angeles',
      pincode: '90210',
      mrn: 'MRN2024001',
      existingConditions: ['Hypertension', 'Diabetes Type 2'],
      registrationDate: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      userId: 'demo-user-123'
    },
    {
      id: 'PAT002',
      firstName: 'Michael',
      lastName: 'Chen',
      age: '52',
      gender: 'Male',
      contactNo: '+1-555-0124',
      email: 'michael.chen@email.com',
      state: 'New York',
      district: 'Manhattan',
      city: 'New York',
      pincode: '10001',
      mrn: 'MRN2024002',
      existingConditions: ['High Cholesterol', 'Family History'],
      registrationDate: new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      userId: 'demo-user-123'
    },
    {
      id: 'PAT003',
      firstName: 'Emma',
      lastName: 'Rodriguez',
      age: '38',
      gender: 'Female',
      contactNo: '+1-555-0125',
      email: 'emma.rodriguez@email.com',
      state: 'Texas',
      district: 'Harris',
      city: 'Houston',
      pincode: '77001',
      mrn: 'MRN2024003',
      existingConditions: ['None'],
      registrationDate: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      userId: 'demo-user-123'
    }
  ];

  // Create minimal analysis data - just 3 months for quick loading
  const riskProfiles = ['Medium', 'High', 'Low'];
  
  demoPatients.forEach((patient, patientIndex) => {
    const baseRiskProfile = riskProfiles[patientIndex];
    
    for (let i = 0; i < 3; i++) {
      const analysisDate = new Date();
      analysisDate.setMonth(analysisDate.getMonth() - i);
      analysisDate.setDate(15);
      
      const biomarkers = generateSimpleBiomarkers(baseRiskProfile);
      const riskScore = calculateRiskScore(biomarkers);
      
      const analysis = {
        id: `ANA${patient.id}_M${i + 1}`,
        patientId: patient.id,
        userId: 'demo-user-123',
        biomarkers,
        riskScore,
        riskLevel: baseRiskProfile,
        analysisDate: analysisDate.toISOString(),
        createdAt: new Date().toISOString(),
        ecgData: {
          heartRate: biomarkers.heartRate,
          rhythm: 'Normal sinus rhythm',
          findings: ['Normal sinus rhythm detected']
        },
        recommendations: generateRecommendations(baseRiskProfile),
        monthNumber: i + 1,
        monthLabel: i === 0 ? 'Current Month' : `${i} Month${i > 1 ? 's' : ''} Ago`,
        analysisType: i === 0 ? 'Current Assessment' : 'Historical Analysis',
        clinicalNotes: `Assessment ${i + 1}: Patient showing ${baseRiskProfile.toLowerCase()} cardiovascular risk.`
      };
      
      demoAnalyses.push(analysis);
    }
  });
};

// Generate simple biomarkers based on risk profile
const generateSimpleBiomarkers = (riskProfile: string) => {
  const baseValues = {
    Low: {
      systolicBP: 120,
      diastolicBP: 75,
      ldl: 95,
      hba1c: 5.4,
      heartRate: 70
    },
    Medium: {
      systolicBP: 135,
      diastolicBP: 85,
      ldl: 120,
      hba1c: 6.1,
      heartRate: 78
    },
    High: {
      systolicBP: 155,
      diastolicBP: 95,
      ldl: 165,
      hba1c: 7.2,
      heartRate: 88
    }
  };

  const values = baseValues[riskProfile] || baseValues.Medium;
  
  return {
    systolicBP: values.systolicBP + Math.round(Math.random() * 10 - 5),
    diastolicBP: values.diastolicBP + Math.round(Math.random() * 10 - 5),
    ldl: values.ldl + Math.round(Math.random() * 20 - 10),
    hba1c: Math.round((values.hba1c + (Math.random() * 0.6 - 0.3)) * 10) / 10,
    heartRate: values.heartRate + Math.round(Math.random() * 10 - 5),
    smokingStatus: riskProfile === 'High' ? 'Former smoker' : 'Non-smoker',
    physicalActivity: riskProfile === 'Low' ? 'Active' : riskProfile === 'Medium' ? 'Moderate' : 'Low',
    diabetesStatus: riskProfile === 'High' ? 'Type 2' : riskProfile === 'Medium' ? 'Pre-diabetic' : 'Normal',
    familyHistory: Math.random() > 0.5 ? 'Yes' : 'No'
  };
};



// Calculate risk score based on biomarkers
const calculateRiskScore = (biomarkers: any) => {
  let riskScore = 0;
  
  if (biomarkers.systolicBP > 140) riskScore += 20;
  if (biomarkers.diastolicBP > 90) riskScore += 15;
  if (biomarkers.totalCholesterol > 240) riskScore += 15;
  if (biomarkers.ldl > 160) riskScore += 15;
  if (biomarkers.hdl < 40) riskScore += 10;
  if (biomarkers.hba1c > 6.5) riskScore += 15;
  if (biomarkers.bmi > 30) riskScore += 10;
  if (biomarkers.smokingStatus === 'Current smoker') riskScore += 20;
  if (biomarkers.familyHistory === 'Yes') riskScore += 10;
  if (biomarkers.physicalActivity === 'Sedentary') riskScore += 10;
  
  return Math.min(riskScore, 100);
};

// Get risk level from score
const getRiskLevel = (score: number) => {
  if (score > 70) return 'High';
  if (score > 40) return 'Medium';
  return 'Low';
};

// Generate ECG findings based on risk level
const generateECGFindings = (riskLevel: string) => {
  const findings = {
    Low: [
      'Normal sinus rhythm detected',
      'Heart rate within normal range',
      'No significant abnormalities detected',
      'Regular P-wave morphology'
    ],
    Medium: [
      'Normal sinus rhythm detected',
      'Heart rate slightly elevated',
      'Minor ST-segment depression noted',
      'No significant arrhythmias detected'
    ],
    High: [
      'Sinus rhythm with irregular intervals',
      'Tachycardia detected',
      'Significant ST-segment changes',
      'Occasional premature beats detected'
    ]
  };
  
  return findings[riskLevel] || findings.Medium;
};

// Generate recommendations based on risk level
const generateRecommendations = (riskLevel: string) => {
  const recommendations = {
    Low: [
      'Continue current lifestyle and medication regimen',
      'Maintain regular exercise routine',
      'Follow-up in 6 months',
      'Continue dietary modifications'
    ],
    Medium: [
      'Increase physical activity to 150 minutes per week',
      'Consider medication adjustment',
      'Follow-up in 3 months',
      'Dietary consultation recommended'
    ],
    High: [
      'Immediate medical intervention required',
      'Start intensive medication therapy',
      'Follow-up in 4-6 weeks',
      'Consider specialist referral'
    ]
  };
  
  return recommendations[riskLevel] || recommendations.Medium;
};

// API helper functions with fallback to demo data
export const api = {
  // Authentication
  signup: async (email: string, password: string, hospitalName: string, location: string) => {
    // For demo purposes, always return success for non-demo emails
    if (email !== 'demo@hospital.com') {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              hospitalName,
              location,
              patientId: `PID${Date.now()}`
            }
          }
        });
        
        if (error) return { error: error.message };
        return { user: data.user };
      } catch (error) {
        return { error: 'Registration failed' };
      }
    }
    
    return { error: 'Demo account cannot be registered' };
  },

  signin: async (email: string, password: string) => {
    // Handle demo login
    if (email === 'demo@hospital.com' && password === 'demo123') {
      const demoUser = {
        id: 'demo-user-123',
        email: 'demo@hospital.com',
        user_metadata: {
          hospitalName: 'Demo General Hospital',
          location: 'Mumbai, Maharashtra',
          patientId: 'DEMO001'
        }
      };
      
      const demoSessionData = {
        access_token: 'demo-token-123',
        refresh_token: 'demo-refresh-123'
      };

      const userData = {
        hospitalName: 'Demo General Hospital',
        location: 'Mumbai, Maharashtra',
        email: 'demo@hospital.com',
        patientId: 'DEMO001',
        createdAt: new Date().toISOString()
      };

      return { 
        user: demoUser, 
        session: demoSessionData,
        userData: userData 
      };
    }
    
    // Handle real authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) return { error: error.message };
      
      const userData = {
        hospitalName: data.user.user_metadata?.hospitalName || 'Hospital',
        location: data.user.user_metadata?.location || 'Location',
        email: data.user.email || '',
        patientId: data.user.user_metadata?.patientId || `PID${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      return { 
        user: data.user, 
        session: data.session,
        userData 
      };
    } catch (error) {
      return { error: 'Sign in failed' };
    }
  },

  // Patients
  createPatient: async (patientData: any) => {
    if (demoSession?.access_token === 'demo-token-123') {
      const patientId = `PAT${Date.now()}`;
      const mrn = `MRN${Date.now()}`;
      
      const patient = {
        ...patientData,
        id: patientId,
        mrn: mrn,
        userId: 'demo-user-123',
        registrationDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      demoPatients.push(patient);
      return { patient };
    }
    
    // Handle real patient creation with Supabase
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return { error: 'Unauthorized' };
      
      // In a real implementation, you would save to Supabase tables
      const patientId = `PAT${Date.now()}`;
      const mrn = `MRN${Date.now()}`;
      
      const patient = {
        ...patientData,
        id: patientId,
        mrn: mrn,
        userId: session.user.id,
        registrationDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      return { patient };
    } catch (error) {
      return { error: 'Failed to create patient' };
    }
  },

  getPatients: async () => {
    if (demoSession?.access_token === 'demo-token-123') {
      return { patients: demoPatients };
    }
    
    // Handle real patient retrieval
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return { error: 'Unauthorized' };
      
      // In a real implementation, you would fetch from Supabase tables
      return { patients: [] };
    } catch (error) {
      return { error: 'Failed to fetch patients' };
    }
  },

  // Analysis
  createAnalysis: async (analysisData: any) => {
    if (demoSession?.access_token === 'demo-token-123') {
      const analysisId = `ANA${Date.now()}`;
      
      // Simple risk calculation
      const { biomarkers } = analysisData;
      let riskScore = calculateRiskScore(biomarkers);
      let riskLevel = getRiskLevel(riskScore);
      
      const analysis = {
        ...analysisData,
        id: analysisId,
        userId: 'demo-user-123',
        riskScore,
        riskLevel,
        analysisDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        ecgData: {
          heartRate: biomarkers.heartRate || 72,
          rhythm: biomarkers.rhythm || 'Normal sinus rhythm',
          findings: generateECGFindings(riskLevel)
        },
        recommendations: generateRecommendations(riskLevel)
      };

      demoAnalyses.push(analysis);
      return { analysis };
    }
    
    return { error: 'Analysis creation not implemented for non-demo mode' };
  },

  getAnalysis: async (analysisId: string) => {
    if (demoSession?.access_token === 'demo-token-123') {
      const analysis = demoAnalyses.find(a => a.id === analysisId);
      if (!analysis) return { error: 'Analysis not found' };
      return { analysis };
    }
    
    return { error: 'Analysis retrieval not implemented for non-demo mode' };
  },

  // Patient History
  getPatientHistory: async (patientId: string) => {
    if (demoSession?.access_token === 'demo-token-123') {
      const patient = demoPatients.find(p => p.id === patientId);
      if (!patient) return { error: 'Patient not found' };
      
      const analyses = demoAnalyses
        .filter(a => a.patientId === patientId)
        .sort((a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime());
      
      return { 
        patient,
        analyses,
        totalAnalyses: analyses.length,
        lastAnalysis: analyses[0]?.analysisDate || null
      };
    }
    
    return { error: 'Patient history not implemented for non-demo mode' };
  }
};