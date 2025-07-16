import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';


class Job{
    jobId = ''
    jobName = ''
    jobCode =''
    status = ''
    resultPath = ''

    constructor(jobId, jobName, jobCode){
        this.jobId = jobId;
        this.jobName = jobName;
        this.jobCode = jobCode;
        this.status = 'waiting';
        this.resultPath = ''
        
        const jobPath = `execution/${this.jobId}`;
        fs.mkdirSync(jobPath, { recursive: true });

        fs.writeFileSync(`${jobPath}/code.py`, this.jobCode);

    }

    getStatus() {
      return {
        jobId: this.jobId,
        status: this.status,
        resultPath: this.status === 'completed' ? this.resultPath : null,
      };
    }


    executeJob(){
        if(this.status != 'waiting') return;
        
        const codeFile = `execution/${this.jobId}/code.py`;
        const outputDir = `execution/${this.jobId}/media/videos`;

        const command = `manim "${codeFile}" "${this.jobName}" -qk -o`; // Prevent Malecious Commands 

          exec(command, (err, stdout, stderr) => {
            if (err) {
              console.error(`Job ${this.jobId} failed:\n`, stderr);
              this.status = 'failed';
              return;
            }

            
            this.status = 'completed';
            const result = path.join(outputDir, `${this.jobName}.mp4`);
            this.resultPath = result;

            setTimeout(() => {
              fs.rmSync(`execution/${this.jobId}`, { recursive: true, force: true });
            }, 60 * 1000);
        })
    }
}

export default Job;