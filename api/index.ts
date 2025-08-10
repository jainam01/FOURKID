import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import nodemailer from "nodemailer";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "https://fourkids.vercel.app",
    credentials: true,
  }),
);

const PgStore = connectPgSimple(session);
const sessionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

app.use(
  session({
    store: new PgStore({ pool: sessionPool, tableName: "user_sessions" }),
    secret: process.env.SESSION_SECRET || "a-very-strong-secret-in-development",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

registerRoutes(app, transporter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

export default app;


