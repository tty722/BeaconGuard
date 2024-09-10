const mongoose = require("mongoose");

let AlphaIDSSchema = new mongoose.Schema({
    sessionName: {
        type: String,
        required: true,
    },
    messages: [{
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        sender: {
            type: String,
            required: true,
            enum: ['user', 'agent']
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now, // 聊天创建时间
    },
    updatedAt: {
        type: Date,
        default: Date.now, // 聊天更新时间
    },
})

let AlphaIDS = mongoose.model('AlphaIDS', AlphaIDSSchema);

module.exports = AlphaIDS;