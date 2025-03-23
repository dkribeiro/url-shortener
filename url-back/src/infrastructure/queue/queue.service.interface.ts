/**
 * Queue Service Interface
 * This interface defines the contract for queue operations that business logic will use.
 * It abstracts away the specific queue implementation details.
 */
export interface QueueServiceInterface {
  /**
   * Add a job to the queue
   * @param jobName The name of the job
   * @param data The data to be processed
   * @param options Optional job options
   */
  addJob(jobName: string, data: any, options?: any): Promise<any>;

  /**
   * Get a job by its ID
   * @param jobId The ID of the job
   */
  getJob(jobId: string): Promise<any>;

  /**
   * Get jobs by status
   * @param status The status of the jobs to retrieve
   */
  getJobs(status: string): Promise<any[]>;
}
