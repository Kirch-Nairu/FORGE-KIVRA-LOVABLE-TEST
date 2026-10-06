import React from 'react';

interface StatusChipProps {
  label: string;
  variant?: 'tight' | 'comfortable' | 'balanced' | 'critical' | 'neutral';
}

export const StatusChip: React.FC<StatusChipProps> = ({ label, variant = 'neutral' }) => {
  const styles = {
    tight: 'bg-amber/15 text-amber border-amber/30',
    comfortable: 'bg-pine-soft text-pine border-pine/30',
    balanced: 'bg-pine-soft/60 text-pine border-pine/20',
    critical: 'bg-brick/15 text-brick border-brick/30',
    neutral: 'bg-surface-alt text-ink-muted border-ink-hairline',
  }[variant];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles}`}>
      {label}
    </span>
  );
};
