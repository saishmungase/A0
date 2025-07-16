import express from 'express'
import cors from 'cors'
import JobManager from './jobManager'
import path from 'path'
import fs from 'fs'

const app = express()
const PORT = 3000;

app.use(cors());

app.use(express.json())

// Creating a Job Manger
const jobManager = new JobManager();

app.post('/submit', (req, res) => {
    const body = req.body;
    const code = body.code;
    const name = body.name;

    if (!code || !name) {
        return res.status(400).json({
            type: 'error',
            message: 'Missing job code or scene name!',
        });
    }


    const jobId = jobManager.addJob(name, code);

    if(!jobId){
        return res.json({
            type : 'error',
            message : 'failed to create job !'
        });
    }

    res.status(200).json({
        type : 'created',
        jobId : jobId,
        message : 'Job Is Added Successfully !'
    });
})

app.post('/status', (req, res) => {
    const body = req.body;
    const jobId = body.id;

    if (!jobId) {
        return res.status(400).json({
            type: 'error',
            message: 'Missing job Id!',
        });
    }


    const condition = jobManager.polling(jobId);

    if (!condition) {
        return res.status(404).json({
            type: 'error',
            message: 'Job not found!',
        });
    }

    
    res.status(200).json(condition);
});


app.get('/result/:id', (req, res) => {
    const jobId = req.params.id;
    const job = jobManager.map.get(jobId);

    if (!job) {
        return res.status(404).json({
            type: 'error',
            message: 'Job not found!',
        });
    }

    if (!job.resultPath || !fs.existsSync(job.resultPath)) {
      return res.status(410).json({
        type: 'error',
        message: 'Video not available anymore!',
      });
    }

    res.sendFile(path.resolve(job.resultPath));

})


app.listen(PORT, (req, res) => {
    console.log("Application is Running !!")
})