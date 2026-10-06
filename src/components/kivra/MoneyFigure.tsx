import React from 'react';
import { formatPesos } from '../../domain/money';
import { useKivra } from '../../state/kivraStore';

interface MoneyFigureProps {
  centavos: number;
  size?: 'hero' | 'lg' | 'md' | 'sm';
  semantic?: 'neutral' | 'pine' | 'brick' | 'muted';
  showSign?: boolean;
  className?: string;
}

export const MoneyFigure: React.FC<MoneyFigureProps> = ({
  centavos,
  size = 'md',
  semantic = 'neutral',
  showSign = false,
  className = '',
}) => {
  const { isPrivacyMasked } = useKivra();

  if (isPrivacyMasked) {
    return <span className={`tabular-nums font-medium tracking-tight select-none ${className}`}>₱••••••</span>;
  }

  const text = formatPesos(centavos, { showDecimals: false, sign: showSign });

  const sizeClass = {
    hero: 'text-4xl md:text-5xl font-bold tracking-tight',
    lg: 'text-2xl font-semibold',
    md: 'text-lg font-medium',
    sm: 'text-sm font-normal',
  }[size];

  // Correction B: Ordinary expenses remain neutral / Ink.
  // Brick is reserved for risk / shortfall / overdue / error.
  const colorClass = {
    neutral: 'text-ink',
    pine: 'text-pine font-semibold',
    brick: 'text-brick font-semibold',
    muted: 'text-ink-muted',
  }[semantic];

  return <span className={`tabular-nums ${sizeClass} ${colorClass} ${className}`}>{text}</span>;
};
