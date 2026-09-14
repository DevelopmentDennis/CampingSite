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
      { id: "child-name", label: "Name", emoji: "👤", answerType: "text" },
      {
        id: "child-vorname",
        label: "Vorname",
        emoji: "👤",
        answerType: "text",
      },
      {
        id: "child-geburtsdatum",
        label: "Geburtsdatum",
        emoji: "🎂",
        answerType: "text",
      },
      {
        id: "child-address",
        label: "Adresse",
        emoji: "🏠",
        answerType: "text",
      },
      {
        id: "child-augenfarbe",
        label: "Augenfarbe",
        emoji: "👁️",
        answerType: "text",
      },
      {
        id: "child-größe",
        label: "Größe des Kindes",
        emoji: "📏",
        answerType: "text",
      },
      {
        id: "child-ausweisnummer",
        label: "Ausweisnummer",
        emoji: "🆔",
        answerType: "text",
      },
      {
        id: "child-schuhgröße",
        label: "Schuhgröße",
        emoji: "👟",
        answerType: "text",
      },
      {
        id: "child-kleidergröße",
        label: "T-Shirt und Pulli Größe",
        emoji: "👕",
        answerType: "text",
      },
      {
        id: "child-handy-erlaubt",
        label: "Mein Kind darf ein Mobiltelefon mitführen",
        emoji: "📱",
        answerType: "yesno",
      },
      {
        id: "child-geräte",
        label: "Mein Kind hat folgende Geräte im Zeltlager dabei",
        emoji: "📦",
        isExpandable: true,
        expandedContent:
          "Smartwatch\nHandy\nMusikbox\nTablett\nKopfhörer\nPowerbank",
        answerType: "multiselect",
      },
      {
        id: "child-handynummer",
        label: "Handynummer meines Kindes",
        emoji: "📞",
        answerType: "text",
      },
      {
        id: "child-social-media",
        label: "Mein Kind nutzt soziale Netzwerke",
        emoji: "📲",
        answerType: "yesno",
      },
      {
        id: "child-relationship",
        label: "Beziehungsstatus meines Kindes",
        emoji: "💕",
        answerType: "text",
      },
      {
        id: "child-previous-camp",
        label: "Mein Kind war bereits im Zeltlager dabei",
        emoji: "🏕️",
        answerType: "yesno",
      },
      {
        id: "child-bedtime-story",
        label: "Mein Kind möchte eine Gute Nacht Geschichte",
        emoji: "📖",
        answerType: "yesno",
      },
      {
        id: "child-nap",
        label: "Mein Kind braucht einen Mittagsschlaf",
        emoji: "😴",
        answerType: "yesno",
      },
      {
        id: "child-money",
        label: "Mein Kind hat folgenden Geldbetrag mit im Zeltlager dabei",
        emoji: "💰",
        answerType: "text",
      },
      {
        id: "child-outdoor-experience",
        label: "Mein Kind hat Outdoor-Erfahrung (1-10)",
        emoji: "🌲",
        answerType: "text",
      },
      {
        id: "child-religion",
        label: "Mein Kind gehört folgender Konfession an",
        emoji: "⛪",
        answerType: "text",
      },
      {
        id: "child-standort-erlaubnis",
        label: "Erlaubnis für Live Standort anfordern",
        emoji: "📍",
        answerType: "yesno",
      },
      {
        id: "child-feuerlöscher",
        label: "Mein Kind kann mit einem Feuerlöscher umgehen",
        emoji: "🧯",
        answerType: "yesno",
      },
      {
        id: "child-lagerfeuer",
        label: "Mein Kind hat folgende Qualifizierung Lagerfeuer zu machen",
        emoji: "🔥",
        answerType: "text",
      },
      {
        id: "child-schnarchen",
        label: "Mein Kind schnarcht",
        emoji: "😴",
        answerType: "yesno",
      },
    ],
  },
  {
    id: 1,
    title: "Persönliche Daten Eltern/Personensorgeberechtigte",
    subtitle: "Parent or guardian contact information",
    fields: [
      {
        id: "parent-name-1",
        label: "Name Vorname (Erziehungsberechtigte 1)",
        emoji: "👨",
        answerType: "text",
      },
      {
        id: "parent-name-2",
        label: "Name Vorname (Erziehungsberechtigte 2)",
        emoji: "👩",
        answerType: "text",
      },
      {
        id: "parent-income",
        label: "Haushalts-Monatseinkommen (Liquiditätsnachweis)",
        emoji: "💵",
        answerType: "text",
      },
      {
        id: "parent-location-during-camp",
        label:
          "Ort(e) an denen sich die Erziehungsberechtigten während des Zeltlagers aufhalten",
        emoji: "📍",
        answerType: "text",
      },
      {
        id: "parent-email",
        label: "Mailadresse",
        emoji: "📧",
        answerType: "text",
      },
      {
        id: "parent-phone",
        label: "Während des Zeltlagers sind wir erreichbar unter",
        emoji: "☎️",
        answerType: "text",
      },
      {
        id: "parent-emergency-contact",
        label: "Weiterer Notfallkontakt",
        emoji: "🆘",
        answerType: "text",
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
        answerType: "yesno",
      },
      {
        id: "health-medication-supervision",
        label: "Muss die Einnahme vom Leitungsteam überwacht werden",
        emoji: "👁️",
        answerType: "yesno",
      },
      {
        id: "health-conditions",
        label: "Mein Kind hat eine Krankheit oder besondere Schwierigkeit",
        isExpandable: true,
        expandedContent:
          "Diabetes\nAsthma\nAllergie\nADS/ ADHS\nbestimmte Ängste\nBettnässer\nSchlafwandeln",
        emoji: "⚕️",
        answerType: "multiselect",
      },
      {
        id: "health-zecken-splitter",
        label: "Erlaubnis Zecken zu ziehen und Splitter zu entfernen",
        emoji: "🩹",
        answerType: "yesno",
      },
      {
        id: "health-blutgruppe",
        label: "Blutgruppe des Kindes",
        emoji: "🩸",
        answerType: "text",
      },
      {
        id: "health-vorsorge",
        label: "Wann war die letzte Vorsorgeuntersuchung",
        emoji: "🏥",
        answerType: "text",
      },
      {
        id: "health-körpergewicht",
        label: "Körpergewicht des Kindes",
        emoji: "⚖️",
        answerType: "text",
      },
      {
        id: "health-familiäre-belastung",
        label: "Besteht eine familiäre Vorbelastung für Krankheiten",
        emoji: "🧬",
        answerType: "yesno",
      },
    ],
  },
  {
    id: 3,
    title: "Verpflegung",
    subtitle: "Dietary preferences and requirements",
    fields: [
      {
        id: "food-type",
        label: "Unser/Mein Kind isst",
        emoji: "🍽️",
        answerType: "text",
      },
      {
        id: "food-allergies",
        label:
          "Mein Kind hat ernährungsrelevante Allergien/Unverträglichkeiten",
        emoji: "⚠️",
        answerType: "text",
      },
      {
        id: "food-favorites",
        label: "Diese Speisen mag mein Kind besonders gern",
        emoji: "😋",
        answerType: "text",
      },
      {
        id: "food-dislikes",
        label: "Diese Speisen lehnt mein Kind ab",
        emoji: "🤢",
        answerType: "text",
      },
      {
        id: "food-wishes",
        label: "Folgende Essens-Wünsche hat mein Kind im Zeltlager",
        emoji: "🥘",
        answerType: "text",
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
        label: "Mein Kind darf während der Veranstaltung baden",
        emoji: "🏊",
        answerType: "yesno",
      },
      {
        id: "swimming-level",
        label:
          "Mein Kind kann sich 10 Minuten ohne Hilfsmittel über Wasser halten",
        emoji: "🏊",
        answerType: "yesno",
      },
      {
        id: "swimming-badges",
        label: "Schwimmabzeichen",
        emoji: "🏆",
        answerType: "text",
      },
      {
        id: "swimming-picnic",
        label: "Mein Kind kann eine Picknickdecke mitbringen",
        emoji: "🧺",
        answerType: "yesno",
      },
      {
        id: "swimming-diving",
        label:
          "Mein Kind kann unter Wasser die Luft anhalten für folgende Zeit",
        emoji: "🏊",
        isExpandable: true,
        expandedContent: "0s\n30s\n60+s",
        answerType: "multiselect",
      },
      {
        id: "swimming-food",
        label: "Mein Kind isst bei Freibadpommes folgende Anzahl Portionen",
        emoji: "🍟",
        answerType: "text",
      },
    ],
  },
  {
    id: 5,
    title: "Bildrechte und Öffentlichkeitsarbeit",
    subtitle: "Photo and video rights",
    fields: [
      {
        id: "rights-photos-taken",
        label: "Dürfen während des Zeltlagers Fotos und Videos gemacht werden",
        emoji: "📸",
        answerType: "yesno",
      },
      {
        id: "rights-photos-made",
        label: "Mein Kind darf von anderen Fotos und Videos machen",
        emoji: "📸",
        answerType: "yesno",
      },
      {
        id: "rights-photos-usage",
        label:
          "Fotos/Videos von meinem Kind dürfen für Öffentlichkeitsarbeit in folgenden Medien genutzt werden",
        isExpandable: true,
        expandedContent: "Homepage\nInstagram\nTikTok\nZeitung",
        emoji: "📸",
        answerType: "multiselect",
      },
      {
        id: "rights-photos-sticker",
        label:
          "Fotos von meinem Kind dürfen von der Gruppe als Whatsapp-Sticker verwendet werden",
        emoji: "📸",
        answerType: "yesno",
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
        label:
          "Mir ist bewusst, dass auch minderjährige Gruppenleitungen Aufsicht über mein Kind führen können",
        emoji: "👦",
        answerType: "yesno",
      },
      {
        id: "misc-rule-violations",
        label: "Regelverstoße können zum Nachhauseschicken führen",
        emoji: "⚠️",
        answerType: "yesno",
      },
      {
        id: "misc-medical-emergency",
        label: "Erlaubnis für medizinische Maßnahmen in Notfällen",
        emoji: "🚑",
        answerType: "yesno",
      },
      {
        id: "misc-free-time",
        label:
          "Teilnehmende können sich in Freizeit ohne direkte Aufsicht in 3er-Gruppen frei bewegen",
        emoji: "🎯",
        answerType: "yesno",
      },
      {
        id: "misc-eye-rolling",
        label: "Übermäßiges Augenrollen kann als Regelverstoß gewertet werden",
        emoji: "🙄",
        answerType: "yesno",
      },
    ],
  },
];

export function getFormSection(stepId: number): FormSection | undefined {
  return FORM_SECTIONS.find((section) => section.id === stepId);
}

export const TOTAL_STEPS = FORM_SECTIONS.length;
