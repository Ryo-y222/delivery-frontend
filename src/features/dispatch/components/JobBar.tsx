import { useDraggable } from "@dnd-kit/react";
import type { Job } from "../types/dispatch";

const DAY_START_HOUR = 8;
const PX_PER_MINUTE = 2;

function toMinutes(hour: number, minute: number) {
  return hour * 60 + minute;
}

function formatTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function calcLeft(job: Job) {
  const jobStart = toMinutes(job.startHour, job.startMinute);
  const dayStart = toMinutes(DAY_START_HOUR, 0);
  return (jobStart - dayStart) * PX_PER_MINUTE;
}

function calcWidth(job: Job) {
  const start = toMinutes(job.startHour, job.startMinute);
  const end = toMinutes(job.endHour, job.endMinute);
  return (end - start) * PX_PER_MINUTE;
}

function getStartTotal(job: Job) {
  return toMinutes(job.startHour, job.startMinute);
}

function getEndTotal(job: Job) {
  return toMinutes(job.endHour, job.endMinute);
}

export default function JobBar({
  job,
  onOpen,
  onResize,
}: {
  job: Job;
  onOpen: (jobId: string) => void;
  onResize: (jobId: string, newStart: number, newEnd: number) => void;
}) {
  const { ref } = useDraggable({ id: job.id, type: "job" });

  const handleResizeLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const origStart = getStartTotal(job);
    const origEnd = getEndTotal(job);

    const onMove = (e: MouseEvent) => {
      const movedPx = e.clientX - startX;
      const movedMin = Math.round(movedPx / PX_PER_MINUTE / 5) * 5;
      const newStart = Math.min(origStart + movedMin, origEnd - 15);
      onResize(job.id, newStart, origEnd);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleResizeRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const origStart = getStartTotal(job);
    const origEnd = getEndTotal(job);

    const onMove = (e: MouseEvent) => {
      const movedPx = e.clientX - startX;
      const movedMin = Math.round(movedPx / PX_PER_MINUTE / 5) * 5;
      const newEnd = Math.max(origEnd + movedMin, origStart + 15);
      onResize(job.id, origStart, newEnd);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      ref={ref}
      className="dispatch-job"
      style={{ left: calcLeft(job), width: calcWidth(job) }}
      title={`${formatTime(job.startHour, job.startMinute)} - ${formatTime(job.endHour, job.endMinute)}`}
      onDoubleClick={() => onOpen(job.id)}
    >
      <button
        className="dispatch-job-handle left"
        onMouseDown={handleResizeLeft}
      />
      <div className="dispatch-job-body">
        <div className="dispatch-job-title">{job.title}</div>
        <div className="dispatch-job-time">
          {formatTime(job.startHour, job.startMinute)} -{" "}
          {formatTime(job.endHour, job.endMinute)}
        </div>
      </div>
      <button
        className="dispatch-job-handle right"
        onMouseDown={handleResizeRight}
      />
    </div>
  );
}
