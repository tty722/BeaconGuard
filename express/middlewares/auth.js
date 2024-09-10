// middlewares/auth.js
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const SALT_LENGTH = 16; // 盐的长度
const HASH_LENGTH = 64; // 哈希长度
const ITERATIONS = 10000; // 迭代次数
const SECRET_KEY = "llspotty"; // JWT 密钥

// 生成盐
function generateSalt(length = SALT_LENGTH) {
  return crypto.randomBytes(length).toString("hex");
}

// 使用PBKDF2算法加密密码
function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, HASH_LENGTH, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
}

// 生成JWT
function generateToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      gender: user.gender,
      birthday: user.birthday,
      personalityTag: user.personalityTag,
      phone: user.phone,
    },
    SECRET_KEY,
    {
      expiresIn: 60 * 60 * 24 * 7, // 单位是秒
    }
  );
}

// 验证JWT
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

async function verifyTokenMiddleware(req, res, next) {
  const token = req.headers.token;
  console.log(token);
  
  if (!token) {
    return res.status(401).json({
      code: 401,
      message: "Token not provided",
    });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded; // 将解码后的用户信息存储在请求对象中
    
    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      message: "Invalid token",
    });
  }
}

module.exports = {
  generateSalt,
  hashPassword,
  generateToken,
  verifyTokenMiddleware
};
