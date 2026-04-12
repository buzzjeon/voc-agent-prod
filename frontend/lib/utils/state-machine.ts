export const STATE_TRANSITIONS = {
  VOC: {
    NEW: ['IN_PROGRESS'],
    IN_PROGRESS: ['RESOLVED'],
    RESOLVED: [],
  },
  GUIDE: {
    DRAFT: ['PENDING_APPROVAL'],
    PENDING_APPROVAL: ['APPROVED', 'DRAFT'],
    APPROVED: ['PUBLISHED'],
    PUBLISHED: [],
  },
  APPROVAL: {
    PENDING: ['APPROVED', 'REJECTED'],
    APPROVED: [],
    REJECTED: [],
  },
} as const;

export type EntityType = keyof typeof STATE_TRANSITIONS;
export type VOCStatus = keyof typeof STATE_TRANSITIONS.VOC;
export type GuideStatus = keyof typeof STATE_TRANSITIONS.GUIDE;
export type ApprovalStatus = keyof typeof STATE_TRANSITIONS.APPROVAL;

export function isValidTransition(
  entity: EntityType,
  from: string,
  to: string
): boolean {
  const transitions = STATE_TRANSITIONS[entity];
  const allowed = transitions[from as keyof typeof transitions] as readonly string[] | undefined;
  return allowed?.includes(to) ?? false;
}

export function getValidTransitions(entity: EntityType, from: string): readonly string[] {
  const transitions = STATE_TRANSITIONS[entity];
  return (transitions[from as keyof typeof transitions] as readonly string[]) ?? [];
}
