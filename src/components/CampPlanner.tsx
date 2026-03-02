import { useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Download, Tent } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

interface CampItem {
  id: string;
  label: string;
  emoji: string;
}

const DEFAULT_ITEMS: CampItem[] = [
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
];

export default function CampPlanner() {
  const [campName, setCampName] = useState("");
  const [items, setItems] = useState<CampItem[]>(DEFAULT_ITEMS);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(result.source.index, 1);
      next.splice(result.destination!.index, 0, moved);
      return next;
    });
  }, []);

  const handleDownload = () => {
    const name = campName.trim() || "My Camping Trip";
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(name, 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Priority Ranking (most important first):", 20, 42);

    doc.setFontSize(13);
    items.forEach((item, i) => {
      const y = 55 + i * 12;
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}.`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${item.emoji}  ${item.label}`, 30, y);
    });

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Created with Camp Trip Planner", 105, 285, { align: "center" });

    doc.save(`${name.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-8 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <Tent
              key={i}
              className="absolute"
              style={{
                top: `${10 + Math.random() * 60}%`,
                left: `${5 + i * 18}%`,
                transform: `rotate(${-10 + Math.random() * 20}deg)`,
                width: 40,
                height: 40,
              }}
            />
          ))}
        </div>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-bold relative z-10"
        >
          🏕️ Camp Trip Planner
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-2 text-lg opacity-90 relative z-10"
        >
          Drag &amp; drop to rank what matters most for your trip!
        </motion.p>
      </header>

      <main className="max-w-lg mx-auto px-4 -mt-6 relative z-10">
        {/* Camp name input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-xl shadow-lg p-5 mb-6 border border-border"
        >
          <label
            htmlFor="camp-name"
            className="block text-sm font-semibold text-muted-foreground mb-1.5"
          >
            Name your camp
          </label>
          <input
            id="camp-name"
            type="text"
            placeholder="e.g. Eagle Mountain Adventure"
            value={campName}
            onChange={(e) => setCampName(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </motion.div>

        {/* Drag list */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-card rounded-xl shadow-lg border border-border overflow-hidden"
        >
          <div className="px-5 pt-4 pb-2">
            <h2 className="text-lg font-bold">🎯 Priority Ranking</h2>
            <p className="text-sm text-muted-foreground">#1 = Most important</p>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="camp-items">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="px-3 pb-3"
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(prov, snapshot) => (
                        <li
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className={`flex items-center gap-3 rounded-lg px-3 py-3 my-1.5 border transition-colors select-none ${
                            snapshot.isDragging
                              ? "bg-secondary/20 border-secondary shadow-md"
                              : "bg-background border-border hover:border-primary/30"
                          }`}
                        >
                          <span className="text-muted-foreground/50 font-bold text-sm w-5 text-right shrink-0">
                            {index + 1}
                          </span>
                          <GripVertical className="h-5 w-5 text-muted-foreground/40 shrink-0" />
                          <span className="text-xl leading-none">
                            {item.emoji}
                          </span>
                          <span className="font-semibold text-foreground">
                            {item.label}
                          </span>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </motion.div>

        {/* Download button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 text-center"
        >
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Download className="h-5 w-5" />
            Download as PDF
          </button>
        </motion.div>
      </main>
    </div>
  );
}
