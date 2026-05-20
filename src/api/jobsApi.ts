import { mockDb } from "../mocks/data/job";
import type { Job, Vehicle } from "../features/dispatch/types/dispatch";

export const jobsApi = {
  getJobsByDate(date: string): Job[] {
    return mockDb.jobs.filter((job) => job.planDate === date);
  },

  createJob(job: Job): Job {
    mockDb.jobs.push(job);
    return job;
  },

  updateJob(updatedJob: Job): Job {
    const index = mockDb.jobs.findIndex((j) => j.id === updatedJob.id);
    if (index !== -1) mockDb.jobs[index] = updatedJob;
    return updatedJob;
  },

  deleteJob(jobId: string): void {
    mockDb.jobs = mockDb.jobs.filter((j) => j.id !== jobId);
  },

  getVehicles(): Vehicle[] {
    return mockDb.vehicles;
  },

  getLocations(): string[] {
    return mockDb.locations;
  },
};