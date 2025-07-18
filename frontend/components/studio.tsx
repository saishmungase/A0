import React, { useState, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import VideoPlayer from '../components/videoPlayer'

interface StatusCapsuleProps {
  status: 'queuing' | 'executing' | 'completed' | 'waiting' | 'failed' | string;
  message: string; 
}

const StatusCapsule: React.FC<StatusCapsuleProps> = ({ status, message }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queuing':
      case 'waiting':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'executing':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(status)}`}
    >
      {status === 'executing' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      <span>{message}</span>
    </motion.div>
  );
};

const Rules: React.FC = () => {
  const rules = [
    'Keep prompts clear and descriptive for better results',
    'Specify animation style, duration, and key elements',
    'Use simple language - avoid complex technical terms',
    'Include details about colors, movements, and transitions',
    'Maximum prompt length is 500 characters',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto mb-8"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent"
      >
        Animation Studio Rules
      </motion.h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rules.map((rule, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            className="p-4 bg-black/20 backdrop-blur-md rounded-xl border border-green-400/20 hover:border-green-400/40 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold text-lg">{index + 1}.</span>
              <p className="text-gray-300 text-sm leading-relaxed">{rule}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

type StatusObject = {
  status: 'queuing' | 'executing' | 'completed' | 'waiting' | 'failed';
  message: string;
};

const Studio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StatusObject | null>(null);
  const [showRules, setShowRules] = useState(true);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulateProcessing = async () => {
    setIsProcessing(true);
    setSubmittedPrompt(prompt);
    setError(null);
    setCurrentStatus({ status: 'queuing', message: 'Generating code...' });

    try {
      const codeResponse = await axios.post('https://animatezero.onrender.com/generate', {
        prompt: prompt
      });

      if (codeResponse.data.type === 'error') {
        setError(codeResponse.data.message);
        setIsProcessing(false);
        return;
      }

      const generatedCode = codeResponse.data.code;
      console.log('Generated code:', generatedCode);
      
      setCurrentStatus({ status: 'queuing', message: 'Submitting job...' });
      
      const jobResponse = await axios.post('https://animatezero.onrender.com/submit', {
        code: generatedCode,
        name: 'A0'
      });
      
      console.log('Job response:', jobResponse.data);
      
      const jobId = jobResponse.data.jobId;
      
      if (!jobId) {
        setError('Failed to create job');
        setIsProcessing(false);
        return;
      }

      const interval = setInterval(async () => {
        try {
          const statusResponse = await axios.post('https://animatezero.onrender.com/status', {
            id: jobId
          });
          
          const { status: currentJobStatus } = statusResponse.data;

          console.log('Job status:', currentJobStatus);

          if (currentJobStatus === 'waiting') {
            setCurrentStatus({ status: 'queuing', message: 'Waiting in queue...' });
          } else if (currentJobStatus === 'executing') {
            setCurrentStatus({ status: 'executing', message: 'Rendering animation...' });
          } else if (currentJobStatus === 'completed') {
            setCurrentStatus({ status: 'completed', message: 'Animation completed!' });
            setVideoSrc(`https://animatezero.onrender.com/result/${jobId}`);
            setIsProcessing(false);
            clearInterval(interval);
          } else if (currentJobStatus === 'failed') {
            setError('Animation rendering failed');
            setIsProcessing(false);
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Failed to fetch job status:', err);
          setError('Failed to fetch job status');
          setIsProcessing(false);
          clearInterval(interval);
        }
      }, 2000);

    } catch (err) {
      console.error('Error in processing:', err);
      setError('Something went wrong while processing your request');
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (prompt.trim()) {
      setShowRules(false);
      await simulateProcessing();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const resetStudio = () => {
    setPrompt('');
    setSubmittedPrompt('');
    setIsProcessing(false);
    setCurrentStatus(null);
    setShowRules(true);
    setVideoSrc(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex gap-8 px-8 py-4 rounded-full bg-black/30 backdrop-blur-md border border-green-400/20">
          {['Home', 'Studio', 'Internals'].map((label, idx) => (
            <motion.a
              key={label}
              href={idx === 0 ? '/' : idx === 1 ? '/studio' : '#'}
              className="text-white hover:text-green-400 transition-colors duration-300 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {label}
            </motion.a>
          ))}
        </div>
      </motion.nav>

      <div className="flex-1 flex flex-col pt-32 pb-8 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
            Animation Studio
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Describe your vision and watch it come to life in stunning 2D animation
          </p>
        </motion.div>

        <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
          <AnimatePresence>{showRules && <Rules />}</AnimatePresence>

          <AnimatePresence>
            {submittedPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <div className="p-4 bg-black/20 backdrop-blur-md rounded-xl border border-green-400/20">
                  <p className="text-white">{submittedPrompt}</p>
                </div>

                <div className="mt-4 flex justify-center">
                  <AnimatePresence mode="wait">
                    {currentStatus && (
                      <StatusCapsule
                        key={currentStatus.message}
                        status={currentStatus.status}
                        message={currentStatus.message}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-400/30 text-red-400 text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {videoSrc && (
              <VideoPlayer videoSrc={videoSrc} onClose={() => setVideoSrc(null)} />
            )}
          </AnimatePresence>

          <div className="flex-1" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-auto"
          >
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={handleInputChange}
                  placeholder="Describe your animation idea..."
                  className="w-full h-24 p-4 bg-black/30 backdrop-blur-md border border-green-400/30 rounded-2xl text-white placeholder-gray-500 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all duration-300 resize-none"
                  maxLength={500}
                  disabled={isProcessing}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {prompt.length}/500
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isProcessing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-black font-semibold rounded-full hover:from-green-400 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isProcessing ? 'Creating...' : 'Create Animation'}
                </motion.button>

                {(submittedPrompt || videoSrc) && (
                  <motion.button
                    onClick={resetStudio}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-black/30 backdrop-blur-md border border-green-400/30 text-green-400 hover:bg-green-400/10 font-semibold rounded-full transition-all duration-300"
                  >
                    New Animation
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Studio;