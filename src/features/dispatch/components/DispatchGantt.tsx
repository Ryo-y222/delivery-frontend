import "./DispatchGantt.css";
import { useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { vehicles } from "../data/vehicles";
import OrderForm from "./OrderForm";
import JobBar from "./JobBar";
import DroppableRow from "./DroppableRow";
import type { Job, PreviewBar } from "../types/dispatch";

const DAY_START_HOUR = 8;
const DAY_END_HOUR = 24;
const LEFT_WIDTH = 120;
const PX_PER_MINUTE = 2;
const ROW_HEIGHT = 64;

function toMinutes(hour: number, minute: number) {
  return hour * 60 + minute;
}

function formatTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function calcLeft(job: Job) {
  return (
    (toMinutes(job.startHour, job.startMinute) - toMinutes(DAY_START_HOUR, 0)) *
    PX_PER_MINUTE
  );
}

function calcWidth(job: Job) {
  return (
    (toMinutes(job.endHour, job.endMinute) -
      toMinutes(job.startHour, job.startMinute)) *
    PX_PER_MINUTE
  );
}

function normalizeMinutes(totalMinutes: number) {
  return { hour: Math.floor(totalMinutes / 60), minute: totalMinutes % 60 };
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
    return nextStart < getEndTotal(job) && nextEnd > getStartTotal(job);
  });
}

function timeLabels() {
  const labels: number[] = [];
  for (let hour = DAY_START_HOUR; hour < DAY_END_HOUR; hour++) {
    labels.push(hour);
  }
  return labels;
}

type DispatchGanttProps = {
  isAdding: boolean;
  onAddClose: () => void;
  onAdd: (job: Job) => void;
  jobList: Job[];
  onJobListChange: (jobs: Job[]) => void;
};

