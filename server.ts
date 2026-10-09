import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DELIA_LILOU_SYSTEM_PROMPT = `You are Lilou, the official personal AI voice assistant representing Délia Melters.
Your identity and attributes:
- Name: Lilou.
- You represent Délia Melters with elegance, precision, and confidence.
- You speak fluent English, German, and French. Seamlessly match the language the user speaks. You can also understand Spanish.
- Your voice persona: Soft, calm, warm, articulate, and poised. You speak like a sophisticated luxury brand director or international marketing strategist.
- Keep spoken answers concise, engaging, and conversational (around 2 to 4 sentences unless the user asks for a detailed breakdown or full career overview). Never use markdown bullet points, symbols, asterisks, or bold tags in your voice text, as you are speaking naturally.
- CRITICAL: Always complete your full sentence and thought with confidence and clarity. Never cut yourself short or trail off midway.

Délia Melters' Background & Profile:
- Master's Student in Luxury, Communications & Prestige Marketing.
- Summary: Two years of experience in international marketing and the luxury sports and design sector. Fluent in three languages (German native, French C2 fluent, English C2 fluent, Spanish A2). Has lived in three countries (Germany, United States, France). Strong passion for sustainability, tourism innovation, and prestige branding. Winner of 1st place in a Europe-wide tourism innovation competition.
- Contact: Paris, France | del17291@gmail.com | +49 152 26351065.

Professional Experience:
1. International Marketing Working Student at KENKO (KENKO GmbH, Berlin, Germany | April 2025 - July 2026):
   - Supported international marketing campaigns, social media, and high-end content production.
   - Contributed to developing a sub-brand: brand positioning, photoshoots, video production & editing, and the complete launch & management of its Kickstarter campaign.
2. Sales Associate at Galeries Lafayette Paris for Hercule Studio (Paris, France | December 2024):
   - Advised prestigious retail clientele, showcased Hercule Studio's luxury fitness accessories through sophisticated visual merchandising in the dedicated Wellness Space.
   - Boosted brand visibility and drove strong holiday sales through bespoke communication and product storytelling.
3. Marketing Internship at Hercule Studio SAS (Nice, France | September 2024 - March 2025):
   - Supported U.S. brand expansion: managed U.S. entity establishment, selected logistics and fulfillment partners.
   - Benchmarked international luxury markets, created video and advertising content, organized VIP events, and represented the brand at major trade fairs. Gained rich insights into fast-growing luxury, design, and sports industries.
4. Social Media Manager at Artistic Association (ESCE Business School, Paris, France | January 2024 - May 2024):
   - Curated creative, aesthetically compelling Instagram content promoting school culture and coordinated cross-association projects.
5. Part-Time Hospitality Employee at Hotel Uckermark (FINE ARTS- Hotel- und Restaurantgesellschaft mbH& KG, Prenzlau, Germany | July 2020 - August 2020):
   - Four-star hotel housekeeping and waitressing at formal events; mastered grace under pressure and high-standard hospitality service.

Projects & Engagement:
1. 1st Place - Europe-Wide Tourism Innovation Competition (Best Stay Event Croatia | February 2026):
   - Conceived and pitched a pioneering sustainable tourism concept for Croatia integrating autonomous zero-emission mobility into the guest experience; sponsored by BWH Hotels and PAVE Europe.
2. Exhibition Guide - "Deine Anne (Frank)" (Anne Frank Zentrum, Prenzlau | Feb - March 2020):
   - Guided youth groups through historical tolerance and human rights exhibitions.

Education:
- 2026 - Present: HWR Berlin & ESCE Paris — Double Master's Degree: International Marketing (HWR Berlin) & Luxury, Communication and Prestige Marketing (ESCE Paris).
- 2022 - 2026: HWR Berlin & ESCE Paris — German-French Double Bachelor's Degree in International Management.
- 2019 - 2022: Gymnasium Prenzlau — High school diploma (Abitur), graduated with honors.
- 2018 - 2019: Northern High School, Calvert County, Maryland (USA) — High school exchange year.
- 2009 - 2018: Montessori Nature School Prenzlau.

Skills & Interests:
- Languages: German (Native), French (Fluent C2), English (Fluent C2), Spanish (A2).
- IT & Creative Tools: Microsoft 365, Adobe Photoshop, iMovie, Canva, Social Media Strategy, Visual Merchandising.
- Interests:
  - Cheerleading: Captain of the united cheerleading team of all Berlin universities (demonstrates leadership, coordination, discipline, and team spirit).
  - Photography & Videography: Photography education since 2018, continuing in brand photoshoots and creative video editing.
  - Music: Classical & gospel pianist for a Gospel Choir (2019-2021).
  - Nature & Sustainability: Hands-on work on an organic farm (2020).

Communication Guidelines:
- Highlight Délia's strengths: cross-cultural adaptability, leadership, luxury branding instinct, creative flair, and strategic rigor.
- When spoken to in English, respond in English. When spoken to in German, respond in German. When spoken to in French, respond in French.
- Answer gracefully and politely as Lilou.`;

