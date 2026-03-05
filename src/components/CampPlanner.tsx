import { useCallback, useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Download, Tent } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import EditableCampCard from "./camp-planner/EditableCampCard";
import type { CampItem, ZoneId } from "./camp-planner/types";
// <Link> isn’t needed for the privacy footer, a normal anchor keeps
// the router from intercepting the click.
import type { LinkProps } from "react-router-dom"; /* keep types if used elsewhere */

const SOURCE_ITEMS: CampItem[] = [
  { id: "shelter", label: "Shelter & Tents", emoji: "⛺" },
  { id: "food", label: "Food & Cooking", emoji: "🍳" },
  { id: "water", label: "Water Supply", emoji: "💧" },
  { id: "firstaid", label: "First Aid Kit", emoji: "🩹" },
  { id: "navigation", label: "Map & Navigation", emoji: "🗺️" },
  { id: "campfire", label: "Campfire", emoji: "🔥" },
  { id: "games", label: "Games & Activities", emoji: "🏸" },
  { id: "nature", label: "Nature Exploration", emoji: "🌿" },
  { id: "safety", label: "Safety Rules", emoji: "🛡️" },
  { id: "teamwork", label: "Teamwork & Roles", emoji: "🤝" },
  { id: "cleanup", label: "Clean-Up Plan", emoji: "🧹" },
  { id: "weather", label: "Weather Prep", emoji: "🌦️" },
  {
    id: "custom-1",
    label: "Custom Idea",
    emoji: "✨",
    isCustom: true,
    customName: "",
  },
  {
    id: "custom-2",
    label: "Special Item",
    emoji: "📝",
    isCustom: true,
    customName: "",
  },
];

const INITIAL_ZONES: Record<ZoneId, CampItem[]> = {
  source: SOURCE_ITEMS,
  unnecessary: [],
  needed: [],
};

const DECOR_TENTS = [
  { top: "12%", left: "8%", rotate: "-8deg" },
  { top: "58%", left: "20%", rotate: "6deg" },
  { top: "26%", left: "38%", rotate: "-14deg" },
  { top: "62%", left: "54%", rotate: "10deg" },
  { top: "16%", left: "72%", rotate: "-6deg" },
  { top: "52%", left: "86%", rotate: "14deg" },
];

const ZONE_COPY: Record<
  Exclude<ZoneId, "source">,
  { title: string; subtitle: string }
> = {
  unnecessary: {
    title: "Unnecessary",
    subtitle: "Nice extras or low-priority ideas.",
  },
  needed: {
    title: "Absolutely Needed",
    subtitle: "These items will be exported to the PDF.",
  },
};

