# Running CardHub Locally with VS Code

This guide will walk you through setting up and running the CardHub application on your local machine using Visual Studio Code.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed (v18 or later is recommended).
- **npm**: npm is the package manager for Node.js and will be installed with it.
- **VS Code**: The recommended code editor for this project.
- **Google AI API Key**: To use the AI-powered features of the app, you will need an API key from Google AI Studio. You can get one for free [here](https://aistudio.google.com/app/apikey).

## 1. Clone & Install Dependencies

First, clone the repository to your local machine and open the project folder in VS Code. Then, open the integrated terminal in VS Code (`Ctrl+` or `` ` `` ``) and install the necessary npm packages.

```bash
npm install
```

## 2. Set Up Environment Variables

The application requires a Google AI API key to power its generative features.

1.  **Create a `.env` file**: In the root of the project, you will find a file named `.env.example`. Create a copy of this file and rename it to `.env`.

2.  **Add your API Key**: Open the newly created `.env` file. It will have a single line:
    ```
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```
    Replace `YOUR_API_KEY_HERE` with the actual API key you obtained from Google AI Studio.

The `.env` file is included in `.gitignore`, so your secret API key will not be committed to version control.

## 3. Run the Development Server

The application consists of two main parts: the Next.js frontend and the Genkit AI backend.

### Run the Next.js App

To run the main web application, use the following command:

```bash
npm run dev
```

This will start the Next.js development server, which uses Turbopack for fast performance. You can now access the application by navigating to **http://localhost:3000** in your web browser.

### Run the Genkit Inspector (Optional)

Genkit includes a developer UI called the "Inspector" which allows you to view your AI flows, inspect their inputs and outputs, and even run them manually. This is very useful for debugging your AI logic.

To start the Genkit Inspector, open a **new, separate terminal** in VS Code and run:

```bash
npm run genkit:dev
```

This will start the inspector, which you can access at **http://localhost:4000**.

You should now have the full application running locally!
