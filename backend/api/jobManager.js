import { v4 as uuid } from 'uuid';
import Job from './job.js';

class JobManager {
    constructor() {
        this.queue = [];
        this.map = new Map();
        this.running = false;
        this.currentJob = null;
        
        setInterval(() => this.processQueue(), 2000);
        
        console.log('📋 Job Manager initialized');
    }

    addJob(jobName, jobCode) {
        const jobId = uuid();
        
        try {
            const job = new Job(jobId, jobName, jobCode);
            
            if (job.status !== 'failed') {
                this.queue.push(jobId);
                this.map.set(jobId, job);
                console.log(`📥 Job ${jobId} added to queue (${this.queue.length} jobs in queue)`);
                return jobId;
            } else {
                console.error(`Failed to create job ${jobId}`);
                return null;
            }
        } catch (error) {
            console.error(`Error creating job: ${error}`);
            return null;
        }
    }

    processQueue() {
        if (this.queue.length === 0 || this.running) {
            return;
        }

        const jobId = this.queue[0];
        const job = this.map.get(jobId);

        if (!job) {
            console.error(`Job ${jobId} not found in map, removing from queue`);
            this.queue.shift();
            return;
        }

        if (job.status !== 'waiting') {
            console.log(`Job ${jobId} is not waiting (status: ${job.status}), removing from queue`);
            this.queue.shift();
            this.running = false;
            return;
        }

        console.log(`🚀 Starting job ${jobId} (${this.queue.length - 1} jobs remaining)`);
        this.running = true;
        this.currentJob = jobId;
        
        job.executeJob();

        const checkInterval = setInterval(() => {
            if (job.status === 'completed' || job.status === 'failed') {
                console.log(`Job ${jobId} finished with status: ${job.status}`);
                clearInterval(checkInterval);
                this.queue.shift();
                this.running = false;
                this.currentJob = null;

                if (this.queue.length > 0) {
                    console.log(`📋 ${this.queue.length} jobs remaining in queue`);
                }
            }
        }, 1000);
    }

    polling(jobId) {
        const job = this.map.get(jobId);
        if (!job) {
            return null;
        }
        return job.getStatus();
    }

    getQueueStatus() {
        return {
            queueLength: this.queue.length,
            running: this.running,
            currentJob: this.currentJob
        };
    }
}

export default JobManager;