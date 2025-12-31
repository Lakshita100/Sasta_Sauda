import { Badge } from '@/components/ui/badge';
import { QualityGrade } from '@/types';
import { Shield } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface QualityBadgeProps {
  grade: QualityGrade;
  confidenceScore?: number;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function QualityBadge({ grade, confidenceScore, showTooltip = true, size = 'md' }: QualityBadgeProps) {
  const variant = grade === 'A' ? 'gradeA' : grade === 'B' ? 'gradeB' : 'gradeC';
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const content = (
    <Badge variant={variant} className={`gap-1 ${sizeClasses[size]}`}>
      <Shield className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      Grade {grade}
      {confidenceScore && <span className="opacity-75">({confidenceScore}%)</span>}
    </Badge>
  );

  if (!showTooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {content}
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">AI Quality Grade: {grade}</p>
        {confidenceScore && <p className="text-xs opacity-75">Confidence: {confidenceScore}%</p>}
        <p className="text-xs mt-1 opacity-75">
          {grade === 'A' && 'Premium quality - Excellent grain structure'}
          {grade === 'B' && 'Good quality - Minor variations detected'}
          {grade === 'C' && 'Standard quality - Some impurities present'}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
