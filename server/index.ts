// File: api/index.ts

import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import cors from 'cors';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';

import { registerRoutes } from './routes'; // Make sure the path to routes.ts is correct
import { DbStorage } from './db-storage'; // Make sure the path to db-storage.ts is correct

// --- INITIALIZE APP & STORAGE ---
const app = express();
const PgStore = connectPgSimple(session);
const storage = new DbStorage();

// --- SETUP MIDDLEWARE ---

// Initialize Nodemailer Transporter
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

// Verify SMTP connection on first run (will show in Vercel logs on cold start)
transporter.verify(function(error) {
    if (error) console.log('SMTP connection error:', error);
    else console.log('SMTP server is ready to send messages');
});

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Vercel acts as a proxy, so we need to trust the first hop
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL, // Set this Environment Variable in Vercel
    credentials: true
}));

// Session store configuration for NeonDB
const sessionPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { 
      rejectUnauthorized: false // Required for NeonDB
    },
});

app.use(session({
    store: new PgStore({ pool: sessionPool, tableName: 'user_sessions' }),
    secret: process.env.SESSION_SECRET || "a-very-strong-secret-that-is-long",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Cookies must be secure in production (HTTPS)
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// --- ONE-TIME ADMIN CREATION (IDEMPOTENT) ---
// This will run on a cold start and check if the admin exists.
// The `if` condition prevents it from running repeatedly.
storage.getUserByEmail('admin@fourkids.com').then(admin => {
    if (!admin) {
        console.log('Admin user not found, attempting to create...');
        storage.createUser({
            email: 'admin@fourkids.com',
            password: 'admin@123',
            name: 'Admin User',
            businessName: 'FourKids Admin',
            phoneNumber: '1234567890',
            address: 'Admin Address',
            role: 'admin'
        }).then(() => {
            console.log('Admin user created successfully.');
        }).catch(error => {
            console.error('Error during admin user creation:', error);
        });
    }
}).catch(error => {
    console.error('Error checking for admin user:', error);
});


// --- REGISTER ALL API ROUTES ---
registerRoutes(app, transporter);


// --- GLOBAL ERROR HANDLER ---
// This must be the last `app.use()`
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    console.error(err); // Log the actual error for debugging
    res.status(status).json({ message });
});


// --- EXPORT THE APP FOR VERCEL ---
// This is the single most important line. Vercel uses this
// default export to create the serverless function.
export default app;