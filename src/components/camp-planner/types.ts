export type ZoneId = "source" | "unnecessary" | "needed";

export interface CampItem {
  id: string;
  label?: string;
  emoji: string;
  isCustom?: boolean;
  customName?: string;
}
