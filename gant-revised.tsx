import "./DispatchGantt.css";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { jobs as initialJobs } from "../data/jobs";
import { vehicles } from "../data/vehicles";
import JobEditModal from "./JobEditModal";
import type { Job } from "../types/dispatch";

const DAY_START_HOUR = 8;
const DAY_END_HOUR = 18;
const LEFT_WIDTH = 120;
const PX_PER_MINUTE = 2;
const ROW_HEIGHT = 64;
const HEADER_HEIGHT = 40;
const MIN_JOB_MINUTES = 15;
const RESIZE_SNAP_MIN = 5;

type PreviewBar = {
  vehicleId: string;
  left: number;
  width: number;
  text: string;
};

type Tooltip = { text: string; x: number; y: number } | null;

function timeLabels() {
  const labels: number[] = [];
  for (let hour = DAY_START_HOUR; hour <= DAY_END_HOUR; hour++) {
    labels.push(hour);
  }
  return labels;
}

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

function normalizeMinutes(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return { hour, minute };
}

function getStartTotal(job: Job) {
  return toMinutes(job.startHour, job.startMinute);
}

function getEndTotal(job: Job) {
  return toMinutes(job.endHour, job.endMinute);
}

function isOverlapped(nextJob: Job, jobs: Job[]) {
  const nextStart = getStartTotal(nextJob);
  const nextEnd = getEndTotal(nextJob);

  return jobs.some((job) => {
    if (job.id === nextJob.id) return false;
    if (job.vehicleId !== nextJob.vehicleId) return false;

    const start = getStartTotal(job);
    const end = getEndTotal(job);

    return nextStart < end && nextEnd > start;
  });
}

function useNowMinute() {
  const [nowMin, setNowMin] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNowMin(d.getHours() * 60 + d.getMinutes());
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  return nowMin;
}