export function DispatchGantt({
  isAdding,
  onAddClose,
  onAdd,
  jobList,
  onJobListChange,
}: DispatchGanttProps) {
  console.log("DispatchGanttで受け取ったjobList", jobList);
  console.table(
    jobList.map((job) => ({
      id: job.id,
      vehicleId: job.vehicleId,
      title: job.title,
      start: `${job.startHour}:${job.startMinute}`,
      end: `${job.endHour}:${job.endMinute}`,
    })),
  );

  const [snapMinutes, setSnapMinutes] = useState(30);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewBar | null>(null);

  const editingJob = jobList.find((job) => job.id === editingJobId) ?? null;
  const dragStartXRef = useRef(0);
  const dragCurrentXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const labels = timeLabels();
  const timelineWidth = (DAY_END_HOUR - DAY_START_HOUR) * 60 * PX_PER_MINUTE;

  const handleResize = (jobId: string, newStart: number, newEnd: number) => {
    const nextJobs = jobList.map((job) => {
      if (job.id !== jobId) return job;
      const start = normalizeMinutes(newStart);
      const end = normalizeMinutes(newEnd);
      return {
        ...job,
        startHour: start.hour,
        startMinute: start.minute,
        endHour: end.hour,
        endMinute: end.minute,
      };
    });
    const resized = nextJobs.find((j) => j.id === jobId);
    if (resized && !isOverlapped(resized, nextJobs)) {
      onJobListChange(nextJobs);
    }
  };

  const handleDelete = () => {
    const nextJobs = jobList.filter((job) => job.id !== editingJobId);
    onJobListChange(nextJobs);
    setEditingJobId(null);
  };

  return (
    <DragDropProvider
      onDragStart={(event) => {
        dragStartXRef.current = event.operation.position.current.x;
        dragCurrentXRef.current = event.operation.position.current.x;
        dragStartScrollRef.current = scrollRef.current?.scrollLeft ?? 0;
      }}
      onDragMove={(event) => {
        dragCurrentXRef.current = event.operation.position.current.x;
        const { source, target } = event.operation;
        if (!target || !source) {
          setPreview(null);
          return;
        }

        const movingJob = jobList.find((job) => job.id === String(source.id));
        if (!movingJob) {
          setPreview(null);
          return;
        }

        const scrollDiff =
          (scrollRef.current?.scrollLeft ?? 0) - dragStartScrollRef.current;
        const movedPx =
          dragCurrentXRef.current - dragStartXRef.current + scrollDiff;
        const movedMinutes =
          Math.round(movedPx / PX_PER_MINUTE / snapMinutes) * snapMinutes;

        const nextStart = normalizeMinutes(
          getStartTotal(movingJob) + movedMinutes,
        );
        const nextEnd = normalizeMinutes(getEndTotal(movingJob) + movedMinutes);

        const previewJob: Job = {
          ...movingJob,
          vehicleId: String(target.id),
          startHour: nextStart.hour,
          startMinute: nextStart.minute,
          endHour: nextEnd.hour,
          endMinute: nextEnd.minute,
        };

        setPreview({
          vehicleId: String(target.id),
          left: calcLeft(previewJob),
          width: calcWidth(previewJob),
          text: `${formatTime(previewJob.startHour, previewJob.startMinute)} - ${formatTime(previewJob.endHour, previewJob.endMinute)}`,
        });
      }}
      onDragEnd={(event) => {
        const { operation, canceled } = event;
        const { source, target } = operation;

        const reset = () => {
          setPreview(null);
          dragStartXRef.current = 0;
          dragCurrentXRef.current = 0;
          dragStartScrollRef.current = 0;
        };

        if (canceled || !target || !source) {
          reset();
          return;
        }

        const scrollDiff =
          (scrollRef.current?.scrollLeft ?? 0) - dragStartScrollRef.current;
        const movedPx =
          dragCurrentXRef.current - dragStartXRef.current + scrollDiff;
        const movedMinutes =
          Math.round(movedPx / PX_PER_MINUTE / snapMinutes) * snapMinutes;

        const nextJobs = jobList.map((job) => {
          if (job.id !== String(source.id)) return job;
          const nextStart = normalizeMinutes(getStartTotal(job) + movedMinutes);
          const nextEnd = normalizeMinutes(getEndTotal(job) + movedMinutes);
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
          reset();
          return;
        }
        reset();
        onJobListChange(nextJobs);
      }}
    >
      <div className="dispatch-page">
        {isAdding && (
          <OrderForm
            mode="add"
            onClose={() => onAddClose()}
            onAdd={(newJob) => {
              onAdd(newJob);
              onAddClose();
            }}
          />
        )}

        <div className="dispatch-toolbar">
          <label>
            移動単位：
            <select
              value={snapMinutes}
              onChange={(e) => setSnapMinutes(Number(e.target.value))}
              style={{ marginLeft: 8 }}
            >
              <option value={1}>1分</option>
              <option value={5}>5分</option>
              <option value={10}>10分</option>
              <option value={15}>15分</option>
              <option value={30}>30分</option>
              <option value={60}>60分</option>
            </select>
          </label>
        </div>

        <div className="dispatch-board">
          <div className="dispatch-left-fixed">
            <div className="dispatch-header-left" style={{ width: LEFT_WIDTH }}>
              車両
            </div>
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="dispatch-row-left"
                style={{ width: LEFT_WIDTH, height: ROW_HEIGHT }}
              >
                {vehicle.name}
              </div>
            ))}
          </div>

          <div className="dispatch-right-scroll" ref={scrollRef}>
            <div style={{ width: timelineWidth }}>
              <div
                className="dispatch-header-right"
                style={{ width: timelineWidth }}
              >
                {labels.map((hour) => {
                  const left = (hour - DAY_START_HOUR) * 60 * PX_PER_MINUTE;
                  return (
                    <div key={hour}>
                      <div
                        className="dispatch-hour-line strong"
                        style={{ left }}
                      />
                      <div
                        className="dispatch-hour-label"
                        style={{ left: left + 4 }}
                      >
                        {String(hour).padStart(2, "0")}:00
                      </div>
                    </div>
                  );
                })}
              </div>

              {vehicles.map((vehicle) => {
                const rowJobs = jobList.filter(
                  (job) => job.vehicleId === vehicle.id,
                );

                console.log("---- vehicle row check ----");
                console.log(
                  "vehicle.id",
                  vehicle.id,
                  typeof vehicle.id,
                  vehicle.name,
                );
                console.log(
                  "jobList vehicleIds",
                  jobList.map((job) => ({
                    title: job.title,
                    vehicleId: job.vehicleId,
                    type: typeof job.vehicleId,
                  })),
                );
                console.log("rowJobs", rowJobs);

                return (
                  <DroppableRow
                    key={vehicle.id}
                    vehicleId={vehicle.id}
                    timelineWidth={timelineWidth}
                    labels={labels}
                    height={ROW_HEIGHT}
                    preview={preview}
                  >
                    {rowJobs.map((job) => (
                      <JobBar
                        key={job.id}
                        job={job}
                        onOpen={setEditingJobId}
                        onResize={handleResize}
                      />
                    ))}
                  </DroppableRow>
                );
              })}
            </div>
          </div>
        </div>

        {editingJob && (
          <OrderForm
            mode="edit"
            job={editingJob}
            onClose={() => setEditingJobId(null)}
            onDelete={handleDelete}
            onUpdate={(updatedJob) =>
              onJobListChange(
                jobList.map((j) => (j.id === updatedJob.id ? updatedJob : j)),
              )
            }
          />
        )}
      </div>
    </DragDropProvider>
  );
}