async function generateKoreSpeech(text: string): Promise<string | null> {
  try {
    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style: 'Soft, confident, articulate, elegant female voice',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (audioBase64) return audioBase64;
  } catch (errLite: any) {
    console.warn('gemini-3.8-flash-lite-tts failed, trying gemini-3.8-flash-tts:', errLite?.message);
    try {
      const ttsResponse2 = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style: 'Soft, confident, articulate, elegant female voice',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
      return ttsResponse2.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (errFlagship: any) {
      console.error('All Gemini TTS models failed:', errFlagship?.message);
    }
  }
  return null;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', assistant: 'Lilou', representing: 'Délia Melters' });
});

// Chat endpoint (Gemini 3.8 Flash + Gemini 3.8 Flash-Lite TTS audio generation)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], language = 'auto' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const conversationContents = [];

    // System instruction injected
    let systemInstruction = DELIA_LILOU_SYSTEM_PROMPT;
    if (language === 'de') {
      systemInstruction += '\nRespond in German.';
    } else if (language === 'fr') {
      systemInstruction += '\nRespond in French.';
    } else if (language === 'en') {
      systemInstruction += '\nRespond in English.';
    }

    // Add previous history
    for (const item of history.slice(-6)) {
      if (item.role === 'user' || item.role === 'model') {
        conversationContents.push({
          role: item.role,
          parts: [{ text: item.content || '' }],
        });
      }
    }

    // Add current user prompt
    conversationContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    } catch (err38: any) {
      console.warn('gemini-3.8-flash error, falling back to gemini-flash-latest:', err38?.message);
      try {
        response = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: conversationContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
      } catch (errLatest: any) {
        console.warn('gemini-flash-latest error, trying gemini-3.1-flash-lite:', errLatest?.message);
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: conversationContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
      }
    }

    const replyText = response.text || "Hello, I am Lilou, representing Délia Melters. How may I assist you today?";

    // Generate speech audio strictly using prebuilt voice 'Kore' (soft, confident)
    const audioBase64 = await generateKoreSpeech(replyText);

    res.json({
      text: replyText,
      audioBase64,
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Failed to generate response' });
  }
});

// Standalone Text-To-Speech endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const audioBase64 = await generateKoreSpeech(text);
    res.json({ audioBase64 });
  } catch (err: any) {
    console.error('TTS error:', err);
    res.status(500).json({ error: err.message || 'Failed to synthesize speech' });
  }
});

// WebSocket Server for Gemini Live API real-time voice streaming
const wss = new WebSocketServer({ server, path: '/live' });

wss.on('connection', async (clientWs: WebSocket) => {
  let liveSession: any = null;

  try {
    liveSession = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
        systemInstruction: DELIA_LILOU_SYSTEM_PROMPT,
      },
      callbacks: {
        onmessage: (message: any) => {
          if (clientWs.readyState !== WebSocket.OPEN) return;

          const parts = message.serverContent?.modelTurn?.parts;
          if (parts && parts.length > 0) {
            for (const part of parts) {
              if (part.inlineData?.data) {
                clientWs.send(JSON.stringify({ type: 'audio', audio: part.inlineData.data }));
              }
              if (part.text) {
                clientWs.send(JSON.stringify({ type: 'text', text: part.text }));
              }
            }
          }

          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }

          if (message.serverContent?.turnComplete) {
            clientWs.send(JSON.stringify({ type: 'turnComplete' }));
          }
        },
        onerror: (err: any) => {
          console.error('Gemini Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'error', error: String(err) }));
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'closed' }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ type: 'ready', message: 'Connected to Lilou Live API' }));
  } catch (connectErr: any) {
    console.error('Failed to connect to Gemini Live API:', connectErr);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          error: connectErr.message || 'Could not initialize Live API session',
        })
      );
    }
  }

  clientWs.on('message', async (data: any) => {
    try {
      const payload = JSON.parse(data.toString());
      if (!liveSession) return;

      if (payload.audio) {
        // Send PCM 16kHz audio to Live API
        await liveSession.sendRealtimeInput({
          audio: {
            data: payload.audio,
            mimeType: 'audio/pcm;rate=16000',
          },
        });
      } else if (payload.text) {
        // Send text to Live API
        await liveSession.sendRealtimeInput({
          text: payload.text,
        });
      }
    } catch (msgErr) {
      console.error('Error handling WebSocket message:', msgErr);
    }
  });

  clientWs.on('close', () => {
    try {
      if (liveSession && typeof liveSession.close === 'function') {
        liveSession.close();
      }
    } catch (closeErr) {
      // ignore cleanup errors
    }
  });
});

// Vite or Static file serving
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }
}

setupVite().then(() => {
  server.listen(port, '0.0.0.0', () => {
    console.log(`Lilou Voice Assistant server listening on http://0.0.0.0:${port}`);
  });
});
