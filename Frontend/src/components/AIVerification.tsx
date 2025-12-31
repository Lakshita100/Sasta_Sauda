import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { QualityBadge } from '@/components/QualityBadge';
import { VerificationResult, QualityGrade } from '@/types';
import { Loader2, CheckCircle2, AlertCircle, Eye, Sparkles, Shield } from 'lucide-react';

interface AIVerificationProps {
  images: File[];
  onComplete: (result: VerificationResult) => void;
}

type VerificationStep = 'uploading' | 'analyzing' | 'classifying' | 'complete';

export function AIVerification({ images, onComplete }: AIVerificationProps) {
  const [step, setStep] = useState<VerificationStep>('uploading');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    simulateVerification();
  }, []);

  const simulateVerification = async () => {
    // Simulate upload to Azure Blob Storage
    setStep('uploading');
    for (let i = 0; i <= 30; i += 5) {
      await sleep(100);
      setProgress(i);
    }
    
    // Simulate Azure AI Vision - blur/defect detection
    setStep('analyzing');
    for (let i = 30; i <= 60; i += 5) {
      await sleep(150);
      setProgress(i);
    }
    
    // Simulate Azure Custom Vision - grain classification
    setStep('classifying');
    for (let i = 60; i <= 100; i += 5) {
      await sleep(100);
      setProgress(i);
    }
    
    // Generate mock result
    const mockResult = generateMockResult();
    setResult(mockResult);
    setStep('complete');
    onComplete(mockResult);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateMockResult = (): VerificationResult => {
    const grades: QualityGrade[] = ['A', 'B', 'C'];
    const weights = [0.6, 0.3, 0.1]; // Weighted towards better grades
    const random = Math.random();
    let grade: QualityGrade = 'B';
    let cumulative = 0;
    
    for (let i = 0; i < grades.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        grade = grades[i];
        break;
      }
    }

    const confidence = grade === 'A' ? 85 + Math.floor(Math.random() * 15) 
                     : grade === 'B' ? 70 + Math.floor(Math.random() * 15)
                     : 55 + Math.floor(Math.random() * 15);

    const explanations: Record<QualityGrade, string> = {
      'A': 'Premium quality grain detected. Excellent grain structure with uniform size and color. Minimal impurities and optimal moisture content.',
      'B': 'Good quality grain with minor variations. Slight color inconsistency detected but within acceptable range. Suitable for standard commercial use.',
      'C': 'Standard quality grain. Some impurities and moisture variation detected. May require additional processing for premium markets.',
    };

    const defects: Record<QualityGrade, string[]> = {
      'A': [],
      'B': ['Minor color variation', 'Slight size inconsistency'],
      'C': ['Visible impurities', 'Moisture variation', 'Some damaged grains'],
    };

    return {
      imageClarity: 85 + Math.floor(Math.random() * 15),
      qualityGrade: grade,
      confidenceScore: confidence,
      explanation: explanations[grade],
      defectsDetected: defects[grade],
    };
  };

  const stepInfo = {
    uploading: {
      icon: Loader2,
      title: 'Uploading Images',
      description: 'Securely uploading to Azure Blob Storage...',
    },
    analyzing: {
      icon: Eye,
      title: 'Analyzing Image Quality',
      description: 'Azure AI Vision checking clarity and defects...',
    },
    classifying: {
      icon: Sparkles,
      title: 'Classifying Grain Quality',
      description: 'Azure Custom Vision grading your grain...',
    },
    complete: {
      icon: CheckCircle2,
      title: 'Verification Complete',
      description: 'Your grain has been AI-verified successfully.',
    },
  };

  const currentStep = stepInfo[step];
  const Icon = currentStep.icon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-secondary/50 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          AI Quality Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${step === 'complete' ? 'bg-grade-a/10' : 'bg-primary/10'}`}>
              <Icon className={`h-5 w-5 ${step === 'complete' ? 'text-grade-a' : 'text-primary'} ${step !== 'complete' ? 'animate-spin' : ''}`} />
            </div>
            <div className="flex-1">
              <p className="font-medium">{currentStep.title}</p>
              <p className="text-sm text-muted-foreground">{currentStep.description}</p>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Upload</span>
            <span>Analyze</span>
            <span>Classify</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Results Section */}
        {result && step === 'complete' && (
          <div className="space-y-4 pt-4 border-t animate-fade-in">
            <div className="flex items-center justify-between">
              <QualityBadge grade={result.qualityGrade} confidenceScore={result.confidenceScore} size="lg" />
              <Badge variant="secondary" className="gap-1">
                <Eye className="h-3 w-3" />
                {result.imageClarity}% Clarity
              </Badge>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm">{result.explanation}</p>
            </div>

            {result.defectsDetected.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-grade-b" />
                  Detected Issues:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.defectsDetected.map((defect, i) => (
                    <Badge key={i} variant="gradeB" className="text-xs">
                      {defect}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center pt-2">
              {/* TODO: Azure Custom Vision model trained on 50,000+ grain samples */}
              Verified using Azure AI Vision & Custom Vision models
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
