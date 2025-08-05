import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { createSessionRecord } from "@/services/api";
import { FC } from "react";

<<<<<<< HEAD
// Extendable type for a DJ set
interface DJSet {
  sessionId: string;
  // Add more properties as needed
=======
interface DJSet {
  sessionId: string;
>>>>>>> 76f6768 (Fix FinishSetModal merge conflict)
}

interface FinishSetModalProps {
  set: DJSet;
  onClose: () => void;
}

const FinishSetModal: FC<FinishSetModalProps> = ({ set, onClose }) => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await createSessionRecord(set.sessionId);
      onClose();
      navigate("/studio");
    } catch (error) {
      console.error("Error saving session:", error);
      // Optional: show toast or error message here
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="finish-session-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-8 w-[90%] max-w-md text-center shadow-xl"
      >
        <h2
          id="finish-session-title"
          className="text-2xl font-bold mb-4 text-gray-900"
        >
          Session Finished
        </h2>
        <p className="mb-6 text-muted-foreground">
          Great job! Would you like to save your session results to your profile?
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="ghost" onClick={onClose}>
            Not Now
          </Button>
          <Button onClick={handleSubmit}>Save Session</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default FinishSetModal;
