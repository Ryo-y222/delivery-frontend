import "./JobEditModal.css";
import type { Job } from "../types/dispatch";

type Props = {
  job: Job;
  onClose: () => void;
  onDelete: () => void;
  onChangeTitle: (title: string) => void;
  // onChangeStartHour: (value: number) => void;
  // onChangeStartMinute: (value: number) => void;
  // onChangeEndHour: (value: number) => void;
  // onChangeEndMinute: (value: number) => void;
  onChangeStartTime: (hour: number, minute: number) => void;
  onChangeEndTime: (hour: number, minute: number) => void;
};

export default function JobEditModal({
  job,
  onClose,
  onDelete,
  onChangeTitle,
  // onChangeStartHour,
  // onChangeStartMinute,
  // onChangeEndHour,
  // onChangeEndMinute,
  onChangeStartTime,
  onChangeEndTime,
}: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">案件編集</div>

        <div className="modal-field">
          <div className="modal-label">タイトル</div>
          <input
            className="modal-input"
            value={job.title}
            onChange={(e) => onChangeTitle(e.target.value)}
          />
        </div>

        <div className="modal-field">
          <div className="modal-label">開始時刻</div>
          <input
            className="modal-input"
            type="time"
            value={`${String(job.startHour).padStart(2, "0")}:${String(job.startMinute).padStart(2, "0")}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":").map(Number);
              onChangeStartTime(h, m);
            }}
          />
        </div>

        <div className="modal-field">
          <div className="modal-label">終了時刻</div>
          <input
            className="modal-input"
            type="time"
            value={`${String(job.endHour).padStart(2, "0")}:${String(job.endMinute).padStart(2, "0")}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":").map(Number);
              onChangeEndTime(h, m);
            }}
          />
        </div>

        <div
          className="modal-footer"
          style={{ justifyContent: "space-between" }}
        >
          <button className="modal-btn-delete" type="button" onClick={onDelete}>
            削除
          </button>
          <button className="modal-btn-close" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
