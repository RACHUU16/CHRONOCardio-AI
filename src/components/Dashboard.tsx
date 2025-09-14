import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Logo3D } from './Logo3D';
import { ThemeToggle } from './ThemeToggle';
import { 
  Heart, 
  Users, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  UserPlus, 
  FileText,
  History,
  LogOut,
  ArrowLeft,
  Stethoscope,
  Brain,
  ChevronRight,
  User
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DashboardProps {
  hospitalName: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const riskData = [
  { name: 'Low Risk', value: 156, color: '#22C55E' },
  { name: 'Medium Risk', value: 89, color: '#F59E0B' },
  { name: 'High Risk', value: 23, color: '#EF4444' },
];

const monthlyData = [
  { month: 'Jan', patients: 45, analyses: 128 },
  { month: 'Feb', patients: 52, analyses: 145 },
  { month: 'Mar', patients: 48, analyses: 132 },
  { month: 'Apr', patients: 61, analyses: 178 },
  { month: 'May', patients: 55, analyses: 156 },
  { month: 'Jun', patients: 67, analyses: 189 },
];

const recentPatients = [
  {
    id: 'PAT001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    age: '45',
    gender: 'Female',
    lastVisit: '2024-03-15',
    riskLevel: 'Medium',
    mrn: 'MRN2024001'
  },
  {
    id: 'PAT002',
    firstName: 'Michael',
    lastName: 'Chen',
    age: '52',
    gender: 'Male',
    lastVisit: '2024-03-14',
    riskLevel: 'High',
    mrn: 'MRN2024002'
  },
  {
    id: 'PAT003',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    age: '38',
    gender: 'Female',
    lastVisit: '2024-03-13',
    riskLevel: 'Low',
    mrn: 'MRN2024003'
  }
];

export function Dashboard({ hospitalName, onNavigate, onLogout }: DashboardProps) {
  const totalPatients = riskData.reduce((sum, item) => sum + item.value, 0);

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      case 'Medium':
        return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
      case 'High':
        return 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handlePatientClick = (patient: any) => {
    onNavigate('patient-detail', patient);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="bg-card border-b border-border shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Logo3D size="sm" />
            <div className="h-8 w-px bg-border" />
            <div>
              <h1 className="font-bold text-primary">{hospitalName}</h1>
              <p className="text-sm text-muted-foreground">AI Cardiovascular Risk Assessment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav 
        className="bg-card border-b border-border"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-center px-6 py-3 gap-4">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="gap-2 bg-primary/10">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => onNavigate('register-patient')} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Register Patient
          </Button>
          <Button variant="ghost" onClick={() => onNavigate('analysis')} className="gap-2">
            <Activity className="h-4 w-4" />
            Analysis
          </Button>
          <Button variant="ghost" onClick={() => onNavigate('patient-history')} className="gap-2">
            <History className="h-4 w-4" />
            Patient History
          </Button>
        </div>
      </motion.nav>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-primary">{totalPatients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
              <Heart className="h-4 w-4 text-[#22C55E]" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-[#22C55E]">{riskData[0].value}</div>
              <p className="text-xs text-muted-foreground">
                58.2% of total patients
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
              <Activity className="h-4 w-4 text-[#F59E0B]" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-[#F59E0B]">{riskData[1].value}</div>
              <p className="text-xs text-muted-foreground">
                33.2% of total patients
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#EF4444]" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-[#EF4444]">{riskData[2].value}</div>
              <p className="text-xs text-muted-foreground">
                8.6% of total patients
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk Distribution Pie Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Trends Bar Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Monthly Analysis Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="analyses" fill="#10B981" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Patients Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Recent Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handlePatientClick(patient)}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {patient.age} years • {patient.gender} • MRN: {patient.mrn}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getRiskBadgeColor(patient.riskLevel)}
                        >
                          {patient.riskLevel} Risk
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('patient-history')}
                >
                  View All Patients
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Info Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                About CHRONOCardioAI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    CHRONOCardioAI is an advanced AI-powered cardiovascular risk prediction system designed 
                    specifically for healthcare institutions. Our platform combines cutting-edge machine learning 
                    with comprehensive biomarker analysis to provide accurate cardiac risk assessments.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <Stethoscope className="h-8 w-8 mx-auto mb-2 text-secondary" />
                      <div className="font-bold text-secondary">Clinical Grade</div>
                      <div className="text-xs text-muted-foreground">FDA Approved</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg">
                      <Brain className="h-8 w-8 mx-auto mb-2 text-accent" />
                      <div className="font-bold text-accent">AI Powered</div>
                      <div className="text-xs text-muted-foreground">98.7% Accuracy</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ImageWithFallback 
                    src="/api/placeholder/400/300"
                    alt="Medical AI Technology" 
                    className="rounded-lg shadow-md max-w-full h-auto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          className="mt-12 text-center text-sm text-muted-foreground border-t border-border pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="space-y-2">
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <span>© 2024 CHRONOCardioAI</span>
              <span>•</span>
              <span>Healthcare Grade Security</span>
              <span>•</span>
              <span>24/7 Support: support@chronocardioai.com</span>
            </div>
            <div>
              <Badge variant="secondary" className="text-xs">
                Version 2.1.0 • Last Updated: September 2024
              </Badge>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}