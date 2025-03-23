/**
 * Queue Provider Interface
 * This interface defines the contract that any queue implementation must follow.
 * It allows for swapping queue implementations (Bull, Kafka, etc.) without changing business logic.
 */
export interface QueueProvider {
  /**
   * Add a job to the queue
   * @param queueName The name of the queue
   * @param jobName The name of the job
   * @param data The data to be processed
   * @param options Optional job options
   */
  addJob(
    queueName: string,
    jobName: string,
    data: any,
    options?: any,
  ): Promise<any>;

  /**
   * Get a job by its ID
   * @param queueName The name of the queue
   * @param jobId The ID of the job
   */
  getJob(queueName: string, jobId: string): Promise<any>;

  /**
   * Get jobs by status
   * @param queueName The name of the queue
   * @param status The status of the jobs to retrieve
   */
  getJobs(queueName: string, status: string): Promise<any[]>;
}
