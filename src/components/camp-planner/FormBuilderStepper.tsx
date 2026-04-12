import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EditableCampCard from "./EditableCampCard";
import type { CampItem, ZoneId } from "./types";
import { FORM_SECTIONS, TOTAL_STEPS } from "./formSections";

interface FormBuilderStepperProps {
  onComplete: (neededFieldsByStep: Record<number, CampItem[]>) => void;
}

type StepZones = Record<ZoneId, CampItem[]>;
type MultiStepZones = Record<number, StepZones>;

const ZONE_COPY: Record<
  Exclude<ZoneId, "source">,
  { title: string; subtitle: string }
> = {
  unnecessary: {
    title: "Nicht erforderlich",
    subtitle: "Diese Felder werden nicht ins PDF exportiert.",
  },
  needed: {
    title: "Erforderlich",
    subtitle: "Diese Felder werden ins PDF exportiert.",
  },
};

export default function FormBuilderStepper({
  onComplete,
}: FormBuilderStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mobileTab, setMobileTab] = useState<ZoneId>("source");

  // Initialize zones for all steps
  const [zones, setZones] = useState<MultiStepZones>(() => {
    const initialZones: MultiStepZones = {};
    FORM_SECTIONS.forEach((section) => {
      initialZones[section.id] = {
        source: section.fields,
        unnecessary: [],
        needed: [],
      };
    });
    return initialZones;
  });

  const currentZones = useMemo(() => zones[currentStep], [zones, currentStep]);
  const currentSection = useMemo(
    () => FORM_SECTIONS.find((s) => s.id === currentStep),
    [currentStep],
  );

  const progressPercentage = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;
      setIsDragging(false);
      if (!destination) return;

      const sourceZone = source.droppableId as ZoneId;
      const destinationZone = destination.droppableId as ZoneId;
      const isMobileViewport =
        typeof window !== "undefined" && window.innerWidth < 768;

      // On mobile, prevent dragging across zones
      if (isMobileViewport && sourceZone !== destinationZone) {
        return;
      }

      // If dropped in same place, ignore
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      // Update only the current step's zones
      setZones((prev) => {
        const next = { ...prev };
        next[currentStep] = {
          source: [...prev[currentStep].source],
          unnecessary: [...prev[currentStep].unnecessary],
          needed: [...prev[currentStep].needed],
        };

        const [moved] = next[currentStep][sourceZone].splice(source.index, 1);
        next[currentStep][destinationZone].splice(destination.index, 0, moved);
        return next;
      });

      setMobileTab(destinationZone);
    },
    [currentStep],
  );

  const handleCustomNameChange = useCallback(
    (id: string, value: string) => {
      setZones((prev) => {
        const next = { ...prev };
        next[currentStep] = {
          ...prev[currentStep],
          source: prev[currentStep].source,
          unnecessary: prev[currentStep].unnecessary,
          needed: prev[currentStep].needed,
        };

        const updateZone = (items: CampItem[]) =>
          items.map((item) =>
            item.id === id ? { ...item, customName: value } : item,
          );

        return {
          ...next,
          [currentStep]: {
            source: updateZone(next[currentStep].source),
            unnecessary: updateZone(next[currentStep].unnecessary),
            needed: updateZone(next[currentStep].needed),
          },
        };
      });
    },
    [currentStep],
  );

  const moveItemToZone = useCallback(
    (itemId: string, targetZone: ZoneId) => {
      setZones((prev) => {
        const currentZones = prev[currentStep];
        const currentZoneKey = (Object.keys(currentZones) as ZoneId[]).find(
          (zone) => currentZones[zone].some((item) => item.id === itemId),
        );

        if (!currentZoneKey || currentZoneKey === targetZone) return prev;

        const item = currentZones[currentZoneKey].find(
          (entry) => entry.id === itemId,
        );
        if (!item) return prev;

        const next = { ...prev };
        next[currentStep] = {
          source:
            currentZoneKey === "source"
              ? currentZones.source.filter((entry) => entry.id !== itemId)
              : targetZone === "source"
                ? [...currentZones.source, item]
                : currentZones.source,
          unnecessary:
            currentZoneKey === "unnecessary"
              ? currentZones.unnecessary.filter((entry) => entry.id !== itemId)
              : targetZone === "unnecessary"
                ? [...currentZones.unnecessary, item]
                : currentZones.unnecessary,
          needed:
            currentZoneKey === "needed"
              ? currentZones.needed.filter((entry) => entry.id !== itemId)
              : targetZone === "needed"
                ? [...currentZones.needed, item]
                : currentZones.needed,
        };

        return next;
      });
    },
    [currentStep],
  );

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1);
      setMobileTab("source");
    } else {
      // On the last step, collect all needed items from all steps
      const allNeededByStep: Record<number, CampItem[]> = {};
      Object.entries(zones).forEach(([stepId, stepZones]) => {
        allNeededByStep[parseInt(stepId)] = stepZones.needed;
      });
      onComplete(allNeededByStep);
    }
  }, [currentStep, zones, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setMobileTab("source");
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm px-4 py-4 shadow-md">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary-foreground">
              Schritt {currentStep + 1} von {TOTAL_STEPS}
            </h2>
            <span className="text-sm font-semibold text-primary-foreground/80">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-primary-foreground/20">
            <div
              className="h-full rounded-full bg-secondary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-b from-primary/20 to-transparent px-4 py-8 text-center">
        <motion.h1
          key={currentStep}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className="text-3xl font-bold text-foreground md:text-4xl"
        >
          {currentSection?.title}
        </motion.h1>
        <motion.p
          key={`subtitle-${currentStep}`}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-2 text-muted-foreground"
        >
          {currentSection?.subtitle}
        </motion.p>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <DragDropContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={onDragEnd}
        >
          {/* Mobile Tab Bar */}
          <div className="mb-4 flex gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-lg md:hidden">
            {(["source", "unnecessary", "needed"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMobileTab(tab)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  mobileTab === tab
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {tab === "source"
                  ? "Verfügbar"
                  : tab === "unnecessary"
                    ? "Nicht erforderlich"
                    : "Erforderlich"}{" "}
                ({currentZones[tab].length})
              </button>
            ))}
          </div>

          {/* Mobile Tip */}
          <div className="mb-4 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground shadow-lg md:hidden">
            {isDragging
              ? "Ziehen Sie Elemente zwischen den Zonen oder verwenden Sie die Kartenschaltflächen."
              : "Tipp: Verwenden Sie die Kartenschaltflächen, um Felder zwischen Zonen zu verschieben."}
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Source Zone */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl border border-border bg-card p-4 shadow-lg ${
                mobileTab === "source" ? "block" : "hidden"
              } md:block`}
            >
              <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground">Verfügbar</h2>
                <p className="text-sm text-muted-foreground">
                  Wählen Sie die Felder aus, die Sie benötigen.
                </p>
              </div>

              <Droppable droppableId="source">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[20rem] rounded-2xl border border-dashed p-3 transition-colors ${
                      snapshot.isDraggingOver
                        ? "border-primary bg-secondary/50"
                        : "border-border bg-background/70"
                    }`}
                  >
                    <div className="space-y-3">
                      {currentZones.source.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(prov, snapshot) => (
                            <div ref={prov.innerRef} {...prov.draggableProps}>
                              <EditableCampCard
                                item={item}
                                currentZone="source"
                                isDragging={snapshot.isDragging}
                                dragHandleProps={
                                  prov.dragHandleProps ?? undefined
                                }
                                onCustomNameChange={handleCustomNameChange}
                                onMove={moveItemToZone}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                    {currentZones.source.length === 0 && (
                      <div className="flex items-center justify-center rounded-xl border border-border/70 bg-card/60 px-6 py-8 text-center text-sm text-muted-foreground">
                        Alle Felder wurden sortiert.
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </motion.section>

            {/* Unnecessary Zone */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className={`rounded-2xl border border-border bg-card p-4 shadow-lg ${
                mobileTab === "unnecessary" ? "block" : "hidden"
              } md:block`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {ZONE_COPY.unnecessary.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {ZONE_COPY.unnecessary.subtitle}
                  </p>
                </div>
                <div className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                  {currentZones.unnecessary.length}
                </div>
              </div>

              <Droppable droppableId="unnecessary">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[20rem] rounded-2xl border border-dashed p-3 transition-colors ${
                      snapshot.isDraggingOver
                        ? "border-primary bg-secondary/50"
                        : "border-border bg-background/70"
                    }`}
                  >
                    {currentZones.unnecessary.length === 0 ? (
                      <div className="flex items-center justify-center rounded-xl border border-border/70 bg-card/60 px-6 py-8 text-center text-sm text-muted-foreground">
                        Keine Felder in dieser Kategorie.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {currentZones.unnecessary.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(prov, snapshot) => (
                              <div ref={prov.innerRef} {...prov.draggableProps}>
                                <EditableCampCard
                                  item={item}
                                  indexLabel={index + 1}
                                  currentZone="unnecessary"
                                  isDragging={snapshot.isDragging}
                                  dragHandleProps={
                                    prov.dragHandleProps ?? undefined
                                  }
                                  onCustomNameChange={handleCustomNameChange}
                                  onMove={moveItemToZone}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </motion.section>

            {/* Needed Zone */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`rounded-2xl border border-border bg-card p-4 shadow-lg ${
                mobileTab === "needed" ? "block" : "hidden"
              } md:block`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {ZONE_COPY.needed.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {ZONE_COPY.needed.subtitle}
                  </p>
                </div>
                <div className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                  {currentZones.needed.length}
                </div>
              </div>

              <Droppable droppableId="needed">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[20rem] rounded-2xl border border-dashed p-3 transition-colors ${
                      snapshot.isDraggingOver
                        ? "border-primary bg-secondary/50"
                        : "border-border bg-background/70"
                    }`}
                  >
                    {currentZones.needed.length === 0 ? (
                      <div className="flex items-center justify-center rounded-xl border border-border/70 bg-card/60 px-6 py-8 text-center text-sm text-muted-foreground">
                        Ziehen Sie hier die erforderlichen Felder hin.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {currentZones.needed.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(prov, snapshot) => (
                              <div ref={prov.innerRef} {...prov.draggableProps}>
                                <EditableCampCard
                                  item={item}
                                  indexLabel={index + 1}
                                  currentZone="needed"
                                  isDragging={snapshot.isDragging}
                                  dragHandleProps={
                                    prov.dragHandleProps ?? undefined
                                  }
                                  onCustomNameChange={handleCustomNameChange}
                                  onMove={moveItemToZone}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </motion.section>
          </div>
        </DragDropContext>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-8 flex justify-between gap-4"
        >
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold text-foreground shadow-lg transition-all hover:bg-secondary hover:text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
            Zurück
          </button>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-3 font-semibold text-secondary-foreground shadow-lg transition-all hover:bg-secondary/90 hover:scale-105 active:scale-95"
          >
            {currentStep === TOTAL_STEPS - 1 ? "Abschließen" : "Weiter"}
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>
      </main>
    </div>
  );
}
