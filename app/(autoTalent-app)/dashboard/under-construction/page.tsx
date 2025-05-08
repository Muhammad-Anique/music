// components/UnderConstruction.tsx
'use client';
import { motion } from 'framer-motion';

export default function UnderConstruction() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-6"
      >
        <motion.h1
          className="text-5xl font-bold"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          🚧 Under Construction 🚧
        </motion.h1>
        <p className="text-xl">We’re working hard to launch something amazing. Stay tuned!</p>
        <motion.div
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </motion.div>
    </div>
  );
}