function JobBar({
  job,
  onOpen,
  setJobList,
  setTooltip,
}: {
  job: Job;
  onOpen: (jobId: string) => void;
  setJobList: React.Dispatch<React.SetStateAction<Job[]>>;
  setTooltip: (tip: Tooltip) => void;
}) {
  const { ref } = useDraggable({
    id: job.id,
    type: "job",
  });

  const handleResizeDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    edge: "left" | "right",
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const origJob = job;
    const origStart = getStartTotal(origJob);
    const origEnd = getEndTotal(origJob);
    const dayStartMin = DAY_START_HOUR * 60;
    const dayEndMin = DAY_END_HOUR * 60;

    const onMove = (ev: PointerEvent) => {
      const deltaPx = ev.clientX - startX;
      const deltaMin =
        Math.round(deltaPx / PX_PER_MINUTE / RESIZE_SNAP_MIN) * RESIZE_SNAP_MIN;

      let nextStart = origStart;
      let nextEnd = origEnd;

      if (edge === "left") {
        nextStart = Math.max(
          dayStartMin,
          Math.min(origEnd - MIN_JOB_MINUTES, origStart + deltaMin),
        );
      } else {
        nextEnd = Math.min(
          dayEndMin,
          Math.max(origStart + MIN_JOB_MINUTES, origEnd + deltaMin),
        );
      }

      const s = normalizeMinutes(nextStart);
      const en = normalizeMinutes(nextEnd);

      setJobList((prev) =>
        prev.map((j) =>
          j.id === origJob.id
            ? {
                ...j,
                startHour: s.hour,
                startMinute: s.minute,
                endHour: en.hour,
                endMinute: en.minute,
              }
            : j,
        ),
      );

      setTooltip({
        text:
          edge === "left"
            ? `開始 ${formatTime(s.hour, s.minute)}`
            : `終了 ${formatTime(en.hour, en.minute)}`,
        x: ev.clientX,
        y: ev.clientY,
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setTooltip(null);

      setJobList((prev) => {
        const moved = prev.find((j) => j.id === origJob.id);
        if (moved && isOverlapped(moved, prev)) {
          return prev.map((j) => (j.id === origJob.id ? origJob : j));
        }
        return prev;
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      className="dispatch-job"
      style={{
        left: calcLeft(job),
        width: calcWidth(job),
      }}
      title={`${formatTime(job.startHour, job.startMinute)} - ${formatTime(job.endHour, job.endMinute)}`}
    >
      <button
        type="button"
        className="dispatch-job-resize dispatch-job-resize-left"
        onPointerDown={(e) => handleResizeDown(e, "left")}
        aria-label="開始時刻を変更"
      />

      <div
        ref={ref}
        className="dispatch-job-body"
        onDoubleClick={() => onOpen(job.id)}
      >
        <div className="dispatch-job-title">{job.title}</div>
        <div className="dispatch-job-time">
          {formatTime(job.startHour, job.startMinute)} -{" "}
          {formatTime(job.endHour, job.endMinute)}
        </div>
      </div>

      <button
        type="button"
        className="dispatch-job-resize dispatch-job-resize-right"
        onPointerDown={(e) => handleResizeDown(e, "right")}
        aria-label="終了時刻を変更"
      />
    </div>
  );
}

function DroppableRow({
  vehicleId,
  timelineWidth,
  height,
  children,
  preview,
}: {
  vehicleId: string;
  timelineWidth: number;
  height: number;
  children: ReactNode;
  preview: PreviewBar | null;
}) {
  const { ref } = useDroppable({
    id: vehicleId,
    accept: "job",
  });

  const showPreview = preview && preview.vehicleId === vehicleId;

  return (
    <div
      ref={ref}
      className="dispatch-row-right"
      style={{ width: timelineWidth, height }}
    >
      {children}

      {showPreview && (
        <div
          className="dispatch-drop-preview-bar"
          style={{
            left: preview.left,
            width: preview.width,
          }}
        >
          <div className="dispatch-drop-preview-label">{preview.text}</div>
        </div>
      )}
    </div>
  );
}

export default function DispatchGantt() {
  const [jobList, setJobList] = useState(initialJobs);
  const [snapMinutes, setSnapMinutes] = useState(30);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewBar | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip>(null);

  const editingJob = jobList.find((job) => job.id === editingJobId) ?? null;

  const dragStartXRef = useRef(0);
  const dragCurrentXRef = useRef(0);

  const labels = timeLabels();
  const timelineWidth = (DAY_END_HOUR - DAY_START_HOUR) * 60 * PX_PER_MINUTE;

  const nowMin = useNowMinute();
  const dayStartMin = DAY_START_HOUR * 60;
  const dayEndMin = DAY_END_HOUR * 60;
  const showNow = nowMin >= dayStartMin && nowMin <= dayEndMin;
  const nowLeft = (nowMin - dayStartMin) * PX_PER_MINUTE;

  return (
    <DragDropProvider
      onDragStart={(event) => {
        dragStartXRef.current = event.operation.position.current.x;
        dragCurrentXRef.current = event.operation.position.current.x;
      }}
      onDragMove={(event) => {
        dragCurrentXRef.current = event.operation.position.current.x;

        const { source, target } = event.operation;
        if (!target) {
          setPreview(null);
          setTooltip(null);
          return;
        }

        const sourceId = String(source.id);
        const targetVehicleId = String(target.id);

        const movingJob = jobList.find((job) => job.id === sourceId);
        if (!movingJob) {
          setPreview(null);
          setTooltip(null);
          return;
        }

        const movedPx = dragCurrentXRef.current - dragStartXRef.current;
        const rawMovedMinutes = movedPx / PX_PER_MINUTE;
        const movedMinutes =
          Math.round(rawMovedMinutes / snapMinutes) * snapMinutes;

        const startTotal = getStartTotal(movingJob) + movedMinutes;
        const endTotal = getEndTotal(movingJob) + movedMinutes;

        const nextStart = normalizeMinutes(startTotal);
        const nextEnd = normalizeMinutes(endTotal);

        const previewJob: Job = {
          ...movingJob,
          vehicleId: targetVehicleId,
          startHour: nextStart.hour,
          startMinute: nextStart.minute,
          endHour: nextEnd.hour,
          endMinute: nextEnd.minute,
        };

        const text = `${formatTime(previewJob.startHour, previewJob.startMinute)} - ${formatTime(previewJob.endHour, previewJob.endMinute)}`;

        setPreview({
          vehicleId: targetVehicleId,
          left: calcLeft(previewJob),
          width: calcWidth(previewJob),
          text,
        });

        setTooltip({
          text,
          x: event.operation.position.current.x,
          y: event.operation.position.current.y,
        });
      }}
      onDragEnd={(event) => {
        const { operation, canceled } = event;
        const { source, target } = operation;

        setTooltip(null);

        if (canceled || !target) {
          setPreview(null);
          dragStartXRef.current = 0;
          dragCurrentXRef.current = 0;
          return;
        }

        const movedPx = dragCurrentXRef.current - dragStartXRef.current;
        const rawMovedMinutes = movedPx / PX_PER_MINUTE;
        const movedMinutes =
          Math.round(rawMovedMinutes / snapMinutes) * snapMinutes;

        setJobList((prevJobs) => {
          const nextJobs = prevJobs.map((job) => {
            if (job.id !== String(source.id)) return job;

            const startTotal = getStartTotal(job) + movedMinutes;
            const endTotal = getEndTotal(job) + movedMinutes;

            const nextStart = normalizeMinutes(startTotal);
            const nextEnd = normalizeMinutes(endTotal);

            return {
              ...job,
              startHour: nextStart.hour,
              startMinute: nextStart.minute,
              endHour: nextEnd.hour,
              endMinute: nextEnd.minute,
              vehicleId: String(target.id),
            };
          });

          const movedJob = nextJobs.find((job) => job.id === String(source.id));

          if (!movedJob || isOverlapped(movedJob, nextJobs)) {
            return prevJobs;
          }

          return nextJobs;
        });

        setPreview(null);
        dragStartXRef.current = 0;
        dragCurrentXRef.current = 0;
      }}
    >
      <div className="dispatch-page">
        <h1 className="dispatch-title">配車ガント</h1>

        <div className="dispatch-toolbar">
          <label>
            移動単位：
            <select
              value={snapMinutes}
              onChange={(e) => setSnapMinutes(Number(e.target.value))}
            >
              <option value={1}>1分</option>
              <option value={5}>5分</option>
              <option value={10}>10分</option>
              <option value={15}>15分</option>
              <option value={30}>30分</option>
              <option value={60}>60分</option>
            </select>
          </label>
          <span className="dispatch-hint">
            端ドラッグで開始/終了時刻を変更、中央ドラッグで移動、ダブルクリックで編集
          </span>
        </div>

        <div className="dispatch-board">
          <div
            className="dispatch-board-inner"
            style={{ minWidth: LEFT_WIDTH + timelineWidth }}
          >
            <div className="dispatch-header" style={{ height: HEADER_HEIGHT }}>
              <div
                className="dispatch-header-left"
                style={{ width: LEFT_WIDTH }}
              >
                車両
              </div>

              <div
                className="dispatch-header-right"
                style={{ width: timelineWidth }}
              >
                {labels.map((hour) => {
                  const left = (hour - DAY_START_HOUR) * 60 * PX_PER_MINUTE;
                  return (
                    <div
                      key={hour}
                      className="dispatch-hour-label"
                      style={{ left }}
                    >
                      {String(hour).padStart(2, "0")}:00
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="dispatch-timeline-overlay"
              style={{
                left: LEFT_WIDTH,
                top: HEADER_HEIGHT,
                width: timelineWidth,
              }}
            >
              {showNow && (
                <div className="dispatch-now-line" style={{ left: nowLeft }}>
                  <div className="dispatch-now-label">現在</div>
                </div>
              )}
            </div>

            {vehicles.map((vehicle) => {
              const rowJobs = jobList.filter(
                (job) => job.vehicleId === vehicle.id,
              );

              return (
                <div key={vehicle.id} className="dispatch-row">
                  <div
                    className="dispatch-row-left"
                    style={{ width: LEFT_WIDTH, height: ROW_HEIGHT }}
                  >
                    {vehicle.name}
                  </div>

                  <DroppableRow
                    vehicleId={vehicle.id}
                    timelineWidth={timelineWidth}
                    height={ROW_HEIGHT}
                    preview={preview}
                  >
                    {rowJobs.map((job) => (
                      <JobBar
                        key={job.id}
                        job={job}
                        onOpen={setEditingJobId}
                        setJobList={setJobList}
                        setTooltip={setTooltip}
                      />
                    ))}
                  </DroppableRow>
                </div>
              );
            })}
          </div>
        </div>

        {tooltip && (
          <div
            className="dispatch-tooltip"
            style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
          >
            {tooltip.text}
          </div>
        )}

        {editingJob && (
          <JobEditModal
            job={editingJob}
            onClose={() => setEditingJobId(null)}
            onChangeTitle={(nextTitle) => {
              setJobList((prev) =>
                prev.map((job) =>
                  job.id === editingJob.id ? { ...job, title: nextTitle } : job,
                ),
              );
            }}
            onChangeStartHour={(value) => {
              setJobList((prev) =>
                prev.map((job) =>
                  job.id === editingJob.id ? { ...job, startHour: value } : job,
                ),
              );
            }}
            onChangeStartMinute={(value) => {
              setJobList((prev) =>
                prev.map((job) =>
                  job.id === editingJob.id
                    ? { ...job, startMinute: value }
                    : job,
                ),
              );
            }}
            onChangeEndHour={(value) => {
              setJobList((prev) =>
                prev.map((job) =>
                  job.id === editingJob.id ? { ...job, endHour: value } : job,
                ),
              );
            }}
            onChangeEndMinute={(value) => {
              setJobList((prev) =>
                prev.map((job) =>
                  job.id === editingJob.id
                    ? { ...job, endMinute: value }
                    : job,
                ),
              );
            }}
          />
        )}
      </div>
    </DragDropProvider>
  );
}
