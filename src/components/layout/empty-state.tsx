"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="w-12 h-12 rounded-metric bg-surface-secondary flex items-center justify-center mb-4">
        <Icon size={22} strokeWidth={1.5} className="text-text-tertiary" />
      </div>
      <h3 className="text-card-title text-text-primary mb-1">{title}</h3>
      <p className="text-meta text-text-secondary mb-6 text-center max-w-sm">{description}</p>
      {action}
    </motion.div>
  );
}
