import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, AlertCircle, CheckCircle, Calendar, Activity, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';

interface PatientDetailProps {
  hospitalName: string;
  patientData: any;
  onNavigate: (page: string, data?: any) => void;
  onLogout: () => void;
}

interface BiomarkerEntry {
  id: string;
  date: string;
  systolicBP: number;
  ldlCholesterol: number;
  hba1c: number;
}

interface AnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  riskScore: number;
}

export function PatientDetail({ hospitalName, patientData, onNavigate, onLogout }: PatientDetailProps) {
  const [biomarkerEntries, setBiomarkerEntries] = useState<BiomarkerEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    date: '',
    systolicBP: '',
    ldlCholesterol: '',
    hba1c: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    if (patientData?.id) {
      const mockData: BiomarkerEntry[] = [
        {
          id: '1',
          date: '2024-01-15',
          systolicBP: 140,
          ldlCholesterol: 160,
          hba1c: 7.2
        },
        {
          id: '2',
          date: '2024-02-15',
          systolicBP: 138,
          ldlCholesterol: 155,
          hba1c: 7.0
        },
        {
          id: '3',
          date: '2024-03-15',
          systolicBP: 135,
          ldlCholesterol: 150,
          hba1c: 6.8
        }
      ];
      setBiomarkerEntries(mockData);
    }
  }, [patientData?.id]);

  const handleAddEntry = () => {
    if (!newEntry.date || !newEntry.systolicBP || !newEntry.ldlCholesterol || !newEntry.hba1c) {
      toast.error('Please fill in all fields');
      return;
    }

    const entry: BiomarkerEntry = {
      id: Date.now().toString(),
      date: newEntry.date,
      systolicBP: parseFloat(newEntry.systolicBP),
      ldlCholesterol: parseFloat(newEntry.ldlCholesterol),
      hba1c: parseFloat(newEntry.hba1c)
    };

    setBiomarkerEntries(prev => [...prev, entry]);
    setNewEntry({ date: '', systolicBP: '', ldlCholesterol: '', hba1c: '' });
    toast.success('Biomarker entry added successfully');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setSelectedFile(file);
        toast.success('ECG file selected successfully');
      } else {
        toast.error('Please select a PNG or JPEG file');
      }
    }
  };

  const handleAnalysis = () => {
    if (!selectedFile) {
      toast.error('Please select an ECG file first');
      return;
    }

    if (biomarkerEntries.length < 3) {
      toast.error('Patient requires at least 3 months of biomarker data');
      return;
    }

    setIsAnalyzing(true);
    toast.info('Starting hybrid analysis...');
    
    // Simple timeout instead of async
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        riskLevel: 'High',
        confidence: 92.54,
        riskScore: 85
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      toast.success('Analysis completed successfully');
    }, 2000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-600';
      case 'Medium': return 'bg-yellow-600';
      case 'High': return 'bg-red-600';
      default: return 'bg-muted';
    }
  };

  // Generate chart data
  const riskTrendData = biomarkerEntries.map((entry, index) => ({
    month: new Date(entry.date).toLocaleDateString('en-US', { month: 'short' }),
    riskScore: Math.floor(60 + (entry.systolicBP - 120) * 0.5 + (entry.ldlCholesterol - 100) * 0.2 + (entry.hba1c - 5) * 10)
  }));

  const predictionData = [
    { name: 'Low Risk', value: 15, fill: '#22C55E' },
    { name: 'Medium Risk', value: 25, fill: '#F59E0B' },
    { name: 'High Risk', value: 60, fill: '#EF4444' }
  ];

  const canRunAnalysis = biomarkerEntries.length >= 3;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-semibold">
                  {patientData?.firstName} {patientData?.lastName}
                </h1>
                <p className="text-sm text-muted-foreground">{hospitalName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Patient Header Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <Label className="text-muted-foreground">Age</Label>
                <p>{patientData?.age || '45'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Gender</Label>
                <p>{patientData?.gender || 'Male'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">BMI</Label>
                <p>28.5</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Smoking Status</Label>
                <p>Former Smoker</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Diabetes Status</Label>
                <p>Type 2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biomarker Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Biomarker Entry Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-secondary" />
                <span>Add Monthly Biomarker Entry</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Record Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                <Input
                  id="systolicBP"
                  type="number"
                  placeholder="120"
                  value={newEntry.systolicBP}
                  onChange={(e) => setNewEntry({ ...newEntry, systolicBP: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="ldl">LDL Cholesterol (mg/dL)</Label>
                <Input
                  id="ldl"
                  type="number"
                  placeholder="100"
                  value={newEntry.ldlCholesterol}
                  onChange={(e) => setNewEntry({ ...newEntry, ldlCholesterol: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hba1c">HbA1c (%)</Label>
                <Input
                  id="hba1c"
                  type="number"
                  step="0.1"
                  placeholder="5.7"
                  value={newEntry.hba1c}
                  onChange={(e) => setNewEntry({ ...newEntry, hba1c: e.target.value })}
                />
              </div>
              <Button onClick={handleAddEntry} className="w-full">
                Add Entry
              </Button>
            </CardContent>
          </Card>

          {/* Biomarker History Table */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-accent" />
                <span>Biomarker History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {biomarkerEntries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No biomarker history recorded for this patient.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Systolic BP</TableHead>
                        <TableHead>LDL</TableHead>
                        <TableHead>HbA1c</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {biomarkerEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            {new Date(entry.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{entry.systolicBP} mmHg</TableCell>
                          <TableCell>{entry.ldlCholesterol} mg/dL</TableCell>
                          <TableCell>{entry.hba1c}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hybrid Analysis Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-primary" />
              <span>Run New Hybrid Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="ecg-file">Select ECG File (.png or .jpeg)</Label>
                <Input
                  id="ecg-file"
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleAnalysis}
                disabled={!canRunAnalysis || !selectedFile || isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Upload & Analyze'}
              </Button>
            </div>
            
            {/* Status Message */}
            <Alert>
              {canRunAnalysis ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {canRunAnalysis 
                  ? "Ready for analysis." 
                  : `Patient requires at least 3 months of biomarker data. Current: ${biomarkerEntries.length}/3`
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Analysis Results Section */}
        {analysisResult && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Analysis Results</h2>
              <Badge className={`${getRiskBgColor(analysisResult.riskLevel)} text-white`}>
                {analysisResult.riskLevel} Risk
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Score Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Score Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={riskTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="riskScore" 
                        stroke="#1E3A8A" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Prediction Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={predictionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {predictionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* LIME Explanation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-accent" />
                  <span>Model Interpretation (LIME)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg">
                      Prediction: <span className={`font-semibold ${getRiskColor(analysisResult.riskLevel)}`}>
                        {analysisResult.riskLevel} Risk
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {analysisResult.confidence}%
                    </p>
                  </div>
                  <Button 
                    onClick={() => onNavigate('report', { 
                      patient: patientData, 
                      analysis: analysisResult,
                      biomarkers: biomarkerEntries 
                    })}
                    variant="outline"
                  >
                    Generate Report
                  </Button>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">ECG Analysis with Feature Importance</p>
                  <div className="bg-background border rounded-lg p-8 text-center">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      LIME explanation visualization would be displayed here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Green highlights indicate features contributing to the prediction
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}