// import "./DispatchGantt.css";
// import { useRef, useState } from "react";
// import { DragDropProvider } from "@dnd-kit/react";
// import { vehicles } from "../data/vehicles";
// import JobAddModal from "./JobAddModal";
// import JobEditModal from "./JobEditModal";
// import JobBar from "./JobBar";
// import DroppableRow from "./DroppableRow";
// import OrderForm from "./OrderForm";
// import type { Job, PreviewBar } from "../types/dispatch";

// const DAY_START_HOUR = 8;
// const DAY_END_HOUR = 24;
// const LEFT_WIDTH = 120;
// const PX_PER_MINUTE = 2;
// const ROW_HEIGHT = 64;

// function toMinutes(hour: number, minute: number) {
//   return hour * 60 + minute;
// }

// function formatTime(hour: number, minute: number) {
//   return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
// }

// function calcLeft(job: Job) {
//   return (
//     (toMinutes(job.startHour, job.startMinute) - toMinutes(DAY_START_HOUR, 0)) *
//     PX_PER_MINUTE
//   );
// }

// function calcWidth(job: Job) {
//   return (
//     (toMinutes(job.endHour, job.endMinute) -
//       toMinutes(job.startHour, job.startMinute)) *
//     PX_PER_MINUTE
//   );
// }

// function normalizeMinutes(totalMinutes: number) {
//   return { hour: Math.floor(totalMinutes / 60), minute: totalMinutes % 60 };
// }

// function getStartTotal(job: Job) {
//   return toMinutes(job.startHour, job.startMinute);
// }

// function getEndTotal(job: Job) {
//   return toMinutes(job.endHour, job.endMinute);
// }

// function isOverlapped(nextJob: Job, jobs: Job[]) {
//   const nextStart = getStartTotal(nextJob);
//   const nextEnd = getEndTotal(nextJob);
//   return jobs.some((job) => {
//     if (job.id === nextJob.id) return false;
//     if (job.vehicleId !== nextJob.vehicleId) return false;
//     return nextStart < getEndTotal(job) && nextEnd > getStartTotal(job);
//   });
// }

// function timeLabels() {
//   const labels: number[] = [];
//   for (let hour = DAY_START_HOUR; hour < DAY_END_HOUR; hour++) {
//     labels.push(hour);
//   }
//   return labels;
// }

// type DispatchGanttProps = {
//   isAdding: boolean;
//   onAddClose: () => void;
//   onAdd: (job: Job) => void;
//   jobList: Job[];
//   onJobListChange: (jobs: Job[]) => void;
// };

