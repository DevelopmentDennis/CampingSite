export type ZoneId = "source" | "unnecessary" | "needed";

export interface CampItem {
  id: string;
  label?: string;
  emoji: string;
  isCustom?: boolean;
  customName?: string;
  isExpandable?: boolean;
  expandedContent?: string;
}

// Multi-step state management
export type StepZones = Record<ZoneId, CampItem[]>;
export type MultiStepZones = Record<number, StepZones>;

export interface MultiStepBuilderState {
  zones: MultiStepZones;
  currentStep: number;
}
