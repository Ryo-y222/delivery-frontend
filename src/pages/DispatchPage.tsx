import { useState } from "react";
import type { Job } from "../features/dispatch/types/dispatch";
import { FilterBar } from "../features/dispatch/components/FilterBar";
import { DispatchCard } from "../features/dispatch/components/DispatchCard";
import { DispatchGantt } from "../features/dispatch/components/DispatchGantt";
import type { LegStatus } from "../features/dispatch/types/dispatch";
import styles from "./DispatchPage.module.css";
import { jobsApi } from "../api/jobsApi";
import OrderForm from "../features/dispatch/components/OrderForm";

const vehicles = jobsApi.getVehicles();

export function DispatchPage() {
  const [carNumber, setCarNumber] = useState("");
  const [status, setStatus] = useState<LegStatus | null>(null);
  const [date, setDate] = useState(() => {
    return localStorage.getItem("dispatchDate") ?? "";
  });
  const [isAdding, setIsAdding] = useState(false);
  const [jobList, setJobList] = useState<Job[]>(() => {
    const savedDate = localStorage.getItem("dispatchDate") ?? "";
    return savedDate ? jobsApi.getJobsByDate(savedDate) : [];
  });
  const [visibleVehicleIds, setVisibleVehicleIds] = useState<string[]>(
    vehicles.map((v) => v.id),
  );
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const onAddClose = () => setIsAdding(false);
  const onAdd = (newJob: Job) => {
    jobsApi.createJob(newJob);
    setJobList(jobsApi.getJobsByDate(newJob.planDate ?? ""));
  };

  const toggleVehicle = (vehicleId: string) => {
    if (visibleVehicleIds.includes(vehicleId)) {
      setVisibleVehicleIds(visibleVehicleIds.filter((id) => id !== vehicleId));
    } else {
      setVisibleVehicleIds([...visibleVehicleIds, vehicleId]);
    }
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setJobList(jobsApi.getJobsByDate(newDate));
    localStorage.setItem("dispatchDate", newDate);
  };

  return (
    <div className={styles.page}>
      <FilterBar
        vehicles={vehicles}
        onDateChange={handleDateChange}
        onCarNumberChange={setCarNumber}
        onStatusChange={setStatus}
        onAddClick={() => setIsAdding(true)}
        date={date}
      />

      <DispatchGantt
        isAdding={isAdding}
        onAdd={onAdd}
        onAddClose={onAddClose}
        jobList={jobList}
        onJobListChange={setJobList}
      />

      <div className={styles.chipArea}>
        <button
          className={styles.allBtn}
          onClick={() => setVisibleVehicleIds(vehicles.map((v) => v.id))}
        >
          全表示
        </button>
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            onClick={() => toggleVehicle(vehicle.id)}
            className={
              visibleVehicleIds.includes(vehicle.id)
                ? styles.chipActive
                : styles.chip
            }
          >
            {vehicle.name}
          </button>
        ))}
      </div>

      {vehicles
        .filter((vehicle) => visibleVehicleIds.includes(vehicle.id))
        .filter((vehicle) => carNumber === "" || vehicle.id === carNumber)
        .map((vehicle) => {
          const vehicleJobs = jobList
            .filter((job) => job.vehicleId === vehicle.id)
            .filter((job) =>
              status === null ||
              job.tripLegs?.some((leg) => leg.status === status)
            );
          if (vehicleJobs.length === 0) return null;
          return vehicleJobs.map((job) => (
            <DispatchCard
              key={job.id}
              job={job}
              vehicleName={vehicle.name}
              driverName={vehicle.driverName}
              onEdit={setEditingJob}
            />
          ));
        })}

      {editingJob && (
        <OrderForm
          mode="edit"
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onDelete={() => {
            jobsApi.deleteJob(editingJob.id);
            setJobList(jobsApi.getJobsByDate(date));
            setEditingJob(null);
          }}
          onUpdate={(updatedJob) => {
            jobsApi.updateJob(updatedJob);
            setJobList(jobsApi.getJobsByDate(updatedJob.planDate ?? ""));
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
}