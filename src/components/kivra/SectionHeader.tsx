import React from 'react';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionText, onAction, className = '' }) => {
  return (
    <div className={`flex items-center justify-between pb-2 mb-3 border-b border-ink-hairline ${className}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">{title}</h2>
      {actionText && (
        <button
          onClick={onAction}
          className="text-xs font-medium text-pine hover:underline transition-colors focus:outline-none"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
