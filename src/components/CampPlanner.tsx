import { useCallback, useState } from "react";
import { Download, Tent } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import FormBuilderStepper from "./camp-planner/FormBuilderStepper";
import type { CampItem } from "./camp-planner/types";
import { FORM_SECTIONS } from "./camp-planner/formSections";

const DECOR_TENTS = [
  { top: "12%", left: "8%", rotate: "-8deg" },
  { top: "58%", left: "20%", rotate: "6deg" },
  { top: "26%", left: "38%", rotate: "-14deg" },
  { top: "62%", left: "54%", rotate: "10deg" },
  { top: "16%", left: "72%", rotate: "-6deg" },
  { top: "52%", left: "86%", rotate: "14deg" },
];

interface ExportState {
  neededFieldsByStep: Record<number, CampItem[]> | null;
  isCompleteStepper: boolean;
}

export default function CampPlanner() {
  const [campName, setCampName] = useState("");
  const [exportState, setExportState] = useState<ExportState>({
    neededFieldsByStep: null,
    isCompleteStepper: false,
  });

  const handleStepperComplete = useCallback(
    (neededFieldsByStep: Record<number, CampItem[]>) => {
      setExportState({
        neededFieldsByStep,
        isCompleteStepper: true,
      });
    },
    [],
  );

  const handleDownload = useCallback(() => {
    if (!exportState.neededFieldsByStep) return;

    const name = campName.trim() || "Mein Zeltlager Formular";
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(name, 105, 25, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    let yPosition = 45;
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 15;

    // Iterate through all steps and their needed fields
    Object.entries(exportState.neededFieldsByStep).forEach(
      ([stepId, items]) => {
        const section = FORM_SECTIONS.find((s) => s.id === parseInt(stepId));
        if (!section || items.length === 0) return;

        // Add section title if there's space
        if (yPosition + 8 > pageHeight - bottomMargin) {
          doc.addPage();
          yPosition = 15;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(section.title, 20, yPosition);
        yPosition += 8;

        // Add fields in this section
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        items.forEach((item) => {
          if (yPosition + 6 > pageHeight - bottomMargin) {
            doc.addPage();
            yPosition = 15;
          }

          const displayLabel = item.customName?.trim() || item.label || item.id;
          if (item.isCustom && item.customName?.trim()) {
            doc.setFont("helvetica", "italic");
            doc.text(`${item.label}: ${displayLabel}`, 30, yPosition);
          } else {
            doc.setFont("helvetica", "normal");
            doc.text(`• ${displayLabel}`, 30, yPosition);
          }
          yPosition += 6;
        });

        yPosition += 3; // Add spacing between sections
      },
    );

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Erstellt mit Camp Trip Planner", 105, pageHeight - 10, {
      align: "center",
    });
    doc.save(`${name.replace(/\s+/g, "_")}.pdf`);
  }, [campName, exportState.neededFieldsByStep]);

  // Show stepper while not complete
  if (!exportState.isCompleteStepper) {
    return <FormBuilderStepper onComplete={handleStepperComplete} />;
  }

  // Show completion view with camp name and download
  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="relative overflow-hidden bg-primary px-4 py-8 text-center text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          {DECOR_TENTS.map((tent, index) => (
            <Tent
              key={index}
              className="absolute h-10 w-10"
              style={{
                top: tent.top,
                left: tent.left,
                transform: `rotate(${tent.rotate})`,
              }}
            />
          ))}
        </div>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 text-4xl font-bold md:text-5xl"
        >
          🏕️ Formularauswahl abgeschlossen
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative z-10 mt-2 text-lg opacity-90"
        >
          Geben Sie einen Namen für Ihr Formular ein und laden Sie es herunter.
        </motion.p>
      </header>

      <main className="relative z-10 mx-auto -mt-6 max-w-2xl px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-lg"
        >
          <label
            htmlFor="camp-name"
            className="mb-1.5 block text-sm font-semibold text-muted-foreground"
          >
            Name des Formulars
          </label>
          <input
            id="camp-name"
            type="text"
            placeholder="z.B. Zeltlager Sommer 2024"
            value={campName}
            onChange={(e) => setCampName(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </motion.div>

        {/* Summary of selected fields */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-lg"
        >
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Ausgewählte Felder
          </h2>
          <div className="space-y-4">
            {Object.entries(exportState.neededFieldsByStep || {}).map(
              ([stepId, items]) => {
                if (items.length === 0) return null;
                const section = FORM_SECTIONS.find(
                  (s) => s.id === parseInt(stepId),
                );
                if (!section) return null;

                return (
                  <div
                    key={stepId}
                    className="border-l-4 border-secondary pl-4"
                  >
                    <h3 className="font-semibold text-foreground">
                      {section.title}
                    </h3>
                    <ul className="mt-1 text-sm text-muted-foreground">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          <span>{item.emoji}</span>
                          <span>{item.label || item.id}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              },
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-4 text-lg font-bold text-secondary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-secondary/90 active:scale-95"
          >
            <Download className="h-5 w-5" />
            PDF herunterladen
          </button>
          <button
            onClick={() =>
              setExportState({
                neededFieldsByStep: null,
                isCompleteStepper: false,
              })
            }
            className="rounded-xl border border-border bg-card px-8 py-3 font-semibold text-foreground shadow-lg transition-all hover:bg-secondary/10"
          >
            Zu Anfang zurück
          </button>
        </motion.div>
      </main>

      <footer className="text-center text-sm text-muted-foreground mt-12 mb-6">
        {new Date().getFullYear()} Camp Trip Planner.
        <br />
        <a href="/privacy.html" className="underline hover:text-primary">
          Datenschutzerklärung
        </a>
        <a href="/imprint.html" className="underline hover:text-primary">
          Impressum
        </a>
      </footer>
    </div>
  );
}
