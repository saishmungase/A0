import {v4 as uuid} from 'uuid'
import Job from './job';

class JobManager{

    constructor(){
        this.queue = [];
        this.map = new Map();
        this.running = false;
        setInterval(() => this.executeJob(), 2000);
    }

    addJob(jobName, jobCode){
        const jobId = uuid();

        const job = new Job(jobId, jobName, jobCode);

        this.queue.push(jobId);
        this.map.set(jobId, job);

        return jobId;
    }

    executeJob(){

        if(this.queue.length == 0 || this.running) return;

        const jobId = this.queue[0];
        const job = this.map.get(jobId);

        if (!job || job.status !== 'waiting') {
          this.queue.shift(); 
          return;
        }
        this.running = true;
        job.executeJob();

        const checkInterval = setInterval(() => {
          if (job.status === 'completed' || job.status === 'failed') {
            clearInterval(checkInterval);
            this.queue.shift(); 
            this.running = false;
          }
        }, 1000);
    }

    polling(jobId) {
        const job = this.map.get(jobId);
        if(!job){
            return;
        }
        return job.getStatus();
    }
}

export default JobManager