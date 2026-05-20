## Personal Note

This was my first experience building a project like this completely from scratch.

I genuinely put a lot of effort into ChessFlow, and while it may not be perfect, I learned an incredible amount throughout the process. I truly enjoyed every part of building it.

I honestly do not know whether I will pass your incubator selection, and maybe my current technical skills are still behind some other candidates. But when it comes to motivation, discipline, and willingness to learn — I know I can compete with anyone.

This project helped me realize that software development is genuinely something I want to pursue seriously.

Thank you for giving me the opportunity and motivation to build something real.



# ChessFlow

Modern AI-powered chess platform built with Next.js, TypeScript, Firebase and Stockfish.

## Project Overview

### Play

The main part of the project is the Play section, where users can play chess against Stockfish AI in real time.

The board supports legal move validation, move history tracking, AI responses, and dynamic game states.

### AI Coach

After each move, the AI Coach analyzes the position and gives feedback about move quality using Stockfish evaluation.

The goal was to make the experience feel educational instead of simply playing against an engine.

### Authentication

Users can sign in with Google using Firebase Authentication.

This was my first experience working with authentication systems and OAuth flows in a real project.

### Premium

I also created a Premium page to simulate how a subscription-based chess platform could look and feel.

### Learn

The Learn section was created as a foundation for future educational content and chess tutorials.

### Puzzles

The Puzzles page is currently a work in progress and was added as part of the platform structure for future tactical training features.

### Analysis

The Analysis section is intended for deeper game review and position analysis features.

### Deployment

The entire project was deployed using Vercel, including Firebase environment variables and production configuration.

## Tech Stack

- Next.js 15

- TypeScript

- Tailwind CSS

- Firebase Authentication

- Stockfish

- react-chessboard

- chess.js

- Vercel

## Live Demo

[ChessFlow — AI Chess Studio](https://chessflow-ixuq8e9rs-nurikdoni149-bots-projects.vercel.app/)

## Installation

```bash

git clone [https://github.com/nurikdoni149-bot/chessflow.git](https://github.com/nurikdoni149-bot/chessflow.git)

cd chessflow

npm install

npm run dev

```

## Environment Variables

Create `.env.local`:

```env

NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NEXT_PUBLIC_FIREBASE_APP_ID=

```

## Deployment

Project deployed with Vercel.

## Author

Nurkhan Daniar