// Prototype Clock Authority: Wed 7 Oct 2026 19:30 Asia/Manila
export const DEFAULT_PROTOTYPE_CLOCK = new Date('2026-10-07T19:30:00+08:00');

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
    return this.current.toISOString().split('T')[0];
  }
}

export const prototypeClock = new Clock();
