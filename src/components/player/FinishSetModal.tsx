import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// import { createSessionRecord } from "@/services/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sessionTime: number;
  tracksPlayed: number;
}
const FinishSetModal = ({
  sessionTime: _sessionTime,
  tracksPlayed: _tracksPlayed,
  onClose,
}: Props) => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      // await createSessionRecord({ sessionTime, tracksPlayed });
      onClose();
      navigate('/studio');
    } catch (error) {
      console.error('Error finishing session:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 w-[90%] max-w-md text-center shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Session Finished</h2>
        <p className="mb-6 text-muted-foreground">
          Great job! Would you like to save your session results to your
          profile?
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={onClose} variant="ghost">
            Not Now
          </Button>
          <Button onClick={handleSubmit}>Save Session</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FinishSetModal;