// export function DispatchGantt({
//   isAdding,
//   onAddClose,
//   onAdd,
//   jobList,
//   onJobListChange,
// }: DispatchGanttProps) {
//   // const [jobList, setJobList] = useState(initialJobs);
//   const [snapMinutes, setSnapMinutes] = useState(30);
//   const [editingJobId, setEditingJobId] = useState<string | null>(null);
//   const [preview, setPreview] = useState<PreviewBar | null>(null);

//   const editingJob = jobList.find((job) => job.id === editingJobId) ?? null;
//   const dragStartXRef = useRef(0);
//   const dragCurrentXRef = useRef(0);
//   const dragStartScrollRef = useRef(0);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   const labels = timeLabels();
//   const timelineWidth = (DAY_END_HOUR - DAY_START_HOUR) * 60 * PX_PER_MINUTE;

//   const handleResize = (jobId: string, newStart: number, newEnd: number) => {
//     // setJobList((prev) => {
//     //   const nextJobs = prev.map((job) => {
//     const nextJobs = jobList.map((job) => {
//       if (job.id !== jobId) return job;
//       const start = normalizeMinutes(newStart);
//       const end = normalizeMinutes(newEnd);
//       return {
//         ...job,
//         startHour: start.hour,
//         startMinute: start.minute,
//         endHour: end.hour,
//         endMinute: end.minute,
//       };
//     });
//     const resized = nextJobs.find((j) => j.id === jobId);
//     if (resized && !isOverlapped(resized, nextJobs)) {
//       //   return prev;
//       // return nextJobs;
//       onJobListChange(nextJobs);
//     }
//   };

//   const handleDelete = () => {
//     const nextJobs = jobList.filter((job) => job.id !== editingJobId);
//     onJobListChange(nextJobs);
//     setEditingJobId(null);
//   };

//   const handleChangeTitle = (nextTitle: string) => {
//     // タイトルが変わったジョブだけ新しいタイトルに変換して
//     // 新しいジョブリストを作る
//     const nextJobs = jobList.map((job) =>
//       job.id === editingJob?.id ? { ...job, title: nextTitle } : job,
//     );
//     // onJobListChangeに渡す
//     onJobListChange(nextJobs);
//   };

//   // const handleChangeStartHour = (nextStartHour: number) => {
//   //   const nextJobs = jobList.map((job) =>
//   //     job.id === editingJob?.id ? { ...job, startHour: nextStartHour } : job,
//   //   );
//   //   onJobListChange(nextJobs);
//   // };
//   // const handleChangeStartMinute = (nextStartMinute: number) => {
//   //   const nextJobs = jobList.map((job) =>
//   //     job.id === editingJob?.id
//   //       ? { ...job, startMinute: nextStartMinute }
//   //       : job,
//   //   );
//   //   onJobListChange(nextJobs);
//   // };
//   // const handleChangeEndHour = (nextEndHour: number) => {
//   //   const nextJobs = jobList.map((job) =>
//   //     job.id === editingJob?.id ? { ...job, endHour: nextEndHour } : job,
//   //   );
//   //   onJobListChange(nextJobs);
//   // };
//   // const handleChangeEndMinute = (nextEndMinute: number) => {
//   //   const nextJobs = jobList.map((job) =>
//   //     job.id === editingJob?.id ? { ...job, endMinute: nextEndMinute } : job,
//   //   );
//   //   onJobListChange(nextJobs);
//   // };

//   const handleChangeStartTime = (hour: number, minute: number) => {
//     // console.log("handleChangeStartTime", hour, minute);
//     // console.log("editingJob", editingJob);
//     const nextJobs = jobList.map((job) =>
//       job.id === editingJob?.id
//         ? { ...job, startHour: hour, startMinute: minute }
//         : job,
//     );
//     onJobListChange(nextJobs);
//   };

//   const handleChangeEndTime = (hour: number, minute: number) => {
//     const nextJobs = jobList.map((job) =>
//       job.id === editingJob?.id
//         ? { ...job, endHour: hour, endMinute: minute }
//         : job,
//     );
//     onJobListChange(nextJobs);
//   };

