import express from 'express'
import cors from 'cors'
import JobManager from './jobManager.js'
import path from 'path'
import fs from 'fs'
import { GoogleGenAI } from '@google/genai'
import { manimPrompt } from './manimPrompt.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3000;

app.use(cors());
app.use(express.json())

const jobManager = new JobManager();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI });

app.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    
    if (!prompt) {
        return res.status(400).json({
            type: 'error',
            message: 'Missing prompt!'
        });
    }

    try {
        console.log('Generating code for prompt:', prompt);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: manimPrompt + prompt,
        });

        const generatedCode = response.text;
        console.log('Generated code:', generatedCode);

        res.status(200).json({
            type: 'success',
            code: generatedCode,
            message: 'Code generated successfully!'
        });
    } catch (error) {
        console.error('Error generating code:', error);
        res.status(500).json({
            type: 'error',
            message: 'Failed to generate code'
        });
    }
});

app.post('/submit', (req, res) => {
    const body = req.body;
    const code = body.code
      .replace(/^```(?:python)?\s*/i, '') 
      .replace(/```$/, '');
    const name = body.name;
    
    if (!code || !name) {
        return res.status(400).json({
            type: 'error',
            message: 'Missing job code or scene name!',
        });
    }

    const jobId = jobManager.addJob(name, code);

    if(!jobId){
        return res.status(500).json({
            type: 'error',
            message: 'Failed to create job!'
        });
    }

    res.status(200).json({
        type: 'created',
        jobId: jobId,
        message: 'Job is added successfully!'
    });
});

app.get('/status/:id', (req, res) => {
    const jobId = req.params.id;

    if (!jobId) {
        return res.status(400).json({
            type: 'error',
            message: 'Missing job ID!',
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

app.post('/status', (req, res) => {
    const body = req.body;
    const jobId = body.id;

    if (!jobId) {
        return res.status(400).json({
            type: 'error',
            message: 'Missing job ID!',
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

    if (job.status !== 'completed' || !job.resultPath || !fs.existsSync(job.resultPath)) {
        return res.status(410).json({
            type: 'error',
            message: 'Video not available yet or has been removed!',
        });
    }

    res.sendFile(path.resolve(job.resultPath));
});

app.listen(PORT, () => {
    console.log(`API server is running on port ${PORT}!`);
});