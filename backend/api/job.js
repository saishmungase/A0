import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

class Job {
    constructor(jobId, jobName, jobCode) {
        this.jobId = jobId;
        this.jobName = jobName;
        this.jobCode = jobCode;
        this.status = 'waiting';
        this.resultPath = '';
        
        this.jobName = jobName.replace(/[^a-zA-Z0-9_-]/g, '_');

        const jobPath = `execution/${this.jobId}`;
        try {
            fs.mkdirSync(jobPath, { recursive: true });
            fs.writeFileSync(`${jobPath}/code.py`, this.jobCode);
        } catch (error) {
            console.error(`Failed to create job directory or write code: ${error}`);
            this.status = 'failed';
        }
    }
    
    getStatus() {
        return {
            jobId: this.jobId,
            status: this.status,
            resultPath: this.status === 'completed' ? this.resultPath : null,
        };
    }

    executeJob() {
        if (this.status !== 'waiting') return;
        
        this.status = 'executing';
        
        const codeFile = `execution/${this.jobId}/code.py`;
        
        const command = `cd execution/${this.jobId} && manim code.py ${this.jobName} -qk --format=mp4 -o output.mp4`;

        console.log(`🚀 Starting job ${this.jobId} with command: ${command}`);

        exec(command, { 
            timeout:  20 * 60 * 1000, 
            cwd: process.cwd()
        }, (err, stdout, stderr) => {
            if (err) {
                console.error(`Job ${this.jobId} failed:`, err);
                console.error(`stderr: ${stderr}`);
                this.status = 'failed';
                return;
            }

            console.log(`Job ${this.jobId} stdout:`, stdout);
            
            const jobDir = `execution/${this.jobId}`;
            const mediaDir = `${jobDir}/media/videos`;
            
            let foundPath = null;
            
            try {
                if (fs.existsSync(mediaDir)) {
                    const findOutputFile = (dir) => {
                        const items = fs.readdirSync(dir);
                        
                        for (const item of items) {
                            const itemPath = path.join(dir, item);
                            const stat = fs.statSync(itemPath);
                            
                            if (stat.isDirectory()) {
                                const found = findOutputFile(itemPath);
                                if (found) return found;
                            } else if (item === 'output.mp4') {
                                return itemPath;
                            }
                        }
                        return null;
                    };
                    
                    foundPath = findOutputFile(mediaDir);
                }
                
                if (!foundPath) {
                    const possiblePaths = [
                        `${jobDir}/media/videos/code/2160p60/output.mp4`,
                        `${jobDir}/media/videos/code/1080p60/output.mp4`,
                        `${jobDir}/media/videos/code/720p30/output.mp4`,
                        `${jobDir}/media/videos/2160p60/output.mp4`,
                        `${jobDir}/media/videos/1080p60/output.mp4`,
                        `${jobDir}/media/videos/720p30/output.mp4`,
                        `${jobDir}/media/videos/output.mp4`,
                        `${jobDir}/output.mp4`
                    ];

                    for (const testPath of possiblePaths) {
                        if (fs.existsSync(testPath)) {
                            foundPath = testPath;
                            break;
                        }
                    }
                }
            } catch (searchError) {
                console.error(`Error searching for output file: ${searchError}`);
            }

            if (foundPath) {
                this.status = 'completed';
                this.resultPath = foundPath;
                console.log(`✅ Job ${this.jobId} completed. Output: ${this.resultPath}`);
                
                setTimeout(() => {
                    try {
                        fs.rmSync(`execution/${this.jobId}`, { recursive: true, force: true });
                        console.log(`🧹 Cleaned up job ${this.jobId}`);
                    } catch (cleanupError) {
                        console.error(`Failed to cleanup job ${this.jobId}:`, cleanupError);
                    }
                }, 5 * 60 * 1000); 
            } else {
                console.error(`Job ${this.jobId} completed but output file not found`);
                
                try {
                    const listFiles = (dir, prefix = '') => {
                        const items = fs.readdirSync(dir);
                        for (const item of items) {
                            const itemPath = path.join(dir, item);
                            const stat = fs.statSync(itemPath);
                            if (stat.isDirectory()) {
                                console.log(`${prefix}📁 ${item}/`);
                                listFiles(itemPath, prefix + '  ');
                            } else {
                                console.log(`${prefix}📄 ${item}`);
                            }
                        }
                    };
                    
                    console.log(`Directory structure for job ${this.jobId}:`);
                    listFiles(`execution/${this.jobId}`);
                } catch (debugError) {
                    console.error(`Could not list directory contents: ${debugError}`);
                }
                
                this.status = 'failed';
            }
        });
    }
}

export default Job;