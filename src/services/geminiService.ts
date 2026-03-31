import { GoogleGenAI, Modality, ThinkingLevel, Type } from "@google/genai";

// Use the platform-provided API key or a VITE_ prefixed one for client-side environments
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const getCosmicSignature = async (userData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Analyze this user data and provide a "Cosmic Signature" including a title, path, and a brief mystical description.
      Data: ${JSON.stringify(userData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            path: { type: Type.STRING },
            description: { type: Type.STRING },
            vibeScore: { type: Type.NUMBER }
          },
          required: ["title", "path", "description", "vibeScore"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Cosmic signature error:", error);
    throw new Error("The celestial alignment failed. Please ensure your birth data is accurate.");
  }
};

export const getDailyPredictions = async (userData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate daily predictions for Career, Love, and Health based on this user's cosmic signature.
      Signature: ${JSON.stringify(userData.signature)}`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            career: { type: Type.STRING },
            love: { type: Type.STRING },
            health: { type: Type.STRING },
            do: { type: Type.ARRAY, items: { type: Type.STRING } },
            dont: { type: Type.ARRAY, items: { type: Type.STRING } },
            lalKitabRemedy: { type: Type.STRING }
          },
          required: ["career", "love", "health", "do", "dont", "lalKitabRemedy"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Daily predictions error:", error);
    throw new Error("The stars are currently obscured. Please try recalibrating in a few moments.");
  }
};

export const getDailyCosmicInsight = async (userData: any, events: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a daily 'Cosmic Insight' summary based on the user's profile and current celestial events.
      User Profile: ${JSON.stringify(userData)}
      Celestial Events: ${JSON.stringify(events)}
      
      Provide a single, powerful, and poetic paragraph that summarizes the energy of the day for this specific user.`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Cosmic insight error:", error);
    return "The cosmic winds are shifting. Stay centered and observe the silence between the stars.";
  }
};

export const generateCosmicMusic = async (prompt: string) => {
  try {
    const response = await ai.models.generateContentStream({
      model: "lyria-3-clip-preview",
      contents: `Generate a 30-second cosmic, meditative track: ${prompt}`,
      config: {
        responseModalities: [Modality.AUDIO]
      }
    });

    let audioBase64 = "";
    let mimeType = "audio/wav";

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
      }
    }

    if (!audioBase64) throw new Error("No audio data generated");

    const binary = atob(audioBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Music generation error:", error);
    throw new Error("The celestial choir is currently silent. Please try another melody.");
  }
};

export const speakCosmicGuidance = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say mystically and calmly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binary = atob(base64Audio);
      const pcmData = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        pcmData[i] = binary.charCodeAt(i);
      }
      
      // Add WAV header (PCM, mono, 24000Hz, 16-bit)
      const wavHeader = new ArrayBuffer(44);
      const view = new DataView(wavHeader);
      
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + pcmData.length, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 1, true); // Mono
      view.setUint32(24, 24000, true); // Sample rate
      view.setUint32(28, 24000 * 2, true); // Byte rate
      view.setUint16(32, 2, true); // Block align
      view.setUint16(34, 16, true); // Bits per sample
      writeString(36, 'data');
      view.setUint32(40, pcmData.length, true);

      const blob = new Blob([wavHeader, pcmData], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error("TTS error:", error);
    throw error;
  }
};

export const getLiveSession = (callbacks: any) => {
  return ai.live.connect({
    model: "gemini-3.1-flash-live-preview",
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
      },
      systemInstruction: "You are the Again India Oracle. You provide deep astrological and spiritual guidance based on ancient Shastra and modern data.",
    },
  });
};
