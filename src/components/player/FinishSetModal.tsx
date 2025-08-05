import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { finalizeSet } from '@/services/api';

interface FinishSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  setId: string;
  onComplete?: () => void;
}

export default function FinishSetModal({
  isOpen,
  onClose,
  setId,
  onComplete,
}: FinishSetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await finalizeSet(setId);
      onClose();
      if (onComplete) onComplete();
    } catch (err) {
      console.error('Error finalizing set:', err);
      setError('Failed to finalize set. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Finish This Set?</h2>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-300 text-center">
          This will mark your set as complete and save it to your history.
        </p>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <div className="flex justify-between mt-6">
          <Button onClick={onClose} variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleFinish} disabled={isSubmitting}>
            {isSubmitting ? 'Finishing...' : 'Finish Set'}
          </Button>
        </div>
      </div>
    </div>
  );
}
