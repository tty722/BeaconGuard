var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

//导入用户的模型
const UserModel = require("../database/models/Users");
const {
  generateSalt,
  hashPassword,
  generateToken,
  verifyTokenMiddleware,
} = require("../middlewares/auth.js");

// 添加首页
router.get("/", (req, res) => {
  res.send();
});

//todo 注册响应接口
router.post("/api/user/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 检查用户名是否已存在
    let data = await UserModel.findOne({ username: username });
    if (data) {
      return res.status(201).json({
        code: 10002,
        message: "用户名已注册",
      });
    }

    // 检查邮箱是否已存在
    data = await UserModel.findOne({ email: email });
    if (data) {
      return res.status(201).json({
        code: 10003,
        message: "邮箱已注册",
      });
    }

    // 生成盐
    const salt = generateSalt();
    // 使用盐和PBKDF2算法加密密码
    const hashedPassword = await hashPassword(password, salt);

    // 创建新用户
    const newUser = await UserModel.create({
      username: username,
      password: hashedPassword, // 使用加密之后的密码
      salt: salt, // 存储盐值1
      email: email,
      phone: -1,
      birthday: "",
      gender: "male",
      personalityTag: "",
    });

    // 创建新用户并生成JWT
    let token = generateToken(newUser);

    res.status(200).json({
      code: 200,
      message: "注册成功",
      data: {
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({
      code: 10007,
      message: "数据库错误",
    });
  }
});

//todo 获取信息接口
router.get("/api/user/info", verifyTokenMiddleware, async (req, res) => {
  try {
    const decoded = req.user;

    // 在数据库中查找用户
    const user = await UserModel.findOne({ username: decoded.username });
    if (!user) {
      return res.status(201).json({
        code: 10009,
        message: "用户不存在",
      });
    }

    // 用户存在，返回用户信息
    const { _id, username, email, phone, birthday, gender, personalityTag } =
      user.toObject(); // 使用解构赋值排除密码
    return res.status(200).json({
      code: 200,
      data: {
        checkUser: {
          _id,
          username,
          email,
          phone,
          birthday,
          gender,
          personalityTag,
        },
      }, // 返回用户信息
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
});

//todo 修改信息接口
router.post(
  "/api/user/info/change",
  verifyTokenMiddleware,
  async (req, res) => {
    try {
      const decoded = req.user;
      const _id = decoded._id;

      // 检查用户名和电话号码是否唯一（排除当前用户）
      const existingUser = await UserModel.findOne({
        $and: [
          { _id: { $ne: new ObjectId(_id) } }, // 确保不是当前用户
          {
            $or: [{ username: req.body.username }, { phone: req.body.phone }],
          },
        ],
      });

      if (existingUser) {
        // 如果找到具有相同用户名或电话号码的用户，则返回错误
        return res.status(409).json({
          code: 10010,
          message: "用户名或电话号码已存在",
        });
      }

      // 更新用户信息
      const updateResult = await UserModel.updateOne(
        { _id: _id }, // 使用 _id 或其他唯一标识符
        {
          $set: {
            username: req.body.username,
            gender: req.body.gender,
            phone: req.body.phone,
            personalityTag: req.body.personalityTag,
            birthday: req.body.birthday,
          },
        }
      );

      if (updateResult.modifiedCount > 0) {
        return res.status(200).json({
          code: 200,
          message: "用户信息更新成功",
        });
      } else {
        // 如果没有文档被修改，可能是因为请求体中的字段与现有字段相同
        return res.status(200).json({
          code: 200,
          message: "用户信息未发生变化",
        });
      }
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        // 假设 jwt.verify 抛出 JsonWebTokenError 错误
        return res.status(401).json({
          code: 401,
          message: "无效的 token",
        });
      }
      // 其他错误处理
      console.error("Error updating user info:", err);
      return res.status(500).json({
        code: 10007,
        message: "数据库响应错误",
      });
    }
  }
);

//todo 用户退出登录接口
router.post("/api/user/logout", (req, res) => {
  return res.status(200).json({
    code: 200,
    message: "退出登录成功",
  });
});

//todo 用户登录接口
router.post("/api/user/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(201).json({
        code: 10004,
        message: "用户名不正确",
      });
    }

    // 验证密码
    const hashedPassword = await hashPassword(password, user.salt);
    if (hashedPassword !== user.password) {
      return res.status(201).json({
        code: 10004,
        message: "密码不正确",
      });
    }

    // 生成JWT
    let token = generateToken(user);

    return res.status(200).json({
      code: 200,
      data: {
        token: token,
      },
    });
  } catch (err) {
    return res.status(201).json({
      code: 10007,
      message: "数据库响应错误",
    });
  }
});

module.exports = router;
