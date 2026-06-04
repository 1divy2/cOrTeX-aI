import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-border bg-secondary/50 p-8 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background border border-border">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background transition-all hover:scale-[1.02] hover:bg-accent hover:text-white"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