//   return (
//     <DragDropProvider
//       onDragStart={(event) => {
//         dragStartXRef.current = event.operation.position.current.x;
//         dragCurrentXRef.current = event.operation.position.current.x;
//         dragStartScrollRef.current = scrollRef.current?.scrollLeft ?? 0;
//       }}
//       onDragMove={(event) => {
//         dragCurrentXRef.current = event.operation.position.current.x;
//         const { source, target } = event.operation;
//         if (!target) {
//           setPreview(null);
//           return;
//         }

//         const movingJob = jobList.find((job) => job.id === String(source.id));
//         if (!movingJob) {
//           setPreview(null);
//           return;
//         }

//         const scrollDiff =
//           (scrollRef.current?.scrollLeft ?? 0) - dragStartScrollRef.current;
//         const movedPx =
//           dragCurrentXRef.current - dragStartXRef.current + scrollDiff;
//         const movedMinutes =
//           Math.round(movedPx / PX_PER_MINUTE / snapMinutes) * snapMinutes;

//         const nextStart = normalizeMinutes(
//           getStartTotal(movingJob) + movedMinutes,
//         );
//         const nextEnd = normalizeMinutes(getEndTotal(movingJob) + movedMinutes);

//         const previewJob: Job = {
//           ...movingJob,
//           vehicleId: String(target.id),
//           startHour: nextStart.hour,
//           startMinute: nextStart.minute,
//           endHour: nextEnd.hour,
//           endMinute: nextEnd.minute,
//         };

//         setPreview({
//           vehicleId: String(target.id),
//           left: calcLeft(previewJob),
//           width: calcWidth(previewJob),
//           text: `${formatTime(previewJob.startHour, previewJob.startMinute)} - ${formatTime(previewJob.endHour, previewJob.endMinute)}`,
//         });
//       }}
//       onDragEnd={(event) => {
//         const { operation, canceled } = event;
//         const { source, target } = operation;

//         const reset = () => {
//           setPreview(null);
//           dragStartXRef.current = 0;
//           dragCurrentXRef.current = 0;
//           dragStartScrollRef.current = 0;
//         };

//         if (canceled || !target || !source) {
//           reset();
//           return;
//         }

//         const scrollDiff =
//           (scrollRef.current?.scrollLeft ?? 0) - dragStartScrollRef.current;
//         const movedPx =
//           dragCurrentXRef.current - dragStartXRef.current + scrollDiff;
//         const movedMinutes =
//           Math.round(movedPx / PX_PER_MINUTE / snapMinutes) * snapMinutes;

//         // setJobList((prevJobs) => {
//         //   const nextJobs = prevJobs.map((job) => {
//         // ドラッグ移動後のジョブリストを計算
//         const nextJobs = jobList.map((job) => {
//           // })
//           // 移動したジョブ以外はそのまま
//           if (job.id !== String(source.id)) return job;
//           // 移動後の開始・終了時刻を計算
//           const nextStart = normalizeMinutes(getStartTotal(job) + movedMinutes);
//           const nextEnd = normalizeMinutes(getEndTotal(job) + movedMinutes);
//           return {
//             ...job,
//             startHour: nextStart.hour,
//             startMinute: nextStart.minute,
//             endHour: nextEnd.hour,
//             endMinute: nextEnd.minute,
//             vehicleId: String(target.id), // 移動先の車両IDに更新
//           };
//         });
//         // 移動後に重なりがあればキャンセル
//         const movedJob = nextJobs.find((job) => job.id === String(source.id));
//         if (!movedJob || isOverlapped(movedJob, nextJobs)) {
//           reset();
//           return;
//         }
//         // 問題なければジョブリストを更新
//         reset();
//         onJobListChange(nextJobs);
//       }}
//     >
//       <div className="dispatch-page">
//         {/* {isAdding && (
//           <JobAddModal
//             vehicles={vehicles}
//             onClose={() => onAddClose()}
//             onAdd={(newJob) => {
//               onAdd(newJob);
//               onAddClose();
//             }}
//           />
//         )} */}
//         {isAdding && (
//           <OrderForm
//             mode="add"
//             onClose={() => onAddClose()}
//             onAdd={(newJob) => {
//               onAdd(newJob);
//               onAddClose();
//             }}
//           />
//         )}