export default function CampPlanner() {
  const [campName, setCampName] = useState("");
  const [zones, setZones] = useState<Record<ZoneId, CampItem[]>>(INITIAL_ZONES);
  const [mobileTab, setMobileTab] = useState<ZoneId>("source");
  const [isDragging, setIsDragging] = useState(false);

  const neededItems = useMemo(() => zones.needed, [zones.needed]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;
    setIsDragging(false);
    if (!destination) return;

    const sourceZone = source.droppableId as ZoneId;
    const destinationZone = destination.droppableId as ZoneId;
    const isMobileViewport =
      typeof window !== "undefined" && window.innerWidth < 768;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (isMobileViewport && sourceZone !== destinationZone) {
      return;
    }

    setZones((prev) => {
      const next = {
        source: [...prev.source],
        unnecessary: [...prev.unnecessary],
        needed: [...prev.needed],
      } satisfies Record<ZoneId, CampItem[]>;

      const [moved] = next[sourceZone].splice(source.index, 1);
      next[destinationZone].splice(destination.index, 0, moved);
      return next;
    });

    setMobileTab(destinationZone);
  }, []);

  const handleCustomNameChange = useCallback((id: string, value: string) => {
    setZones((prev) => {
      const updateZone = (items: CampItem[]) =>
        items.map((item) =>
          item.id === id ? { ...item, customName: value } : item,
        );

      return {
        source: updateZone(prev.source),
        unnecessary: updateZone(prev.unnecessary),
        needed: updateZone(prev.needed),
      };
    });
  }, []);

  const moveItemToZone = useCallback((itemId: string, targetZone: ZoneId) => {
    setZones((prev) => {
      const currentZone = (Object.keys(prev) as ZoneId[]).find((zone) =>
        prev[zone].some((item) => item.id === itemId),
      );

      if (!currentZone || currentZone === targetZone) return prev;

      const item = prev[currentZone].find((entry) => entry.id === itemId);
      if (!item) return prev;

      return {
        source:
          currentZone === "source"
            ? prev.source.filter((entry) => entry.id !== itemId)
            : targetZone === "source"
              ? [...prev.source, item]
              : prev.source,
        unnecessary:
          currentZone === "unnecessary"
            ? prev.unnecessary.filter((entry) => entry.id !== itemId)
            : targetZone === "unnecessary"
              ? [...prev.unnecessary, item]
              : prev.unnecessary,
        needed:
          currentZone === "needed"
            ? prev.needed.filter((entry) => entry.id !== itemId)
            : targetZone === "needed"
              ? [...prev.needed, item]
              : prev.needed,
      };
    });
  }, []);

  const getDisplayLabel = useCallback((item: CampItem) => {
    if (item.isCustom && item.customName?.trim()) {
      return item.customName.trim();
    }

    return item.label;
  }, []);

  const handleDownload = useCallback(() => {
    const name = campName.trim() || "My Camping Trip";
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(name, 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Absolutely Needed for this camp:", 20, 42);

    if (neededItems.length === 0) {
      doc.setFontSize(12);
      doc.text(
        "No items have been placed in the Absolutely Needed zone yet.",
        20,
        56,
      );
    } else {
      doc.setFontSize(13);
      neededItems.forEach((item, index) => {
        const y = 55 + index * 12;
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}.`, 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${getDisplayLabel(item)}`, 30, y);
      });
    }

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Created with Camp Trip Planner", 105, 285, { align: "center" });
    doc.save(`${name.replace(/\s+/g, "_")}.pdf`);
  }, [campName, getDisplayLabel, neededItems]);

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
          🏕️ Camp Trip Planner
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative z-10 mt-2 text-lg opacity-90"
        >
          Drag camp ideas into the two zones and decide what really matters.
        </motion.p>
      </header>

      <main className="relative z-10 mx-auto -mt-6 max-w-6xl px-4">
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
            Name your camp
          </label>
          <input
            id="camp-name"
            type="text"
            placeholder="e.g. Eagle Mountain Adventure"
            value={campName}
            onChange={(e) => setCampName(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </motion.div>

        <DragDropContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={onDragEnd}
        >
          <div className="mb-4 flex gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-lg md:hidden">
            {(
              [
                { id: "source", label: "Ideas" },
                { id: "unnecessary", label: "Unnecessary" },
                { id: "needed", label: "Absolutely Needed" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMobileTab(tab.id)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  mobileTab === tab.id
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {tab.label} ({zones[tab.id].length})
              </button>
            ))}
          </div>

          <div className="mb-4 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground shadow-lg md:hidden">
            {isDragging
              ? "Reorder mode active — drag to change the order inside the current zone, or use the card buttons to move between zones."
              : "Tip: use the buttons on each card to move items between zones, or drag to reorder within a zone."}
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_1fr]">
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`rounded-2xl border border-border bg-card p-4 shadow-lg ${
                mobileTab === "source" ? "block" : "hidden"
              } md:block md:col-span-2 xl:col-span-1`}
            >
              <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  Camp Ideas Pool
                </h2>
                <p className="text-sm text-muted-foreground">
                  Start here, then drag each item into a decision zone.
                </p>
              </div>

              <Droppable droppableId="source">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[16rem] rounded-2xl border border-dashed p-3 transition-colors ${
                      snapshot.isDraggingOver
                        ? "border-primary bg-secondary/50"
                        : "border-border bg-background/70"
                    }`}
                  >
                    <div className="flex flex-wrap gap-3">
                      {zones.source.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(prov, snapshot) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              className="w-full sm:w-auto sm:max-w-full"
                            >
                              <EditableCampCard
                                item={item}
                                compact
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
                  </div>
                )}
              </Droppable>
            </motion.section>

            {(["unnecessary", "needed"] as const).map((zoneId, zoneIndex) => (
              <motion.section
                key={zoneId}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + zoneIndex * 0.1 }}
                className={`rounded-2xl border border-border bg-card p-4 shadow-lg ${
                  mobileTab === zoneId ? "block" : "hidden"
                } md:block`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {ZONE_COPY[zoneId].title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {ZONE_COPY[zoneId].subtitle}
                    </p>
                  </div>
                  <div className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                    {zones[zoneId].length}
                  </div>
                </div>

                <Droppable droppableId={zoneId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[20rem] rounded-2xl border border-dashed p-3 transition-colors xl:min-h-[24rem] ${
                        snapshot.isDraggingOver
                          ? "border-primary bg-secondary/50"
                          : "border-border bg-background/70"
                      }`}
                    >
                      {zones[zoneId].length === 0 ? (
                        <div className="flex min-h-[16rem] items-center justify-center rounded-xl border border-border/70 bg-card/60 px-6 text-center text-sm font-medium text-muted-foreground xl:min-h-[20rem]">
                          Drop camp items here or use the move buttons on
                          mobile.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {zones[zoneId].map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(prov, snapshot) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                >
                                  <EditableCampCard
                                    item={item}
                                    indexLabel={index + 1}
                                    currentZone={zoneId}
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
            ))}
          </div>
        </DragDropContext>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-6 text-center"
        >
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-4 text-lg font-bold text-secondary-foreground shadow-lg transition-transform hover:scale-105 hover:bg-secondary/90 active:scale-95"
          >
            <Download className="h-5 w-5" />
            Download Needed Items PDF
          </button>
        </motion.div>
      </main>
      <footer className="text-center text-sm text-muted-foreground mt-12 mb-6">
        {new Date().getFullYear()} Camp Trip Planner.
        <br />
        <a href="/privacy.html" className="underline hover:text-primary">
          Privacy Policy
        </a>
      </footer>
    </div>
  );
}
