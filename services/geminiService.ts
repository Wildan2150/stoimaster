import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API Key for Gemini is missing. Please set process.env.API_KEY");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const getAIResponse = async (history: {role: string, parts: {text: string}[]}[], userMessage: string): Promise<string> => {
  try {
    const model = ai.models;
    
    const contents = history.map(h => ({
      role: h.role,
      parts: h.parts
    }));

    // Add the new user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: `Anda adalah "Profesor Stoi", asisten AI yang ahli, ramah, dan sabar untuk mengajar Kimia kelas 10 SMA, khususnya materi Stoikiometri.
        
        Panduan gaya:
        1. Jelaskan konsep dengan bahasa sederhana yang mudah dimengerti remaja.
        2. Gunakan analogi sehari-hari.
        3. Jika siswa bertanya soal hitungan, bimbing langkah demi langkah.
        4. **PENTING: FORMAT TEXT**:
           - Gunakan format **Markdown** untuk struktur teks (Bold, Italic, List, Headers).
           - Gunakan **LaTeX** untuk SEMUA rumus kimia dan matematika.
           - Format Inline: Gunakan $...$ (Contoh: $H_2O$, $CO_2$, $n = m/Mr$).
           - Format Block: Gunakan $$...$$ untuk persamaan reaksi utama atau rumus matematika yang berdiri sendiri.
        `,
      }
    });

    return response.text || "Maaf, saya sedang mengalami gangguan koneksi. Coba lagi ya!";

  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Maaf, terjadi kesalahan saat menghubungi server AI. Pastikan koneksi internet Anda lancar.";
  }
};

export const getContextualExplanation = async (contextText: string, userQuery: string): Promise<string> => {
  try {
    const model = ai.models;
    
    const prompt = `
    Konteks Materi Kimia:
    "${contextText}"

    Pertanyaan Siswa tentang konteks di atas:
    "${userQuery}"

    Instruksi untuk Profesor Stoi:
    Jawablah pertanyaan siswa secara spesifik berdasarkan konteks yang diberikan. Jelaskan dengan singkat, padat, dan jelas.
    
    ATURAN FORMATTING (WAJIB):
    1. Gunakan Markdown untuk struktur (Bold, List, Headers).
    2. Gunakan LaTeX ($...$) untuk rumus kimia/matematika inline.
    3. Gunakan LaTeX ($$...$$) untuk persamaan reaksi blok.
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Maaf, saya tidak bisa menjelaskan bagian ini sekarang.";
  } catch (error) {
    console.error("Error contextual explanation:", error);
    return "Gagal menghubungi Profesor Stoi.";
  }
};

export const generateQuizQuestions = async (topic: string, count: number = 5): Promise<Question[]> => {
  try {
    const model = ai.models;
    
    const prompt = `Buatkan ${count} soal pilihan ganda kimia kelas 10 SMA tentang topik "${topic}". 
    
    Instruksi Khusus:
    1. Soal harus memiliki **5 pilihan jawaban** (A, B, C, D, E).
    2. **SANGAT PENTING**: Semua rumus kimia, persamaan reaksi, dan angka ilmiah dalam Pertanyaan, Pilihan, dan Pembahasan HARUS ditulis dalam format LaTeX yang diapit tanda dollar ($).
       - Contoh Benar: "Berapa massa dari $H_2SO_4$?"
       - Contoh Benar: "Reaksi $2H_2 + O_2 \\rightarrow 2H_2O$"
       - Contoh Salah: "Berapa massa dari H2SO4?"
    3. Soal harus variatif, mencakup konsep dan hitungan sederhana jika relevan.
    4. Bahasa Indonesia.`;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER, description: "Unique ID for the question, use random number" },
              question: { type: Type.STRING, description: "The question text with LaTeX formulas" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of 5 options with LaTeX formulas where needed"
              },
              correctAnswer: { type: Type.NUMBER, description: "Index of the correct answer (0-4)" },
              explanation: { type: Type.STRING, description: "Detailed explanation with LaTeX formulas" },
              topic: { type: Type.STRING, description: "The specific topic name" }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation", "topic"]
          }
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No data returned");
    
    const questions = JSON.parse(jsonStr) as Question[];
    return questions;

  } catch (error) {
    console.error("Error generating quiz:", error);
    // Return empty array or throw, handled by component
    return [];
  }
};

export const explainMistake = async (question: string, userAnswer: string, correctAnswer: string, topic: string): Promise<string> => {
  try {
    const model = ai.models;
    
    const prompt = `Seorang siswa kelas 10 SMA salah menjawab soal kimia berikut.
    Topik: ${topic}
    Soal: ${question}
    Jawaban Siswa (SALAH): ${userAnswer}
    Jawaban Benar: ${correctAnswer}

    Tugas Anda sebagai Profesor Stoi (Diagnostic Mode):
    1. **Diagnosis Kesalahan**: Analisis kemungkinan penyebab kesalahan siswa.
    2. **Koreksi Lembut**: Beritahu letak kesalahannya tanpa menghakimi.
    3. **Penjelasan Singkat**: Berikan alur logika yang benar.
    4. **FORMAT**: Gunakan Markdown dan LaTeX ($...$) untuk rumus.
    5. Jaga panjang respon maksimal 3 paragraf pendek.`;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Maaf, saya tidak bisa menganalisis kesalahan ini saat ini.";
  } catch (error) {
    console.error("Error explaining mistake:", error);
    return "Terjadi kesalahan saat menghubungi Profesor Stoi.";
  }
};

export const generateRemedialLesson = async (topic: string, specificQuestion: string, userMistakeAnalysis: string): Promise<string> => {
  try {
    const model = ai.models;

    const prompt = `Siswa masih belum paham konsep "${topic}" setelah gagal menjawab soal: "${specificQuestion}".
    
    Analisis kesalahan sebelumnya: ${userMistakeAnalysis}

    Tugas Anda: Lakukan **Scaffolding (Perancah Pembelajaran)**.
    Buatkan "Modul Mikro Remedial" yang sangat sederhana.
    
    Struktur Konten (Gunakan Markdown):
    1. **Analogi Dunia Nyata**: Jelaskan konsep ini menggunakan analogi sehari-hari.
    2. **Jembatan Konsep**: Hubungkan analogi tadi dengan konsep kimia sebenarnya.
    3. **Langkah Demi Langkah (Baby Steps)**: Pecah cara mengerjakan soal tipe ini menjadi 3 langkah super sederhana.
    4. **Tips Mengingat**: Berikan "Jembatan Keledai" (Mnemonic) atau tips cepat.
    
    Gaya bahasa: Sangat suportif, santai. Gunakan LaTeX ($...$) untuk rumus.`;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Gagal memuat materi remedial.";

  } catch (error) {
    console.error("Error generating remedial:", error);
    return "Maaf, Profesor Stoi sedang sibuk menyusun materi.";
  }
};