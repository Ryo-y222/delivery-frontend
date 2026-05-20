import { useDroppable } from "@dnd-kit/react";
import type { ReactNode } from "react";
import type { PreviewBar } from "../types/dispatch";

export default function DroppableRow({
  vehicleId,
  timelineWidth,
  height,
  children,
  preview,
}: {
  vehicleId: string;
  timelineWidth: number;
  labels: number[];
  height: number;
  children: ReactNode;
  preview: PreviewBar | null;
}) {
  const { ref } = useDroppable({ id: vehicleId, accept: "job" });
  const showPreview = preview && preview.vehicleId === vehicleId;

  return (
    <div
      ref={ref}
      className="dispatch-row-right dispatch-row-grid"
      style={{ width: timelineWidth, height }}
    >
      {children}
      {showPreview && (
        <div
          className="dispatch-drop-preview-bar"
          style={{ left: preview.left, width: preview.width }}
        >
          <div className="dispatch-drop-preview-label">{preview.text}</div>
        </div>
      )}
    </div>
  );
}
