import { motion } from 'framer-motion';
import { useCrowdState } from '@/store';

const MagicDancer = () => {
  const { currentEnergy } = useCrowdState();

  return (
    <motion.div
      className="fixed bottom-4 right-4 w-24 h-24 bg-rich-black/50 rounded-full flex items-center justify-center text-white"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="text-center">
        <p className="text-xs">Energy</p>
        <p className="text-2xl font-bold">{Math.round(currentEnergy * 100)}%</p>
      </div>
    </motion.div>
  );
};

export default MagicDancer;
