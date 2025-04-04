require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const { beginnerTests } = require('./data/readingData');
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
console.log("bot ishga tushdi")
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text?.trim(); // Xabarni bo'sh emasligini tekshiramiz
  
    if (!messageText) return; // Agar xabar bo'sh bo'lsa, hech narsa qilmaydi
  
    if (messageText === "/start" || messageText === "/start@eng_quiz_tester_bot") {
      bot.sendMessage(chatId, "Assalomu alaykum! Siz ingliz tili darajangizni tekshirish uchun botga xush kelibsiz.", {
        reply_markup: {
          keyboard: [[{ text: "/checkwriting" }, { text: "/reading" },  { text: "/clear" }, { text: "/start" }]],
          resize_keyboard: true,
        },
      });
    } else if (["/checkwriting", "/reading", "/clear","/start"].includes(messageText)) {
      // Agar foydalanuvchi mavjud buyruqlardan birini bossa, hech narsa qilmaydi
      return;
    } 
  });
  

  bot.onText(/\/clear/, async (msg) => {
    const chatId = msg.chat.id;
  
    if (!userProgress[chatId]) {
      bot.sendMessage(chatId, "🧹 Tozalash uchun hech narsa yo‘q.");
      return;
    }
  
    try {
      // Oldingi xabarlarni o‘chirish
      if (userProgress[chatId].lastMessageId) {
        await bot.deleteMessage(chatId, userProgress[chatId].lastMessageId).catch(() => {});
      }
  
      if (userProgress[chatId].lastResultId) {
        await bot.deleteMessage(chatId, userProgress[chatId].lastResultId).catch(() => {});
      }
  
      // Foydalanuvchi tarixini o‘chirish
      delete userProgress[chatId];
  
      bot.sendMessage(chatId, "✅ Bot tarixi tozalandi!");
    } catch (error) {
      console.error("Xatolik:", error);
      bot.sendMessage(chatId, "❌ Xatolik yuz berdi!");
    }
  });
  
  
bot.onText(/\/checkwriting/, (msg) => {
  bot.sendMessage(msg.chat.id, "✍️ Iltimos, matningizni yuboring:", {
    reply_markup: { force_reply: true },
  });
});

bot.on("message", async (msg) => {
  if (msg.reply_to_message && msg.reply_to_message.text.includes("Iltimos, matningizni yuboring")) {
    const chatId = msg.chat.id;
    const text = msg.text;
    try {
      const response = await axios.post("http://localhost:5050/api/check-writing", { text });
      const feedback = response.data.feedback || "AI feedback not available.";
      const score = response.data.score !== null ? `Score: ${response.data.score}` : "Score not available.";
      bot.sendMessage(chatId, `✍️ Writing Feedback:\n${feedback}\n\n${score}`);
    } catch (error) {
      bot.sendMessage(chatId, "❌ Writing tekshirishda xatolik yuz berdi.");
    }
  }
});
let userProgress = {};

bot.onText(/\/reading/, async (msg) => {
  const chatId = msg.chat.id;
  userProgress[chatId] = { 
    currentQuestion: 0, 
    lastMessageId: null, 
    lastResultId: null, 
    correctCount: 0, 
    wrongCount: 0, 
    answered: {} 
  };

  let allPassages = beginnerTests.map(test => `📖 ${test.passage}`).join("\n\n");
  bot.sendMessage(chatId, allPassages).then(() => askQuestion(chatId));
});

const askQuestion = async (chatId) => {
  const progress = userProgress[chatId];
  if (!progress) return;

  const { currentQuestion, lastMessageId, lastResultId } = progress;
  if (currentQuestion < beginnerTests.length) {
    const test = beginnerTests[currentQuestion];

    progress.answered[currentQuestion] = false; 

    const messageText = `❓ ${test.question}`;
    const keyboard = {
      inline_keyboard: test.options.map((option, index) => [
        { 
          text: option, 
          callback_data: `${chatId}_${currentQuestion}_${index}` // Faqat indexni yuboramiz
        }
      ]),
    };

    if (lastResultId) {
      bot.deleteMessage(chatId, lastResultId).catch(() => {});
      progress.lastResultId = null;
    }

    if (lastMessageId) {
      bot.editMessageText(messageText, {
        chat_id: chatId,
        message_id: lastMessageId,
        reply_markup: keyboard,
      }).catch(() => {
        bot.sendMessage(chatId, messageText, { reply_markup: keyboard }).then((sentMessage) => {
          userProgress[chatId].lastMessageId = sentMessage.message_id;
        });
      });
    } else {
      bot.sendMessage(chatId, messageText, { reply_markup: keyboard }).then((sentMessage) => {
        userProgress[chatId].lastMessageId = sentMessage.message_id;
      });
    }
  } else {
    bot.sendMessage(chatId, `🎉 Test tugadi!\n✅ To‘g‘ri javoblar: ${progress.correctCount}\n❌ Noto‘g‘ri javoblar: ${progress.wrongCount}`);
    delete userProgress[chatId];
  }
};

bot.on("callback_query", async (query) => {
  const [chatId, questionIndex, answerIndex] = query.data.split("_").map(Number);
  const progress = userProgress[chatId];

  if (progress) {
    if (progress.answered[questionIndex]) {
      bot.answerCallbackQuery(query.id, { text: "⛔ Siz allaqachon ushbu savolga javob bergansiz!", show_alert: true });
      return;
    }

    progress.answered[questionIndex] = true; 

    const test = beginnerTests[questionIndex];
    const selectedAnswer = test.options[answerIndex];
    const correctAnswer = test.answer;
    const isCorrect = selectedAnswer === correctAnswer;
    const result = isCorrect ? "✅ To'g'ri javob!" : `❌ Noto'g'ri javob! To'g'ri javob: ${correctAnswer}`;

    bot.sendMessage(chatId, result).then((sentMessage) => {
      progress.lastResultId = sentMessage.message_id;

      if (isCorrect) {
        progress.correctCount++;
      } else {
        progress.wrongCount++;
      }

      progress.currentQuestion++;
      setTimeout(() => askQuestion(chatId), 100);
    });
  }
});
