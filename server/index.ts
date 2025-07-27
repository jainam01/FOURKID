// File: server/src/index.ts

import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import session from "express-session";
import passport from "passport";
import cors from 'cors';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import nodemailer from 'nodemailer'; // <-- Import nodemailer here
import path from 'path';

import { registerRoutes } from './routes';
import { DbStorage } from './db-storage';
import { setupVite, serveStatic, log } from "./vite"; // Assuming you have this file

const app = express();
const PgStore = connectPgSimple(session);
const storage = new DbStorage();

async function startServer() {

    // --- DEFINE TRANSPORTER HERE ---
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    transporter.verify(function(error) {
        if (error) console.log('SMTP connection error:', error);
        else console.log('SMTP server is ready to send messages');
    });

    // --- MIDDLEWARE SETUP ---
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }));

    const sessionPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    });

    app.use(session({
        store: new PgStore({ pool: sessionPool, tableName: 'user_sessions' }),
        secret: process.env.SESSION_SECRET || "a-very-strong-secret-in-development",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        const start = Date.now();
        res.on("finish", () => {
            if (req.path.startsWith("/api")) {
                log(`${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`);
            }
        });
        next();
    });

    // --- ADMIN CREATION ---
    try {
        if (!await storage.getUserByEmail('admin@fourkids.com')) {
            await storage.createUser({
                email: 'admin@fourkids.com',
                password: 'admin@123',
                name: 'Admin User',
                businessName: 'FourKids Admin',
                phoneNumber: '1234567890',
                address: 'Admin Address',
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        }
    } catch (error) {
        console.error('Error during admin user creation:', error);
    }
    
    // --- REGISTER ROUTES ---
    // Pass the transporter into the function
    registerRoutes(app, transporter);
    
    const httpServer = createServer(app);

    // --- VITE/STATIC & ERROR HANDLING ---
    if (app.get("env") === "development") {
        await setupVite(app, httpServer);
    } else {
        serveStatic(app);
        app.get('*', (req, res, next) => {
            // If the request is for an API route, let the 404 handler catch it
            if (req.originalUrl.startsWith('/api/')) {
                return next();
            }
            // For all other routes, serve the main HTML file and let the client-side router take over.
            res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'dist', 'index.html'));
        });
    }

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        console.error(err);
    });

    // --- START SERVER ---
    const port = 3000;
    httpServer.listen({ port, host: "0.0.0.0" }, () => {
        log(`Server is listening on port ${port}`);
    });
}

startServer();