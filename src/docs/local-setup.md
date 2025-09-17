# Running CardHub Locally with VS Code

This guide will walk you through setting up and running the CardHub application on your local machine using Visual Studio Code.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed (v18 or later is recommended).
- **npm**: npm is the package manager for Node.js and will be installed with it.
- **VS Code**: The recommended code editor for this project.
- **AI Provider API Keys**: To use the AI-powered features of the app, you will need an API key from at least one of the supported AI providers (e.g., Google AI).

## 1. Clone & Install Dependencies

First, clone the repository to your local machine and open the project folder in VS Code. Then, open the integrated terminal in VS Code (`Ctrl+`` or `Cmd+``) and install the necessary npm packages.

```bash
npm install
```

## 2. Set Up Environment Variables

The application requires API keys to power its generative features.

1.  **Create a `.env` file**: In the root of the project, you will find a file named `.env.example`. Create a copy of this file and rename it to `.env`.

2.  **Add your API Key(s)**: Open the newly created `.env` file. It will contain placeholder variables:
    ```
    # For Google AI (Gemini) features
    GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"

    # For OpenAI (ChatGPT) features (if/when integrated)
    OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
    ```
    Replace the placeholder values with the actual API keys you obtained from the respective AI providers. Currently, only the `GOOGLE_API_KEY` is used by the backend.

The `.env` file is included in `.gitignore`, so your secret API keys will not be committed to version control.

## 3. Run the Development Server

The application consists of two main parts: the Next.js frontend and the Genkit AI backend.

### Run the Next.js App

To run the main web application, use the following command:

```bash
npm run dev
```

This will start the Next.js development server, which uses Turbopack for fast performance. You can now access the application by navigating to **http://localhost:3000** in your web browser.

### Configure Keys in the Browser

To enable the AI features in the UI, you must also add your API keys in the application's settings:

1.  Navigate to the **Settings** page in the running application.
2.  Under **AI Model Configuration**, enter the same API keys you added to your `.env` file.
3.  Click "Save Keys to Browser".

This step is required because the browser-side code needs to know if an API key is present to enable the AI tool buttons.

### Run the Genkit Inspector (Optional)

Genkit includes a developer UI called the "Inspector" which allows you to view your AI flows, inspect their inputs and outputs, and even run them manually. This is very useful for debugging your AI logic.

To start the Genkit Inspector, open a **new, separate terminal** in VS Code and run:

```bash
npm run genkit:dev
```

This will start the inspector, which you can access at **http://localhost:4000**.

You should now have the full application running locally!
