import express from "express";
import cors from "cors";
// import locationRoute from "./routes/allRoutes.js";
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const PORT = process.env.PORT || 3000;

// app.use(
//   "/api",
//   createProxyMiddleware({
//     target: "http://127.0.0.1:5000",
//     changeOrigin: true,
//   })
// );

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Dummy route to check if token is getting saved in the browser
// app.get("/dummy", (req, res) => {
//   console.log(process.env.JWT_SECRET);
//   const token = jwt.sign({ userId: "dummyUserId" }, process.env.JWT_SECRET, {
//     expiresIn: "15d",
//   });

//   res.cookie("aditya", token, {
//     expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Set to true in production with HTTPS
//   });

//   res.json({ message: "Token saved successfully!" });
// });

// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return next(new ErrorHandler("Please enter all fields", 400));

//   const user = await User.findOne({ email }).select("+password");

//   if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

//   const isMatch = await user.comparePassword(password);

//   if (!isMatch)
//     return next(new ErrorHandler("Incorrect Email or Password", 401));

//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "15d",
//   });
//   console.log(token);
//   // Save the token as a cookie
//   res.cookie("aditya", token, {
//     expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
//     httpOnly: true, // Set to true in production with HTTPS
//   });
//   res.json({ message: "Login successful", token });
// });

// app.use("/api", locationRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port 3000`);
});
