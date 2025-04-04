const { Schema, model } = require('mongoose');



// User Schema
const UserSchema = new Schema(
    {
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        fullname: { 
            type: String, 
            required: true, 
            unique: true 
        },
        isActivated: { 
            type: Boolean, 
            default: false 
        },
        skills: {
            reading: { 
                type: Number,  
                default: 0 
            },  // 0 dan 10 gacha
            listening: { 
                type: Number, 
                default: 0 
            },
            writing: { 
                type: Number,  
                default: 0 
            },
            speaking: { 
                type: Number,  
                default: 0 
            }
        }
    },
    { timestamps: true }
);

// Modelni yaratish

const User = model('User', UserSchema);

module.exports = User
