import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { GripVertical, PencilLine } from "lucide-react";
import type { CampItem } from "./types";

interface EditableCampCardProps {
  item: CampItem;
  indexLabel?: number;
  isDragging: boolean;
  compact?: boolean;
  currentZone?: "source" | "unnecessary" | "needed";
  dragHandleProps?: DraggableProvidedDragHandleProps;
  onCustomNameChange: (id: string, value: string) => void;
  onMove?: (
    itemId: string,
    targetZone: "source" | "unnecessary" | "needed",
  ) => void;
}

export default function EditableCampCard({
  item,
  indexLabel,
  isDragging,
  compact = false,
  currentZone,
  dragHandleProps,
  onCustomNameChange,
  onMove,
}: EditableCampCardProps) {
  const mobileActions = [
    { zone: "source" as const, label: "Ideas" },
    { zone: "unnecessary" as const, label: "Unnecessary" },
    { zone: "needed" as const, label: "Needed" },
  ].filter((action) => action.zone !== currentZone);

  return (
    <div
      className={`rounded-2xl border transition-all ${
        compact ? "px-3 py-2" : "px-3 py-3"
      } ${
        isDragging
          ? "border-primary bg-secondary shadow-lg"
          : "border-border bg-background hover:border-primary/40"
      }`}
    >
      <div className={`flex gap-3 ${compact ? "items-center" : "items-start"}`}>
        <div className="flex items-center gap-2 pt-0.5">
          {typeof indexLabel === "number" ? (
            <span className="w-5 text-right text-sm font-bold text-muted-foreground/70">
              {indexLabel}
            </span>
          ) : null}
          <button
            type="button"
            aria-label={`Drag ${item.label ?? "custom-item"}`}
            className="inline-flex touch-none cursor-grab rounded-md p-2 text-muted-foreground/60 transition-colors hover:bg-secondary hover:text-foreground active:cursor-grabbing"
            {...dragHandleProps}
          >
            <GripVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {!item.isCustom && (
              <>
                <span className="text-xl leading-none">{item.emoji}</span>
                <span className="font-semibold text-foreground">
                  {item.label}
                </span>
              </>
            )}
          </div>

          {item.isCustom ? (
            <label className="mt-3 block">
              <span className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <PencilLine className="h-3.5 w-3.5" />
                Custom name
              </span>
              <input
                type="text"
                value={item.customName ?? ""}
                onChange={(e) => onCustomNameChange(item.id, e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Name this camp idea"
                className="w-full rounded-xl border border-input bg-card px-3 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground/55 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          ) : null}

          {onMove ? (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
              {mobileActions.map((action) => (
                <button
                  key={action.zone}
                  type="button"
                  onClick={() => onMove(item.id, action.zone)}
                  className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:border-primary hover:bg-secondary/90"
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
