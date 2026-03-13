import type { Commitment, ContentType, EmotionalState, Goal } from '@/types/onboarding';

export const emotionalStateContent: Record<
  EmotionalState,
  {
    label: string;
    support: string;
    pathActions: [string, string, string];
  }
> = {
  anxious: {
    label: 'Anxious',
    support: 'Ground yourself in gentleness and reassurance.',
    pathActions: [
      'Read a calming verse slowly.',
      'Pause for a quiet breath before you continue.',
      'Choose one dua for protection and ease.',
    ],
  },
  seeking: {
    label: 'Seeking',
    support: 'Stay close to reflection and meaningful direction.',
    pathActions: [
      'Open one reading with the intention to listen closely.',
      'Journal one thing you are hoping for.',
      "Spend a few quiet minutes with Qur'an reflection.",
    ],
  },
  grateful: {
    label: 'Grateful',
    support: 'Build on that calm with consistency and remembrance.',
    pathActions: [
      'Begin with a verse of gratitude.',
      'Keep a short dhikr practice today.',
      'Carry one blessing into your next prayer.',
    ],
  },
  weary: {
    label: 'Weary',
    support: 'Keep today light, steady, and restorative.',
    pathActions: [
      'Choose a shorter reading and stay with it.',
      'Listen instead of forcing more effort.',
      'Close with a dua for rest and renewal.',
    ],
  },
};

export const goalLabels: Record<Goal, string> = {
  'grow-closer': 'growing closer to Allah',
  'find-peace': 'finding peace and patience',
  'sleep-better': 'building a calmer sleep routine',
  'focus-prayer': 'finding focus in prayer',
  'connect-quran': "connecting with the Qur'an",
};

export const contentLabels: Record<ContentType, string> = {
  meditations: 'meditations',
  'sleep-stories': 'sleep stories',
  'dhikr-dua': 'dhikr and dua',
  quran: "Qur'an reflection",
};

export const commitmentLabels: Record<Commitment, string> = {
  '5min': '5-minute daily rhythm',
  '15min': '15-minute daily rhythm',
  '30min': '30-minute daily rhythm',
};

export function formatLabelList(
  values: string[],
  labels: Record<string, string>,
  emptyLabel: string,
  maxItems = 2,
): string {
  if (values.length === 0) {
    return emptyLabel;
  }

  const mapped = values.map((value) => labels[value] ?? value);
  const visible = mapped.slice(0, maxItems);

  if (mapped.length <= maxItems) {
    return visible.join(' • ');
  }

  return `${visible.join(' • ')} +${mapped.length - maxItems} more`;
}
