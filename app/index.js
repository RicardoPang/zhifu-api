const Koa = require("koa");
const app = new Koa();
const koaBody = require("koa-body");
const routing = require("./routes");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const mongoose = require("mongoose");
const { connectionStr } = require("./config");
const path = require("path");
const serve = require("koa-static");

mongoose.connect(
  connectionStr,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    console.log("MongoDB connection succeeded!");
  }
);
mongoose.connection.on("error", console.error);

app.use(serve(path.join(__dirname, "public")));
let options = {
  // Avoid showing the stacktrace in 'production' env
  postFormat: (e, { stack, ...rest }) =>
    process.env.NODE_ENV === "production" ? rest : { stack, ...rest },
};
app.use(error(options));
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "/public/uploads"),
      keepExtensions: true,
    },
  })
);
app.use(parameter(app));
routing(app);

app.listen(3000, () => console.log("app started at port 3000..."));
