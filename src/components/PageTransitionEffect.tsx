"use client"
import { motion } from "framer-motion";


export default function PageTransitionEffect({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full flex-col h-full gap-8 flex justify-start items-center"
    >
      {children}
    </motion.div>
  );
}