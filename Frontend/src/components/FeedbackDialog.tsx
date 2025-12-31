import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface FeedbackDialogProps {
  listingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ listingId, open, onOpenChange }: FeedbackDialogProps) {
  const [qualityMatched, setQualityMatched] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const { addFeedback, currentUser } = useApp();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (qualityMatched === null || !currentUser) return;

    addFeedback({
      listingId,
      buyerId: currentUser.id,
      qualityMatched,
      comment: comment || undefined,
      createdAt: new Date(),
    });

    toast({
      title: 'Feedback Submitted',
      description: 'Thank you! Your feedback helps improve AI verification accuracy.',
    });

    onOpenChange(false);
    setQualityMatched(null);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Quality Feedback
          </DialogTitle>
          <DialogDescription>
            Help us improve AI verification by sharing your experience with this grain quality.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">Did the grain quality match the AI grade?</p>
            <div className="flex gap-3">
              <Button
                variant={qualityMatched === true ? 'success' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setQualityMatched(true)}
              >
                <ThumbsUp className="h-4 w-4" />
                Quality Matched
              </Button>
              <Button
                variant={qualityMatched === false ? 'destructive' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setQualityMatched(false)}
              >
                <ThumbsDown className="h-4 w-4" />
                Did Not Match
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Additional Comments (Optional)</p>
            <Textarea
              placeholder="Share details about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="bg-secondary/50 rounded-lg p-3 text-xs text-muted-foreground">
            <p>
              <strong>Why feedback matters:</strong> Your feedback helps train our AI models 
              to provide more accurate quality assessments for future transactions.
            </p>
            {/* TODO: Azure Machine Learning uses this feedback to retrain quality models */}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={qualityMatched === null}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
