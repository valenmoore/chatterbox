import { GoogleGenerativeAI } from "@google/generative-ai";

const key = import.meta.env.VITE_GEMINI_KEY
const genAI = new GoogleGenerativeAI(key);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;