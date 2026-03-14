# Form 2603 - Customer Survey Application

A full-stack application with Vue 3 frontend and Node.js backend for collecting customer survey responses.

## Project Structure

- `client/` - Vue 3 frontend application
- `server/` - Node.js Express backend API

## Features

- Customer survey form with name, email, and feedback fields
- Form submission saves data to a text file on the server
- CORS enabled for frontend-backend communication

## Setup

1. Install dependencies for both client and server:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. Start the backend server:
   ```bash
   cd server && npm start
   ```
   Server runs on http://localhost:3000

3. Start the frontend development server:
   ```bash
   cd client && npm run dev
   ```
   Client runs on http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Fill out the survey form
3. Click Submit to save the response
4. Responses are saved to `server/submissions.txt`

## API

### POST /submit

Submits survey data.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "feedback": "string"
}
```

**Response:**
- 200: "Submission saved"
- 500: "Error saving submission"

## Requirements

- Node.js >= 22
- npm

## Troubleshooting

- Ensure both server and client are running
- Check that ports 3000 and 5173 are available
- Verify CORS settings if requests are blocked