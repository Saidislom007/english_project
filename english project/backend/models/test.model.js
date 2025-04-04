const { Schema, model } = require('mongoose');


// Test Schema (Reading va Listening)
const TestSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['reading', 'listening'], // Test turlari: reading yoki listening
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        questions: [
            {
                question: String,
                options: [String], // Savolning javob variantlari
                correctAnswer: String, // To'g'ri javob
            },
        ],
    },
    { timestamps: true }
);







const Test = model('Test', TestSchema);
module.exports = Test