//         <div className="dispatch-toolbar">
//           <label>
//             移動単位：
//             <select
//               value={snapMinutes}
//               onChange={(e) => setSnapMinutes(Number(e.target.value))}
//               style={{ marginLeft: 8 }}
//             >
//               <option value={1}>1分</option>
//               <option value={5}>5分</option>
//               <option value={10}>10分</option>
//               <option value={15}>15分</option>
//               <option value={30}>30分</option>
//               <option value={60}>60分</option>
//             </select>
//           </label>
//           {/* <button
//             className="dispatch-btn-add"
//             onClick={() => setIsAdding(true)}
//           >
//             ＋ ジョブを追加
//           </button> */}
//         </div>

//         <div className="dispatch-board">
//           <div className="dispatch-left-fixed">
//             <div className="dispatch-header-left" style={{ width: LEFT_WIDTH }}>
//               車両
//             </div>
//             {vehicles.map((vehicle) => (
//               <div
//                 key={vehicle.id}
//                 className="dispatch-row-left"
//                 style={{ width: LEFT_WIDTH, height: ROW_HEIGHT }}
//               >
//                 {vehicle.name}
//               </div>
//             ))}
//           </div>

//           <div className="dispatch-right-scroll" ref={scrollRef}>
//             <div style={{ width: timelineWidth }}>
//               <div
//                 className="dispatch-header-right"
//                 style={{ width: timelineWidth }}
//               >
//                 {labels.map((hour) => {
//                   const left = (hour - DAY_START_HOUR) * 60 * PX_PER_MINUTE;
//                   return (
//                     <div key={hour}>
//                       <div
//                         className="dispatch-hour-line strong"
//                         style={{ left }}
//                       />
//                       <div
//                         className="dispatch-hour-label"
//                         style={{ left: left + 4 }}
//                       >
//                         {String(hour).padStart(2, "0")}:00
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {vehicles.map((vehicle) => {
//                 const rowJobs = jobList.filter(
//                   (job) => job.vehicleId === vehicle.id,
//                 );
//                 return (
//                   <DroppableRow
//                     key={vehicle.id}
//                     vehicleId={vehicle.id}
//                     timelineWidth={timelineWidth}
//                     labels={labels}
//                     height={ROW_HEIGHT}
//                     preview={preview}
//                   >
//                     {rowJobs.map((job) => (
//                       <JobBar
//                         key={job.id}
//                         job={job}
//                         onOpen={setEditingJobId}
//                         onResize={handleResize}
//                       />
//                     ))}
//                   </DroppableRow>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* {editingJob && (
//           <JobEditModal
//             job={editingJob}
//             onClose={() => setEditingJobId(null)}
//             onDelete={handleDelete}
//             onChangeTitle={handleChangeTitle}
//             // onChangeStartHour={handleChangeStartHour}
//             // onChangeStartMinute={handleChangeStartMinute}
//             // onChangeEndHour={handleChangeEndHour}
//             // onChangeEndMinute={handleChangeEndMinute}
//             onChangeStartTime={handleChangeStartTime}
//             onChangeEndTime={handleChangeEndTime}
//           />
//         )} */}
//         {editingJob && (
//           <OrderForm
//             mode="edit"
//             job={editingJob}
//             onClose={() => setEditingJobId(null)}
//             onDelete={handleDelete}
//             onUpdate={(updatedJob) =>
//               onJobListChange(
//                 jobList.map((j) => (j.id === updatedJob.id ? updatedJob : j)),
//               )
//             }
//           />
//         )}
//       </div>
//     </DragDropProvider>
//   );
// }
