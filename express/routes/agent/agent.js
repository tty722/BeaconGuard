const express = require('express')
const router = express.Router()
const axios = require('axios');
const UserModel = require("../../database/models/Users");
const AlphaIDS = require("../../database/models/AlphaIDS");
const {
    verifyTokenMiddleware
} = require('../../middlewares/auth')

// todo 加载所有聊天会话
router.get('/api/alpha/allSession', verifyTokenMiddleware, async (req, res) => {
    try {
        const decoded = req.user;
        // console.log(decoded);


        // 在数据库中查找用户
        const user = await UserModel.findById(decoded._id).populate('messageId');
        if (!user) {
            return res.status(201).json({
                code: 10009,
                message: "用户不存在",
            });
        }
        // 获取所有会话名和会话ID
        const sessions = user.messageId.map(message => ({
            sessionId: message._id,
            sessionName: message.sessionName,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        }));

        // 用户存在，返回用户信息
        return res.status(200).json({
            code: 200,
            data: {
                sessions,
            },
        });


    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                code: 401,
                message: "无效的 token",
            });
        }
        return res.status(500).json({
            code: 10007,
            message: "数据库响应失败",
        });
    }
})

// todo 新建会话
router.post('/api/alpha/addSession', verifyTokenMiddleware, async (req, res) => {

    const decoded = req.user;
    const {
        content
    } = req.body;
    console.log(content);

    try {

        const newSession = new AlphaIDS({
            sessionName: content,
            messages: [{
                content: content,
                timestamp: new Date(),
                sender: 'user'
            }],
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const savedSession = await newSession.save();

        // 将新会话的 ID 添加到用户的 messageId 数组中
        const user = await UserModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({
                code: 10009,
                message: "用户不存在",
            });
        }
        user.messageId.push(savedSession._id);
        await user.save();
        const requestBody = {
            instruction: content
        };

        // todo 信息接口----待完成
        const responseMessage = await axios.post('http://127.0.0.1:5000/alphaIDS', requestBody);


        console.log(responseMessage.data.response);

        const answer = {
            content: responseMessage.data.response, //模拟回复
            timestamp: new Date(),
            sender: 'agent'
        }

        //在会话中插入回答
        savedSession.messages.push(answer)

        // 手动更新 updatedAt 字段
        savedSession.updatedAt = new Date();

        await savedSession.save();

        // 返回新会话的 ID
        return res.status(200).json({
            code: 200,
            data: {
                sessionId: savedSession._id,
                response: answer
            },
        });

    } catch (error) {
        return res.status(500).json({
            code: 10007,
            message: "数据库响应失败",
            error: error.message,
        });
    }
})

// todo 删除会话
router.delete('/api/alpha/deleteSession/:sessionId', verifyTokenMiddleware, async (req, res) => {
    const decoded = req.user;
    const {
        sessionId
    } = req.params;

    try {
        // 在数据库中查找用户
        const user = await UserModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({
                code: 10009,
                message: "用户不存在",
            });
        }

        // 从用户的 messageId 数组中删除会话ID
        user.messageId.pull(sessionId);
        await user.save();

        // 删除会话
        await AlphaIDS.findByIdAndDelete(sessionId);

        // 返回成功消息
        return res.status(200).json({
            code: 200,
            message: "会话删除成功",
        });

    } catch (error) {
        return res.status(500).json({
            code: 10007,
            message: "数据库响应失败",
            error: error.message,
        });
    }
});

// todo 回复信息
router.post('/api/alpha/agentAnswer/:sessionId', verifyTokenMiddleware, async (req, res) => {

    const {
        content
    } = req.body;
    const {
        sessionId
    } = req.params;
    console.log(content);

    try {

        const question = {
            content: content,
            timestamp: new Date(),
            sender: 'user'
        }

        // 在数据库中查找会话
        const session = await AlphaIDS.findById(sessionId);
        if (!session) {
            return res.status(404).json({
                code: 10020,
                message: "会话不存在",
            });
        }

        //在会话中插入问题
        session.messages.push(question)

        await session.save()
        const requestBody = {
            instruction: content
        };

        // todo 信息接口----待完成
        const response = await axios.post('http://127.0.0.1:5000/alphaIDS', requestBody);


        console.log(response.data.response);

        const answer = {
            content: response.data.response, //模拟回复
            timestamp: new Date(),
            sender: 'agent'
        }
        //在会话中插入回答
        session.messages.push(answer)

        // 手动更新 updatedAt 字段
        session.updatedAt = new Date();

        await session.save();

        res.status(200).json({
            code: 200,
            data: answer

        })


    } catch (error) {
        return res.status(500).json({
            code: 10007,
            message: "数据库响应失败",
            error: error.message,
        });
    }
})

// todo 获得会话的所有信息
router.get('/api/alpha/getAllMessage/:sessionId', verifyTokenMiddleware, async (req, res) => {
    const {
        sessionId
    } = req.params;
    try {

        const session = await AlphaIDS.findById(sessionId);
        if (!session) {
            return res.status(400).json({
                code: 10022,
                message: "会话不存在",
            });
        }

        return res.status(200).json({
            code: 200,
            data: session
        });
    } catch (error) {
        return res.status(500).json({
            code: 10021,
            message: "获取会话信息失败",
            error: error.message,
        });
    }
})

module.exports = router;