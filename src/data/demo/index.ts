import { mikaProfile } from './mika';
import { danProfile } from './dan';
import { ysaProfile } from './ysa';
import { PersonaProfile } from '../../domain/types';

export const DEMO_PERSONAS: Record<string, PersonaProfile> = {
  mika: mikaProfile,
  dan: danProfile,
  ysa: ysaProfile,
};
