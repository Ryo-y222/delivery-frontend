import { useState } from "react";
import "./JobEditModal.css";
import type { Job } from "../types/dispatch";

type Vehicle = { id: string; name: string };

export default function JobAddModal({
  vehicles,
  onClose,
  onAdd,
}: {
  vehicles: Vehicle[];
  onClose: () => void;
  onAdd: (job: Job) => void;
}) {
  const [title, setTitle] = useState("");
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");

  const handleAdd = () => {
    if (!title.trim()) return;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    onAdd({
      id: crypto.randomUUID(),
      vehicleId,
      title,
      startHour: sh,
      startMinute: sm,
      endHour: eh,
      endMinute: em,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">ジョブを追加</div>

        <div className="modal-field">
          <div className="modal-label">車両</div>
          <select
            className="modal-input"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-field">
          <div className="modal-label">タイトル</div>
          <input
            className="modal-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 現場Aへ搬入"
          />
        </div>

        <div className="modal-field">
          <div className="modal-label">開始時刻</div>
          <input
            className="modal-input"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="modal-field">
          <div className="modal-label">終了時刻</div>
          <input
            className="modal-input"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button
            className="modal-btn-close"
            style={{ marginRight: 8, background: "#94a3b8" }}
            onClick={onClose}
          >
            キャンセル
          </button>
          <button className="modal-btn-close" onClick={handleAdd}>
            追加
          </button>
        </div>
      </div>
    </div>
  );
}
