# LegalHelp AI - India's First Comprehensive AI-Powered Legal Assistant

## Overview
LegalHelp AI is a production-ready legal assistant platform that provides accurate Indian legal information through an advanced multilingual chatbot (11 Indian languages), comprehensive law search engine, and a database of 30 essential legal rights. Built with Next.js, Express, and OpenAI GPT-5.

## Key Features
- **AI Legal Chatbot**: Multilingual chatbot (English, Hindi, Tamil, Telugu, Bengali, Marathi, Kannada, Gujarati, Odia, Malayalam, Punjabi) with structured responses including At-a-Glance Summary, Detailed Analysis, and Recommended Steps
- **Law Search Engine**: Real-time search through Indian Constitution, IPC, CrPC sections with AI-powered accurate results
- **30 Legal Rights Database**: Comprehensive collection of Indian legal rights with search and filter capabilities
- **Legal Guidance Hub**: 6 categories covering family law, criminal law, property rights, consumer rights, labor rights, and civil rights

## Technology Stack
- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI, Wouter
- **Backend**: Express.js, Node.js
- **AI**: OpenAI GPT-5 API
- **Design**: 3D animated gradient mesh backgrounds, professional card layouts with multi-layered shadows
- **Font**: Inter font family

## Project Structure
- `client/src/pages/HomePage.tsx` - Main landing page with all sections
- `client/src/components/ChatBot.tsx` - AI chatbot with multilingual support
- `client/src/components/LawSearch.tsx` - Legal search engine with AI integration
- `client/src/components/RightsModal.tsx` - 30 legal rights modal with search/filter
- `server/openai.ts` - OpenAI integration for legal search and chatbot
- `server/routes.ts` - API routes for /api/law-search and /api/legal-chat

## Environment Variables (Required for Deployment)
- `OPENAI_API_KEY` - OpenAI API key (get from https://platform.openai.com/api-keys)
- `SESSION_SECRET` - Session secret for Express sessions (auto-configured in Replit)

## Deployment to Vercel
1. Push code to GitHub repository
2. Connect GitHub repo to Vercel
3. Add environment variable `OPENAI_API_KEY` in Vercel project settings
4. Deploy

The application will automatically work once the OPENAI_API_KEY is provided during Vercel deployment.

## Design System
- **Colors**: Blue/Purple/Pink gradient theme
- **Background**: 3D animated gradient mesh with floating orbs
- **Cards**: Professional card layouts with multi-layered shadows and hover effects
- **Typography**: Inter font with responsive sizing
- **Dark Mode**: Full dark mode support

## Recent Changes (October 8, 2025)
- ✅ Fixed RightsModal close button issue
- ✅ Fixed ChatBot opening from "Start Free Chat" button
- ✅ Connected "Explore More" buttons to law search with auto-focus
- ✅ Removed all mock data from law search and chatbot
- ✅ Implemented real OpenAI GPT-5 integration for accurate Indian legal information
- ✅ Added proper error handling for API failures
- ✅ Verified Vercel deployment compatibility with environment variables

## User Preferences
- Must provide accurate Indian legal data only - no fake or misleading information
- Law search verifies against real Indian legal provisions (Constitution articles, IPC/CrPC sections)
- Chatbot provides structured responses with specific sections/articles/penalties
- No case law results shown in law search per user request
- Clear "no results found" messages when appropriate
