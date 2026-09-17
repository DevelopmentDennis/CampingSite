export type ZoneId = "source" | "unnecessary" | "needed";

// Determines how the field is rendered as a fillable entry on the exported PDF
export type AnswerType = "text" | "yesno" | "multiselect" | "none";

export interface CampItem {
  id: string;
  label?: string;
  emoji: string;
  isCustom?: boolean;
  customName?: string;
  isExpandable?: boolean;
  expandedContent?: string;
  answerType?: AnswerType;
}

// Multi-step state management
export type StepZones = Record<ZoneId, CampItem[]>;
export type MultiStepZones = Record<number, StepZones>;

export interface MultiStepBuilderState {
  zones: MultiStepZones;
  currentStep: number;
}
