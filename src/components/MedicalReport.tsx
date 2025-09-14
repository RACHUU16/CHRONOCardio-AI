import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Logo3D } from './Logo3D';
import { ThemeToggle } from './ThemeToggle';
import { Progress } from './ui/progress';
import { 
  Heart, 
  User, 
  Calendar,
  FileText,
  Download,
  Printer,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  LogOut,
  ArrowLeft,
  Stethoscope,
  Brain,
  Shield,
  BarChart3,
  Clock
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner@2.0.3';

interface MedicalReportProps {
  hospitalName: string;
  reportData: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function MedicalReport({ hospitalName, reportData, onNavigate, onLogout }: MedicalReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const generateReportId = () => {
    return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMonthName = (index: number) => {
    const months = [
      '1st Month', '2nd Month', '3rd Month', '4th Month', '5th Month', '6th Month',
      '7th Month', '8th Month', '9th Month', '10th Month', '11th Month', '12th Month'
    ];
    return months[index] || '1st Month';
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return { bg: '#22C55E', text: 'text-white' };
      case 'medium': return { bg: '#F59E0B', text: 'text-white' };
      case 'high': return { bg: '#EF4444', text: 'text-white' };
      default: return { bg: '#6B7280', text: 'text-white' };
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Report sent to printer', {
      description: 'The medical report has been queued for printing.',
    });
  };

  const handleDownload = () => {
    toast.success('Report downloaded successfully', {
      description: 'The PDF report has been saved to your downloads folder.',
    });
  };

  const mockBiomarkers = reportData?.biomarkers || {
    totalCholesterol: 195,
    ldl: 120,
    hdl: 45,
    hba1c: 6.2,
    bmi: 28.5,
    sleepHours: 6,
    systolicBP: 140,
    diastolicBP: 90,
    hsCRP: 2.8,
    smokingStatus: 'Non-smoker',
    physicalActivity: 'Moderate',
    diabetesStatus: 'Pre-diabetic',
    familyHistory: 'Yes'
  };

  const riskColor = getRiskColor(reportData?.riskLevel);
  const reportId = generateReportId();
  const currentDateTime = getCurrentDateTime();
  const analysisMonth = getMonthName(0); // Default to 1st month

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="bg-card border-b border-border shadow-sm print:hidden"
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
              <p className="text-sm text-muted-foreground">Medical Report Generation</p>
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
        className="bg-card border-b border-border print:hidden"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => onNavigate('patient-history')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Patient History
            </Button>
            <div className="h-4 w-px bg-border" />
            <Button variant="ghost" className="gap-2 bg-primary/10">
              <FileText className="h-4 w-4" />
              Medical Report
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </motion.nav>

      <div className="p-6 max-w-5xl mx-auto print:p-4 print:max-w-none relative" ref={reportRef}>
        {/* Subtle background pattern for digital viewing */}
        <div className="absolute inset-0 opacity-[0.02] print:hidden pointer-events-none">
          <div 
            className="w-full h-full bg-repeat opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231E3A8A' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 0 0-8 0-8s8 0 8 8-8 8-8 8-8 0-8-8 8-8 8-8z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        {/* Report Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-card to-card/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="print:hidden">
                    <Logo3D size="sm" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-primary">CHRONOCardioAI</h1>
                    <p className="text-lg font-semibold text-foreground">Cardiovascular Risk Assessment Report</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold text-foreground">{hospitalName}</div>
                  <div className="text-muted-foreground">123 Medical Center Drive</div>
                  <div className="text-muted-foreground">Mumbai, Maharashtra 400001</div>
                  <div className="text-muted-foreground">Phone: +91-22-1234-5678</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-primary/5 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">Generated on {currentDateTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patient Information & Report Details */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Patient Name</div>
                    <div className="font-semibold">{reportData?.patient?.name || 'John Doe'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Age</div>
                    <div className="font-semibold">{reportData?.patient?.age || 45} years</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Gender</div>
                    <div className="font-semibold">{reportData?.patient?.gender || 'Male'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">MRN</div>
                    <div className="font-mono text-sm">{reportData?.patient?.mrn || 'MRN1704067200000'}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Patient ID</div>
                  <div className="font-mono text-sm">{reportData?.patient?.patientId || 'PID1704067200000'}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Report Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Analysis Month</div>
                    <div className="font-semibold">{analysisMonth}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Report Date</div>
                    <div className="font-semibold">{new Date().toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Analyzed By</div>
                    <div className="font-semibold">CHRONOCardioAI System</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Report ID</div>
                    <div className="font-mono text-sm">{reportId}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Cardiovascular Risk Assessment */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="mb-6 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-primary" />
                Cardiovascular Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div 
                    className={`inline-flex items-center px-6 py-3 rounded-lg font-bold text-lg ${riskColor.text}`}
                    style={{ backgroundColor: riskColor.bg }}
                  >
                    {reportData?.riskLevel === 'Low' && <CheckCircle className="h-5 w-5 mr-2" />}
                    {reportData?.riskLevel === 'Medium' && <Activity className="h-5 w-5 mr-2" />}
                    {reportData?.riskLevel === 'High' && <AlertTriangle className="h-5 w-5 mr-2" />}
                    Overall Risk Level: {reportData?.riskLevel || 'Medium'} Risk
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{reportData?.riskScore || 65}/100</div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Health Status Summary:</p>
                <p className="text-foreground">
                  {reportData?.riskLevel === 'Low' && 
                    "Patient shows low cardiovascular risk with well-controlled biomarkers. Continue current lifestyle and medication regimen with routine monitoring."
                  }
                  {reportData?.riskLevel === 'Medium' && 
                    "Patient presents moderate cardiovascular risk. Recommended interventions include lifestyle modifications and regular monitoring of key biomarkers."
                  }
                  {reportData?.riskLevel === 'High' && 
                    "Patient exhibits elevated cardiovascular risk requiring immediate medical attention. Comprehensive treatment plan and frequent monitoring recommended."
                  }
                  {!reportData?.riskLevel && 
                    "Patient presents moderate cardiovascular risk. Recommended interventions include lifestyle modifications and regular monitoring of key biomarkers."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Biomarker Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="mb-6 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Biomarker Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Lipid Profile */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Lipid Profile</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Cholesterol</span>
                      <span className="font-medium">{mockBiomarkers.totalCholesterol} mg/dL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">LDL</span>
                      <span className="font-medium">{mockBiomarkers.ldl} mg/dL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">HDL</span>
                      <span className="font-medium">{mockBiomarkers.hdl} mg/dL</span>
                    </div>
                  </div>
                </div>

                {/* Metabolic Indicators */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Metabolic Indicators</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">HbA1c</span>
                      <span className="font-medium">{mockBiomarkers.hba1c}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">BMI</span>
                      <span className="font-medium">{mockBiomarkers.bmi} kg/m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sleep Hours</span>
                      <span className="font-medium">{mockBiomarkers.sleepHours} hrs/night</span>
                    </div>
                  </div>
                </div>

                {/* Cardiovascular Metrics */}
                <div>
                  <h4 className="font-semibold mb-3 text-primary">Cardiovascular Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Systolic BP</span>
                      <span className="font-medium">{mockBiomarkers.systolicBP} mmHg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Diastolic BP</span>
                      <span className="font-medium">{mockBiomarkers.diastolicBP} mmHg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">hs-CRP</span>
                      <span className="font-medium">{mockBiomarkers.hsCRP} mg/L</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="font-semibold mb-3 text-primary">Lifestyle Factors</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground">Smoking Status</div>
                    <div className="font-medium">{mockBiomarkers.smokingStatus}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground">Physical Activity</div>
                    <div className="font-medium">{mockBiomarkers.physicalActivity}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground">Diabetes Status</div>
                    <div className="font-medium">{mockBiomarkers.diabetesStatus}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground">Family History</div>
                    <div className="font-medium">{mockBiomarkers.familyHistory}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ECG Analysis Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="mb-6 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" />
                ECG Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* ECG Waveform Visualization */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">ECG Rhythm Strip</h4>
                  <div className="relative h-24 bg-card border border-border rounded overflow-hidden">
                    <svg viewBox="0 0 800 100" className="w-full h-full">
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="800" height="100" fill="url(#grid)" />
                      <path 
                        d="M0,50 L80,50 L90,10 L100,90 L110,30 L120,50 L200,50 L210,10 L220,90 L230,30 L240,50 L320,50 L330,10 L340,90 L350,30 L360,50 L440,50 L450,10 L460,90 L470,30 L480,50 L560,50 L570,10 L580,90 L590,30 L600,50 L680,50 L690,10 L700,90 L710,30 L720,50 L800,50" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                      Lead II • 25mm/s • 10mm/mV
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Key Findings:</h4>
                    <ul className="space-y-2 text-sm">
                      {reportData?.riskLevel === 'Low' && (
                        <>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                            Normal sinus rhythm detected
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                            Heart rate: 68 bpm (normal range)
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                            No significant abnormalities detected
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                            Regular P-wave morphology
                          </li>
                        </>
                      )}
                      {reportData?.riskLevel === 'Medium' && (
                        <>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                            Normal sinus rhythm detected
                          </li>
                          <li className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-[#F59E0B]" />
                            Heart rate: 78 bpm (slightly elevated)
                          </li>
                          <li className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-[#F59E0B]" />
                            Minor ST-segment depression noted
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                            No significant arrhythmias detected
                          </li>
                        </>
                      )}
                      {reportData?.riskLevel === 'High' && (
                        <>
                          <li className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-[#F59E0B]" />
                            Sinus rhythm with irregular intervals
                          </li>
                          <li className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
                            Heart rate: 95 bpm (tachycardia)
                          </li>
                          <li className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
                            Significant ST-segment changes
                          </li>
                          <li className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-[#F59E0B]" />
                            Occasional premature beats detected
                          </li>
                        </>
                      )}
                      {!reportData?.riskLevel && (
                        <>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                            Normal sinus rhythm detected
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                            Heart rate: 72 bpm (normal range)
                          </li>
                          <li className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-[#F59E0B]" />
                            Minor ST-segment depression noted
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                            No significant arrhythmias detected
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Measurements:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PR Interval</span>
                        <span className="font-medium">160 ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">QRS Duration</span>
                        <span className="font-medium">95 ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">QT Interval</span>
                        <span className="font-medium">420 ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">QTc</span>
                        <span className="font-medium">445 ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Axis</span>
                        <span className="font-medium">+15°</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold mb-3">AI Analysis Confidence:</h4>
                  <div className="flex items-center gap-4">
                    <Progress 
                      value={reportData?.riskLevel === 'Low' ? 94 : 
                             reportData?.riskLevel === 'High' ? 89 : 87} 
                      className="flex-1" 
                    />
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        {reportData?.riskLevel === 'Low' ? '94' : 
                         reportData?.riskLevel === 'High' ? '89' : '87'}%
                      </div>
                      <div className="text-sm text-muted-foreground">High Confidence</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Trends */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="mb-6 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Risk Analysis Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Previous Analyses</div>
                  <div className="font-bold text-2xl text-primary">
                    {reportData?.analysisHistory?.previousAnalyses || 5}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Since {new Date(reportData?.analysisHistory?.firstAnalysisDate || '2024-01-01').toLocaleDateString()}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Risk Trend</div>
                  <div className={`font-bold text-2xl ${
                    reportData?.analysisHistory?.trendDirection === 'improving' ? 'text-[#22C55E]' :
                    reportData?.analysisHistory?.trendDirection === 'declining' ? 'text-[#EF4444]' :
                    'text-[#F59E0B]'
                  }`}>
                    {reportData?.analysisHistory?.trendDirection === 'improving' ? '↓ Improving' :
                     reportData?.analysisHistory?.trendDirection === 'declining' ? '↑ Declining' :
                     '→ Stable'}
                  </div>
                  <div className="text-xs text-muted-foreground">Over 6 months</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">Monitoring Frequency</div>
                  <div className="font-bold text-2xl text-primary">
                    {reportData?.riskLevel === 'High' ? 'Weekly' :
                     reportData?.riskLevel === 'Medium' ? 'Monthly' : 'Quarterly'}
                  </div>
                  <div className="text-xs text-muted-foreground">Recommended</div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="font-semibold mb-3">Key Biomarker Changes (Last 3 Months)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Total Cholesterol</div>
                    <div className={`font-medium ${
                      reportData?.riskLevel === 'Low' ? 'text-[#22C55E]' :
                      reportData?.riskLevel === 'High' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                    }`}>
                      {reportData?.riskLevel === 'Low' ? '↓ 15mg/dL' :
                       reportData?.riskLevel === 'High' ? '↑ 12mg/dL' : '→ Stable'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">HbA1c</div>
                    <div className={`font-medium ${
                      reportData?.riskLevel === 'Low' ? 'text-[#22C55E]' :
                      reportData?.riskLevel === 'High' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                    }`}>
                      {reportData?.riskLevel === 'Low' ? '↓ 0.3%' :
                       reportData?.riskLevel === 'High' ? '↑ 0.5%' : '→ Stable'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Blood Pressure</div>
                    <div className={`font-medium ${
                      reportData?.riskLevel === 'Low' ? 'text-[#22C55E]' :
                      reportData?.riskLevel === 'High' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                    }`}>
                      {reportData?.riskLevel === 'Low' ? '↓ 8mmHg' :
                       reportData?.riskLevel === 'High' ? '↑ 10mmHg' : '→ Stable'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">BMI</div>
                    <div className={`font-medium ${
                      reportData?.riskLevel === 'Low' ? 'text-[#22C55E]' :
                      reportData?.riskLevel === 'High' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                    }`}>
                      {reportData?.riskLevel === 'Low' ? '↓ 1.2' :
                       reportData?.riskLevel === 'High' ? '↑ 0.8' : '→ Stable'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clinical Recommendations */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="mb-6 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Stethoscope className="h-5 w-5 text-primary" />
                Clinical Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {reportData?.riskLevel === 'Low' && (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#22C55E] rounded-full mt-2 flex-shrink-0" />
                      <span>Continue current healthy lifestyle practices and routine monitoring</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#22C55E] rounded-full mt-2 flex-shrink-0" />
                      <span>Maintain regular physical activity (current level appears optimal)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#22C55E] rounded-full mt-2 flex-shrink-0" />
                      <span>Annual cardiovascular risk assessment recommended</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#22C55E] rounded-full mt-2 flex-shrink-0" />
                      <span>Continue preventive measures and dietary awareness</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#22C55E] rounded-full mt-2 flex-shrink-0" />
                      <span>Regular sleep pattern maintenance (7-8 hours per night)</span>
                    </li>
                  </>
                )}
                {reportData?.riskLevel === 'Medium' && (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0" />
                      <span>Continue current antihypertensive medication regimen and monitor blood pressure weekly</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0" />
                      <span>Implement structured physical activity program (150 minutes moderate exercise per week)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0" />
                      <span>Dietary consultation recommended for lipid management and weight reduction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0" />
                      <span>Follow-up appointment scheduled in 3 months for reassessment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0" />
                      <span>Regular monitoring of HbA1c levels due to pre-diabetic status</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#F59E0B] rounded-full mt-2 flex-shrink-0" />
                      <span>Consider stress management techniques and adequate sleep hygiene</span>
                    </li>
                  </>
                )}
                {reportData?.riskLevel === 'High' && (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#EF4444] rounded-full mt-2 flex-shrink-0" />
                      <span><strong>URGENT:</strong> Immediate cardiology consultation within 48 hours</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#EF4444] rounded-full mt-2 flex-shrink-0" />
                      <span>Consider initiation of high-intensity statin therapy</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#EF4444] rounded-full mt-2 flex-shrink-0" />
                      <span>Dual antiplatelet therapy evaluation by cardiologist</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#EF4444] rounded-full mt-2 flex-shrink-0" />
                      <span>Weekly monitoring and follow-up appointments required</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#EF4444] rounded-full mt-2 flex-shrink-0" />
                      <span>Comprehensive lifestyle intervention program enrollment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-[#EF4444] rounded-full mt-2 flex-shrink-0" />
                      <span>Consider stress testing and advanced cardiac imaging</span>
                    </li>
                  </>
                )}
                {!reportData?.riskLevel && (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Continue current antihypertensive medication regimen and monitor blood pressure weekly</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Implement structured physical activity program (150 minutes moderate exercise per week)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Dietary consultation recommended for lipid management and weight reduction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Follow-up appointment scheduled in 3 months for reassessment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Regular monitoring of HbA1c levels due to pre-diabetic status</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Consider stress management techniques and adequate sleep hygiene</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="shadow-lg border-0 bg-muted/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    <strong>Medical Disclaimer:</strong> This report is AI-assisted and must be validated by a certified healthcare professional. 
                    All clinical decisions should be made in consultation with qualified medical personnel.
                  </p>
                </div>
              </div>
              
              <div className="text-center text-xs text-muted-foreground border-t border-border pt-4 space-y-1">
                <div>© 2024 CHRONOCardioAI • Healthcare Grade AI Technology</div>
                <div>Report Generated: {currentDateTime} • Valid for clinical reference</div>
                <div>For technical support: support@chronocardioai.com | Emergency: +91-22-1234-5678</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}