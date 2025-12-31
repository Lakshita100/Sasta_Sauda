import { getTrustColor } from '@/data/mockData';
import { Star, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TrustScoreProps {
  score: number;
  showLabel?: boolean;
}

export function TrustScore({ score, showLabel = true }: TrustScoreProps) {
  const colorClass = getTrustColor(score);
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex items-center gap-1.5 ${colorClass}`}>
          <Star className="h-4 w-4 fill-current" />
          <span className="font-semibold">{score}</span>
          {showLabel && <span className="text-xs opacity-75">Trust</span>}
          <Info className="h-3 w-3 opacity-50" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="font-medium">Seller Trust Score: {score}/100</p>
        <p className="text-xs mt-1 opacity-75">
          Trust score is calculated based on historical AI-verified listings, 
          buyer feedback, and consistency of quality grades.
        </p>
        {/* TODO: Azure Machine Learning will compute trust scores based on seller history */}
      </TooltipContent>
    </Tooltip>
  );
}
