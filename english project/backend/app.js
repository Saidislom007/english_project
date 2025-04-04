require('dotenv').config();
const express = require('express');
const postRouter = require('./routes/post.route');
const mongoose = require('mongoose');
const cors = require('cors');
const AuthRouter = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error.middleware');
const axios = require("axios");
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data'); // ✅ FormData qo‘shildi
const adminRouter = require('./routes/admin.route');
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://192.168.1.45:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS bloklandi"));
      }
    },
    credentials: true
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/post', postRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/admin', adminRouter); 


const upload = multer({ dest: 'uploads/' });

// OpenAI API konfiguratsiyasi (Whisper uchun)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

// Ovoz yuklash va analiz qilish
app.post('/api/speaking-mock', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }

        console.log("✅ Yuklangan fayl:", req.file.path); // ✅ Fayl yo‘lini tekshirish

        // Whisper orqali ovozni matnga o‘girish
        const transcript = await transcribeAudio(req.file.path);
        if (!transcript) {
            return res.status(500).json({ error: 'Failed to transcribe audio' });
        }

        console.log("✅ Ovozdan olingan matn:", transcript); // ✅ Matnni tekshirish

        // Natijani qaytarish
        res.json({ transcript });
    } catch (error) {
        console.error("❌ Xatolik:", error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        fs.unlink(req.file.path, (err) => { // ✅ Faylni o‘chirish
            if (err) console.error("❌ Faylni o‘chirishda xatolik:", err);
        });
    }
});

// Whisper modeliga audio jo‘natish
async function transcribeAudio(audioPath) {
    const audioData = fs.createReadStream(audioPath);
    const formData = new FormData();
    formData.append('file', audioData);
    formData.append('model', 'whisper-1');

    try {
        const response = await axios.post(OPENAI_API_URL, formData, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                ...formData.getHeaders()
            }
        });

        console.log("✅ Whisper API dan kelgan javob:", response.data); // ✅ Javobni tekshiramiz

        if (!response.data || !response.data.text) {
            throw new Error("❌ Whisper API noto‘g‘ri javob qaytardi!");
        }

        return response.data.text;
    } catch (error) {
        console.error("❌ Whisper Error:", error.response?.data || error.message);
        return null;
    }
}

app.post("/api/check-writing", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "No text provided" });

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: `You are an IELTS writing examiner. Evaluate the provided IELTS Writing task based on:
            - Task Achievement
            - Coherence and Cohesion
            - Lexical Resource
            - Grammatical Range and Accuracy.
            
            Return the response in this exact format:
            
            Feedback: [Your detailed feedback here]
            Score: [X.X]`
          },
          { role: "user", content: text }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    console.log("✅ AI'dan kelgan javob:", response.data);

    const feedback = response.data.choices?.[0]?.message?.content || "AI feedback not available.";
    const scoreMatch = feedback.match(/Score:\s*([\d.]+)/i);
    let score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

    if (score !== null && (score < 1 || score > 9)) {
      score = null; 
    }

    res.json({ feedback, score });

  } catch (error) {
    console.error("❌ Backend Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5050;

const bootstrap = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to DB');

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server listening on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error connecting with:", error);
  }
};

bootstrap();
