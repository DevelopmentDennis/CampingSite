import type { CampItem } from "./types";

export interface FormSection {
  id: number;
  title: string;
  subtitle: string;
  fields: CampItem[];
}

export const FORM_SECTIONS: FormSection[] = [
  {
    id: 0,
    title: "Persönliche Daten Kind",
    subtitle: "Personal information about the child",
    fields: [
      { id: "child-name", label: "Name", emoji: "👤" },
      { id: "child-vorname", label: "Vorname", emoji: "👤" },
      { id: "child-geburtsdatum", label: "Geburtsdatum", emoji: "🎂" },
      { id: "child-address", label: "Adresse", emoji: "🏠" },
      { id: "child-augenfarbe", label: "Augenfarbe", emoji: "👁️" },
      { id: "child-größe", label: "Größe des Kindes", emoji: "📏" },
      { id: "child-ausweisnummer", label: "Ausweisnummer", emoji: "🆔" },
      { id: "child-schuhgröße", label: "Schuhgröße", emoji: "👟" },
      {
        id: "child-kleidergröße",
        label: "T-Shirt und Pulli Größe",
        emoji: "👕",
      },
      {
        id: "child-handy-erlaubt",
        label: "Mein Kind darf ein Mobiltelefon mitführen",
        emoji: "📱",
      },
      {
        id: "child-geräte",
        label: "Mein Kind hat folgende Geräte im Zeltlager dabei",
        emoji: "📦",
        isExpandable: true,
        expandedContent:
          "Smartwacht\nHandy\nMusikbox\nTablett\nKopfhörer\nPowerbank",
      },
      {
        id: "child-handynummer",
        label: "Handynummer meines Kindes",
        emoji: "📞",
      },
      {
        id: "child-social-media",
        label: "Mein Kind nutzt soziale Netzwerke",
        emoji: "📲",
      },
      { id: "child-relationship", label: "Beziehungsstatus", emoji: "💕" },
      {
        id: "child-previous-camp",
        label: "Mein Kind war bereits im Zeltlager dabei",
        emoji: "🏕️",
      },
      {
        id: "child-bedtime-story",
        label: "Mein Kind möchte Gute Nacht Geschichte",
        emoji: "📖",
      },
      {
        id: "child-nap",
        label: "Mein Kind braucht einen Mittagsschlaf",
        emoji: "😴",
      },
      {
        id: "child-money",
        label: "Mein Kind hat folgenden Betrag mit im Zeltlager dabei",
        emoji: "💰",
      },
      {
        id: "child-outdoor-experience",
        label: "Mein Kind hat Outdoor-Erfahrung (1-10)",
        emoji: "🌲",
      },
      {
        id: "child-religion",
        label: "Mein Kind gehört folgender Konversion an",
        emoji: "⛪",
      },
      {
        id: "child-standort-erlaubnis",
        label: "Erlaubnis für Live Standort anfordern",
        emoji: "📍",
      },
      {
        id: "child-feuerlöscher",
        label: "Mein Kind kann mit einem Feuerlöscher umgehen",
        emoji: "🧯",
      },
      {
        id: "child-lagerfeuer",
        label: "Mein Kind hat folgende Qualifizierung Lagerfeuer zu machen",
        emoji: "🔥",
      },
      { id: "child-schnarchen", label: "Mein Kind schnarcht", emoji: "😴" },
    ],
  },
  {
    id: 1,
    title: "Persönliche Daten Eltern/Personensorgeberechtigte",
    subtitle: "Parent or guardian contact information",
    fields: [
      {
        id: "parent-name-1",
        label: "Name Vorname (Elternteil 1)",
        emoji: "👨",
      },
      {
        id: "parent-name-2",
        label: "Name Vorname (Elternteil 2)",
        emoji: "👩",
      },
      { id: "parent-email", label: "Mailadresse", emoji: "📧" },
      {
        id: "parent-phone",
        label: "Während des Zeltlagers sind wir erreichbar unter",
        emoji: "☎️",
      },
      {
        id: "parent-emergency-contact",
        label: "Weiterer Notfallkontakt",
        emoji: "🆘",
      },
    ],
  },
  {
    id: 2,
    title: "Krankheiten/Gesundheitliche Beschwerden",
    subtitle: "Health and medical information",
    fields: [
      {
        id: "health-medications",
        label: "Mein Kind muss Medikamente einnehmen",
        emoji: "💊",
      },
      {
        id: "health-medication-supervision",
        label: "Muss die Einnahme vom Leitungsteam überwacht werden",
        emoji: "👁️",
      },
      {
        id: "health-conditions",
        label: "Mein Kind hat eine Krankheit oder besondere Schwierigkeit",
        expandedContent:
          "Diabetes\nAsthma\nAllergie\nADS/ ADHS\nbestimmte Ängste\nBettnässer\nSchlafwandeln",
        emoji: "⚕️",
      },
      {
        id: "health-zecken-splitter",
        label: "Erlaubnis Zecken zu ziehen und Splitter zu entfernen",
        emoji: "🩹",
      },
      { id: "health-blutgruppe", label: "Blutgruppe des Kindes", emoji: "🩸" },
      {
        id: "health-vorsorge",
        label: "Wann war die letzte Vorsorgeuntersuchung",
        emoji: "🏥",
      },
      {
        id: "health-körpergewicht",
        label: "Körpergewicht des Kindes",
        emoji: "⚖️",
      },
      {
        id: "health-familiäre-belastung",
        label: "Besteht eine familiäre Vorbelastung für Krankheiten",
        emoji: "🧬",
      },
    ],
  },
  {
    id: 3,
    title: "Verpflegung",
    subtitle: "Dietary preferences and requirements",
    fields: [
      { id: "food-type", label: "Unser/Mein Kind isst", emoji: "🍽️" },
      {
        id: "food-allergies",
        label:
          "Mein Kind hat ernährungsrelevante Allergien/Unverträglichkeiten",
        emoji: "⚠️",
      },
      {
        id: "food-favorites",
        label: "Diese Speisen mag mein Kind besonders gern",
        emoji: "😋",
      },
      {
        id: "food-dislikes",
        label: "Diese Speisen lehnt mein Kind ab",
        emoji: "🤢",
      },
      {
        id: "food-wishes",
        label: "Folgende Essens-Wünsche hat mein Kind im Zeltlager",
        emoji: "🥘",
      },
    ],
  },
  {
    id: 4,
    title: "Badeausflüge",
    subtitle: "Swimming and water activities",
    fields: [
      {
        id: "swimming-allowed",
        label: "Unser/Mein Kind darf während der Veranstaltung baden",
        emoji: "🏊",
      },
      {
        id: "swimming-level",
        label: "Mein Kind ist Nichtschwimmer",
        emoji: "🏊",
      },
      { id: "swimming-badges", label: "Schwimmabzeichen", emoji: "🏆" },
    ],
  },
  {
    id: 5,
    title: "Bildrechte und Öffentlichkeitsarbeit",
    subtitle: "Photo and video rights",
    fields: [
      {
        id: "rights-photos-videos",
        label: "Während des Zeltlagers werden Fotos und Videos gemacht",
        emoji: "📸",
      },
    ],
  },
  {
    id: 6,
    title: "Sonstige Infos",
    subtitle: "Additional information and consent",
    fields: [
      {
        id: "misc-minor-leaders",
        label: "Erlaubnis für minderjährige Gruppenleiter/innen Aufsicht",
        emoji: "👦",
      },
      {
        id: "misc-rule-violations",
        label: "Regelverstoße können zum Nachhauseschicken führen",
        emoji: "⚠️",
      },
      {
        id: "misc-medical-emergency",
        label: "Erlaubnis für medizinische Maßnahmen in Notfällen",
        emoji: "🚑",
      },
      {
        id: "misc-free-time",
        label: "Teilnehmende können sich in Freizeiten frei bewegen",
        emoji: "🎯",
      },
      {
        id: "misc-eye-rolling",
        label: "Übermäßiges Augenrollen kann als Regelverstoß gewertet werden",
        emoji: "🙄",
      },
    ],
  },
];

export function getFormSection(stepId: number): FormSection | undefined {
  return FORM_SECTIONS.find((section) => section.id === stepId);
}

export const TOTAL_STEPS = FORM_SECTIONS.length;
