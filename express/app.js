var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

//todo 导入注册路由文件
const authRouter = require("./routes/auth.js");
const circleRouter = require("./routes/offline/Overview/Flow/chart.js");
const offlineRestoreRouter = require("./routes/restore/restore.js");
const offlineRouter = require("./routes/offline/offline.js");
const dnsRouter = require("./routes/restore/dns.js");
const httpRouter = require("./routes/restore/http.js");
const icmpRouter = require("./routes/restore/icmp.js");
const ftpRouter = require("./routes/restore/ftp.js");
const onlineRouter = require("./routes/online/online.js");
const agentRouter=require("./routes/agent/agent.js")
const alertRouter=require("./routes/offline/alert/alert.js")
const reportRouter=require("./routes/offline/report/report.js")

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);
app.use("/", circleRouter);
app.use("/", offlineRestoreRouter);
app.use("/", offlineRouter);
app.use("/", dnsRouter);
app.use("/", httpRouter);
app.use("/", icmpRouter);
app.use("/", ftpRouter);
app.use("/", onlineRouter);
app.use("/", agentRouter);
app.use("/", alertRouter);
app.use("/", reportRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
