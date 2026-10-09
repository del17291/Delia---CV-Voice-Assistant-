import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { VoiceConsole } from './components/VoiceConsole';
import { CVExplorer } from './components/CVExplorer';
import { ChatMessage, Language } from './types';
import { AudioStreamPlayer, playWavBase64 } from './utils/audioUtils';

const GREETINGS: Record<Language, string> = {
  en: "Hello, I am Lilou. I represent Délia Melters in luxury marketing, brand strategy, and international management. How may I introduce her experience to you?",
  de: "Hallo, ich bin Lilou, die offizielle Sprachassistentin von Délia Melters. Wie kann ich dir Délia und ihre Erfahrungen im internationalen Luxusmarketing vorstellen?",
  fr: "Bonjour, je suis Lilou, l'assistante vocale représentant Délia Melters. Comment puis-je vous présenter son parcours dans l'univers du luxe et du marketing international ?",
  auto: "Hello, I am Lilou. I represent Délia Melters. I speak English, German, and French fluently. How may I assist you today?",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'assistant' | 'cv'>('assistant');
  const [language, setLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [micEnergy, setMicEnergy] = useState(0);
  const [activeAudioElement, setActiveAudioElement] = useState<HTMLAudioElement | null>(null);

  // Synchronous state refs
  const isSpeakingRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const lastSubmittedPromptRef = useRef<string>('');
  const lastSubmittedTimeRef = useRef<number>(0);
  const audioPlayerRef = useRef<AudioStreamPlayer | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const capturedTranscriptRef = useRef<string>('');
  const micMediaStreamRef = useRef<MediaStream | null>(null);
  const micAudioCtxRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const hasSpokenRef = useRef(false);

  // Sync ref with isSpeaking state
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Initialize Audio player and initial greeting
  useEffect(() => {
    audioPlayerRef.current = new AudioStreamPlayer();

    const initialGreeting = GREETINGS[language];
    setMessages([
      {
        id: 'msg-greeting',
        role: 'model',
        content: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    return () => {
      cleanupMic();
      if (activeAudioElement) {
        activeAudioElement.pause();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Sync mute state
  useEffect(() => {
    audioPlayerRef.current?.setMuted(isMuted);
    if (activeAudioElement) {
      activeAudioElement.muted = isMuted;
    }
  }, [isMuted, activeAudioElement]);

  // Stop currently playing audio
  const handleStopSpeaking = useCallback(() => {
    if (activeAudioElement) {
      activeAudioElement.pause();
      setActiveAudioElement(null);
    }
    audioPlayerRef.current?.stopAll();
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  }, [activeAudioElement]);

  // Play audio strictly using the Gemini Kore female voice
  const playKoreAudio = useCallback(
    (audioBase64: string | null | undefined, onFinished?: () => void) => {
      if (isMuted || !audioBase64) {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        onFinished?.();
        return;
      }

      handleStopSpeaking();
      setIsSpeaking(true);
      isSpeakingRef.current = true;

      const audio = playWavBase64(audioBase64, () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        setActiveAudioElement(null);
        onFinished?.();
      });
      setActiveAudioElement(audio);
    },
    [isMuted, handleStopSpeaking]
  );

  // Play audition introduction in Kore voice
  const handlePlayGreeting = useCallback(async () => {
    const greetingText = GREETINGS[language];
    setIsThinking(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: greetingText }),
      });
      const data = await res.json();
      setIsThinking(false);
      if (data.audioBase64) {
        playKoreAudio(data.audioBase64);
      }
    } catch (err) {
      setIsThinking(false);
      console.error('Greeting error:', err);
    }
  }, [language, playKoreAudio]);

  // Send query to /api/chat and speak back in consistent Kore voice
  const handleSendVoiceQuery = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        isSubmittingRef.current = false;
        return;
      }

      // Prevent duplicate submissions of the exact same query within 3 seconds
      const now = Date.now();
      if (
        lastSubmittedPromptRef.current === trimmed &&
        now - lastSubmittedTimeRef.current < 3000
      ) {
        console.warn('Blocked duplicate query submission:', trimmed);
        return;
      }

      lastSubmittedPromptRef.current = trimmed;
      lastSubmittedTimeRef.current = now;
      isSubmittingRef.current = true;

      handleStopSpeaking();

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      try {
        const historyPayload = messages.slice(-4).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: historyPayload,
            language,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to communicate with Lilou service');
        }

        const data = await response.json();
        setIsThinking(false);

        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          audioBase64: data.audioBase64,
        };

        setMessages((prev) => [...prev, modelMsg]);

        // Speak the reply in Kore voice to completion
        if (data.audioBase64) {
          playKoreAudio(data.audioBase64);
        }
      } catch (err: any) {
        setIsThinking(false);
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'model',
          content:
            "I apologize, but I could not connect at this moment. Please feel free to try again or browse Délia's dossier.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setTimeout(() => {
          isSubmittingRef.current = false;
        }, 1000);
      }
    },
    [messages, language, handleStopSpeaking, playKoreAudio]
  );

  // Clean up mic streams safely without triggering onend duplicate cascades
  const cleanupMic = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (speechRecognitionRef.current) {
      const rec = speechRecognitionRef.current;
      // Strip listeners before aborting to prevent onend duplicate trigger
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      try {
        rec.abort();
      } catch (e) {}
      speechRecognitionRef.current = null;
    }
    if (micMediaStreamRef.current) {
      micMediaStreamRef.current.getTracks().forEach((t) => t.stop());
      micMediaStreamRef.current = null;
    }
    if (micAudioCtxRef.current) {
      micAudioCtxRef.current.close().catch(() => {});
      micAudioCtxRef.current = null;
    }
    setMicEnergy(0);
    setIsListening(false);
  };

  // Finish listening and trigger Lilou's response exactly once
  const finishListeningAndAnswer = useCallback(() => {
    if (isSubmittingRef.current) return;

    const recognizedText = capturedTranscriptRef.current.trim();
    // Immediately clear captured transcript so it cannot be submitted twice
    capturedTranscriptRef.current = '';

    cleanupMic();

    if (recognizedText) {
      handleSendVoiceQuery(recognizedText);
    }
  }, [handleSendVoiceQuery]);

  // Start audio energy monitor for visualizer and silence detector
  const startAudioEnergyMonitor = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      micMediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      micAudioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      micAnalyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateEnergy = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length / 255;
        setMicEnergy(avg);
        animFrameRef.current = requestAnimationFrame(updateEnergy);
      };

      updateEnergy();
    } catch (err) {
      console.warn('Could not initialize audio energy monitor:', err);
    }
  };

  // THE SINGLE UNIFIED MIC CLICK HANDLER:
  // 1. If speaking: tap stops/pauses Lilou
  // 2. If listening: tap finishes speaking immediately and answers
  // 3. If idle: tap starts listening with automatic silence detection
  const handleMicClick = () => {
    if (isSpeaking) {
      handleStopSpeaking();
      return;
    }

    if (isListening) {
      // User tapped mic again -> immediately answer with whatever was captured!
      finishListeningAndAnswer();
      return;
    }

    // Start Listening
    capturedTranscriptRef.current = '';
    hasSpokenRef.current = false;
    setIsListening(true);

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang =
          language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          capturedTranscriptRef.current = currentTranscript;
          hasSpokenRef.current = true;

          // Reset silence timer whenever user speaks new words
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          // After 1.3s of silence after speaking, automatically finish and answer!
          silenceTimerRef.current = setTimeout(() => {
            if (capturedTranscriptRef.current.trim()) {
              finishListeningAndAnswer();
            }
          }, 1300);
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition status:', e?.error);
        };

        recognition.onend = () => {
          // If still marked as listening and words were captured, answer
          if (capturedTranscriptRef.current.trim()) {
            finishListeningAndAnswer();
          } else {
            cleanupMic();
          }
        };

        speechRecognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Recognition start error:', err);
      }
    }

    // Start background energy monitor for acoustic waves and energy silence trigger
    startAudioEnergyMonitor();
  };

  const handleAskCVItem = (prompt: string) => {
    setActiveTab('assistant');
    handleSendVoiceQuery(prompt);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#112421] flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLiveActive={isListening}
        isSpeaking={isSpeaking}
      />

      {/* Main Experience */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'assistant' ? (
          <VoiceConsole
            messages={messages}
            isSpeaking={isSpeaking}
            isListening={isListening}
            isThinking={isThinking}
            language={language}
            setLanguage={setLanguage}
            onMicClick={handleMicClick}
            onStopSpeaking={handleStopSpeaking}
            onPlayGreeting={handlePlayGreeting}
            onSelectTopic={handleSendVoiceQuery}
            onReplayAudio={(msg) => playKoreAudio(msg.audioBase64)}
            onClearHistory={() => setMessages([])}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            micEnergy={micEnergy}
          />
        ) : (
          <div className="space-y-6">
            <CVExplorer onAskItem={handleAskCVItem} />
          </div>
        )}
      </main>

      {/* Minimalist Dark Green Footer */}
      <footer className="w-full bg-[#0d2f2b] text-[#b0c4bf] border-t border-[#18453f] py-6 text-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-[#f4f1ea] text-base tracking-wide">Délia Melters</span>
            <span>—</span>
            <span>Represented by Lilou</span>
          </div>

          <div className="flex items-center gap-6 text-[#9eb6b1]">
            <span>Paris, France</span>
            <span>•</span>
            <a
              href="mailto:del17291@gmail.com"
              className="hover:text-[#f4f1ea] transition-colors"
            >
              del17291@gmail.com
            </a>
            <span>•</span>
            <a
              href="tel:+4915226351065"
              className="hover:text-[#f4f1ea] transition-colors"
            >
              +49 152 26351065
            </a>
          </div>

          <div className="text-[11px] text-[#71928c]">
            Dark green chic minimalism • One-tap voice experience
          </div>
        </div>
      </footer>
    </div>
  );
}
