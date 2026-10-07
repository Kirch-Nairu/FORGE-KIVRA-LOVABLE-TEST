// Prototype Clock Authority: Wed 7 Oct 2026 19:30 Asia/Manila
export const DEFAULT_PROTOTYPE_CLOCK = new Date('2026-10-07T19:30:00+08:00');

// Canonical Manila date key: YYYY-MM-DD
export function getManilaDateKey(dateOrTimestamp: Date | string): string {
  const d = typeof dateOrTimestamp === 'string' ? new Date(dateOrTimestamp) : dateOrTimestamp;
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = formatter.formatToParts(d);
  const partMap: Record<string, string> = {};
  parts.forEach((p) => {
    partMap[p.type] = p.value;
  });
  
  return `${partMap.year}-${partMap.month}-${partMap.day}`;
}

export class Clock {
  private current: Date;

  constructor(initial: Date = DEFAULT_PROTOTYPE_CLOCK) {
    this.current = new Date(initial);
  }

  get now(): Date {
    return new Date(this.current);
  }

  setTime(date: Date) {
    this.current = new Date(date);
  }

  reset() {
    this.current = new Date(DEFAULT_PROTOTYPE_CLOCK);
  }

  get isoDate(): string {
    return getManilaDateKey(this.current);
  }
}

export const prototypeClock = new Clock();
