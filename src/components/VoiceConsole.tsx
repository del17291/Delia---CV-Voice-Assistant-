import React, { useRef, useEffect } from 'react';
import {
  Mic,
  Volume2,
  Sparkles,
  RotateCcw,
  Square,
  VolumeX,
} from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { SUGGESTED_QUESTIONS } from '../data/cvData';

interface VoiceConsoleProps {
  messages: ChatMessage[];
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  onMicClick: () => void;
  onStopSpeaking: () => void;
  onPlayGreeting: () => void;
  onSelectTopic: (prompt: string) => void;
  onReplayAudio: (msg: ChatMessage) => void;
  onClearHistory: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  micEnergy: number;
}

export const VoiceConsole: React.FC<VoiceConsoleProps> = ({
  messages,
  isSpeaking,
  isListening,
  isThinking,
  language,
  setLanguage,
  onMicClick,
  onStopSpeaking,
  onPlayGreeting,
  onSelectTopic,
  onReplayAudio,
  onClearHistory,
  isMuted,
  setIsMuted,
  micEnergy,
}) => {
  const captionsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    captionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, isSpeaking]);

  const currentQuestions = SUGGESTED_QUESTIONS.filter(
    (q) => language === 'auto' || q.lang === language
  );

  const latestLilouMessage = [...messages].reverse().find((m) => m.role === 'model');

  return (
    <div className="w-full space-y-6">
      {/* Central Luxury Voice Stage */}
      <div className="relative bg-[#0d2f2b] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#1b4b45] overflow-hidden">
        {/* Subtle luxury ambient backlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(37,103,94,0.4),transparent_75%)] pointer-events-none" />

        {/* Top Control Bar inside Voice Stage */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#18453f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#133c36] border border-[#276158] flex items-center justify-center text-[#d3be9e]">
              <Sparkles className="w-5 h-5 text-[#d3be9e]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif tracking-wide text-white">Lilou</h2>
                <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#1b4b45] text-[#d3be9e] border border-[#2b685f]">
                  Voice Assistant
                </span>
              </div>
              <p className="text-xs text-[#a3bcb6]">Consistent soft & confident female voice • Délia Melters</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#09221f] p-1 rounded-full border border-[#1b4b45]">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  language === 'en'
                    ? 'bg-[#1b4b45] text-[#f4f1ea] shadow'
                    : 'text-[#87a39d] hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('de')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  language === 'de'
                    ? 'bg-[#1b4b45] text-[#f4f1ea] shadow'
                    : 'text-[#87a39d] hover:text-white'
                }`}
              >
                Deutsch
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  language === 'fr'
                    ? 'bg-[#1b4b45] text-[#f4f1ea] shadow'
                    : 'text-[#87a39d] hover:text-white'
                }`}
              >
                Français
              </button>
            </div>

            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl text-xs font-medium bg-[#133c36] text-[#cbe0dc] border border-[#235850] hover:text-white transition-colors"
              title={isMuted ? 'Unmute voice' : 'Mute voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Center: THE SINGLE MIC SYMBOL (Tap to speak, tap again to answer or auto-stops on silence) */}
        <div className="relative z-10 py-10 sm:py-14 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Animated acoustic soundwave rings when speaking */}
            {isSpeaking && (
              <>
                <div className="absolute w-60 h-60 sm:w-68 sm:h-68 rounded-full border border-[#52a699]/40 animate-ping opacity-30 pointer-events-none" />
                <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-[#d3be9e]/50 animate-pulse opacity-60 pointer-events-none" />
              </>
            )}

            {/* Dynamic voice level ring when listening */}
            {isListening && (
              <>
                <div
                  className="absolute rounded-full border-2 border-emerald-400/70 animate-pulse pointer-events-none transition-all duration-150"
                  style={{
                    width: `${148 + Math.min(micEnergy * 320, 80)}px`,
                    height: `${148 + Math.min(micEnergy * 320, 80)}px`,
                  }}
                />
                <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-emerald-300/30 animate-ping opacity-35 pointer-events-none" />
              </>
            )}

            {/* The Unified Single Microphone Button */}
            <button
              onClick={onMicClick}
              className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer focus:outline-none select-none ${
                isSpeaking
                  ? 'bg-gradient-to-tr from-[#14473f] via-[#1f665a] to-[#2ea894] shadow-[0_0_50px_rgba(46,168,148,0.55)] scale-105'
                  : isListening
                  ? 'bg-gradient-to-tr from-[#0a2f2a] via-[#1a5b50] to-[#10b981] shadow-[0_0_50px_rgba(16,185,129,0.55)] scale-110 ring-4 ring-emerald-400/40 animate-pulse'
                  : isThinking
                  ? 'bg-gradient-to-tr from-[#123833] via-[#21574d] to-[#d3be9e] shadow-[0_0_35px_rgba(211,190,158,0.4)] animate-pulse'
                  : 'bg-gradient-to-tr from-[#09221f] via-[#123a34] to-[#1a4f47] border-2 border-[#2b685f] hover:border-[#d3be9e] hover:scale-105 hover:shadow-[0_0_30px_rgba(211,190,158,0.25)]'
              }`}
              title={
                isSpeaking
                  ? 'Click to pause Lilou'
                  : isListening
                  ? 'Click to answer immediately (or pause speaking)'
                  : 'Click to speak to Lilou'
              }
            >
              {isSpeaking ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 h-8 mb-1">
                    <span className="w-1.5 bg-[#e5cfab] rounded-full animate-bounce [animation-delay:-0.3s] h-6" />
                    <span className="w-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s] h-8" />
                    <span className="w-1.5 bg-[#e5cfab] rounded-full animate-bounce h-5" />
                    <span className="w-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.2s] h-7" />
                    <span className="w-1.5 bg-[#e5cfab] rounded-full animate-bounce [animation-delay:-0.1s] h-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#d3be9e] font-semibold">
                    Tap to stop
                  </span>
                </div>
              ) : isListening ? (
                <div className="flex flex-col items-center justify-center">
                  <Mic className="w-12 h-12 text-white animate-pulse" />
                  <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold mt-1">
                    Listening
                  </span>
                </div>
              ) : isThinking ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 border-3 border-[#d3be9e] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] uppercase tracking-wider text-[#d3be9e] font-medium">
                    Thinking
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Mic className="w-12 h-12 text-[#d3be9e] opacity-95 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase tracking-wider text-[#d3be9e] font-bold mt-1">
                    Tap to speak
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Unified Clear Status Instructions */}
          <div className="mt-8 text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#08201d] border border-[#1b4a44] text-xs font-medium">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isSpeaking
                    ? 'bg-emerald-400 animate-ping'
                    : isListening
                    ? 'bg-amber-400 animate-pulse'
                    : isThinking
                    ? 'bg-[#d3be9e] animate-pulse'
                    : 'bg-[#52a699]'
                }`}
              />
              <span className="text-[#f4f1ea]">
                {isSpeaking
                  ? 'Lilou is speaking — tap mic anytime to stop'
                  : isListening
                  ? 'Listening to your voice... (tap mic again to answer now, or stop talking)'
                  : isThinking
                  ? 'Lilou is preparing to answer...'
                  : 'Tap the mic symbol to speak'}
              </span>
            </div>

            <p className="text-xs text-[#9eb6b1] max-w-md mx-auto">
              {isListening
                ? 'Speak naturally. When you finish speaking or click the mic symbol, Lilou will answer.'
                : isSpeaking
                ? 'Lilou finishes her full sentence with a soft, confident tone.'
                : 'One single tap to talk. Automatic silence detection answers when you pause.'}
            </p>
          </div>

          {/* Intro Audition */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onPlayGreeting}
              disabled={isSpeaking || isThinking || isListening}
              className="px-4 py-2 rounded-2xl text-xs font-medium bg-[#133c36] text-[#d3be9e] border border-[#235850] hover:bg-[#1a4a43] hover:text-white transition-colors disabled:opacity-50"
            >
              Audition Voice Introduction
            </button>
          </div>
        </div>

        {/* Latest Spoken Thought Banner */}
        {latestLilouMessage && (
          <div className="relative z-10 mt-2 p-5 rounded-2xl bg-[#08201d]/90 border border-[#1d4d46] text-sm leading-relaxed">
            <div className="flex items-center justify-between text-xs text-[#d3be9e] mb-2 font-medium">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Volume2 className="w-3.5 h-3.5" />
                Latest Spoken Statement by Lilou
              </span>
              {latestLilouMessage.audioBase64 && (
                <button
                  onClick={() => onReplayAudio(latestLilouMessage)}
                  className="hover:underline flex items-center gap-1 text-[11px]"
                >
                  Replay Voice
                </button>
              )}
            </div>
            <p className="text-[#f4f1ea] font-serif text-base sm:text-lg italic leading-relaxed">
              "{latestLilouMessage.content}"
            </p>
          </div>
        )}
      </div>

      {/* Curated Voice Topics (Tap to ask out loud) */}
      <div className="bg-white rounded-3xl p-6 border border-[#e5dfd5] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0d2f2b]" />
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#0d2f2b] uppercase font-sans">
              Curated Voice Topics
            </h3>
          </div>
          <span className="text-xs text-[#708480]">Or tap any topic to listen</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSelectTopic(q.prompt)}
              disabled={isSpeaking || isThinking || isListening}
              className="text-left p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#ded7cc] hover:border-[#0d2f2b] hover:bg-[#0d2f2b] hover:text-[#f4f1ea] text-[#112421] transition-all group shadow-2xs disabled:opacity-50"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#8b6f48] group-hover:text-[#d3be9e] mb-1 uppercase tracking-wider">
                <span>{q.category}</span>
                <Volume2 className="w-3 h-3 opacity-70 group-hover:opacity-100" />
              </div>
              <div className="text-xs font-medium leading-snug line-clamp-2">
                {q.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Spoken Dialogue History & Captions */}
      <div className="bg-white rounded-3xl border border-[#e5dfd5] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#eee8df] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#0d2f2b] uppercase font-sans">
              Spoken Captions
            </h3>
            <span className="text-xs text-[#708480]">
              ({messages.length} spoken {messages.length === 1 ? 'turn' : 'turns'})
            </span>
          </div>

          <button
            onClick={onClearHistory}
            className="text-xs text-[#708480] hover:text-[#0d2f2b] transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#708480]">
              No voice dialogue yet. Tap the microphone symbol above to begin speaking.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 text-[11px] text-[#708480]">
                  <span className="font-semibold text-[#112421]">
                    {msg.role === 'user' ? 'You' : 'Lilou'}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0d2f2b] text-[#f4f1ea] rounded-tr-none shadow-sm'
                      : 'bg-[#f4f1eb] text-[#112421] border border-[#e5dfd5] rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {msg.role === 'model' && msg.audioBase64 && (
                    <button
                      onClick={() => onReplayAudio(msg)}
                      className="mt-2 pt-2 border-t border-[#e2dcd2] text-xs text-[#41605a] hover:text-[#0d2f2b] flex items-center gap-1 font-medium"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Replay Voice</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={captionsEndRef} />
        </div>
      </div>
    </div>
  );
};
