# CardHub: AI-Powered Business Card Designer

CardHub is a modern, full-stack web application that allows users to design, customize, and manage business cards with the help of powerful AI tools. It's built with a modern tech stack and provides a seamless, interactive design experience.

## Key Features

### 1. AI-Powered Design Studio
- **Generate from Prompt**: Describe the card you want, and the AI will generate a complete design plan, including colors, fonts, and a style description.
- **Brand-Aware Generation**: Provide a company website URL, and the AI will analyze it to incorporate brand colors and identity into the design.
- **Import from Image**: Upload an image of an existing business card, and the AI will analyze it to recreate a similar, editable design within the app.
- **AI Design Suggestions**: Get contextual and creative design prompts based on the selected card category to kickstart your creative process.
- **AI-Styled QR Codes**: Generate QR codes for your website that are not only functional but also artistically styled based on a design prompt.

### 2. Comprehensive Design Editor
- **Real-Time Preview**: See your changes instantly on a flippable, 3D-aware card preview.
- **Customization**: Fine-tune every aspect of your card, including layouts, colors, fonts, background patterns, and background images.
- **Content Management**: Easily edit your name, title, company, and upload a profile picture or company logo.
- **QR Code Integration**: Automatically generates a QR code when you add a website URL.

### 3. Card & Template Management
- **Dashboard**: A central hub to see your recent designs and get started quickly with templates.
- **My Cards**: A personal library where all your saved designs are stored. You can edit, duplicate, share, or delete them.
- **Template Library**: Browse a rich library of pre-built card templates across various categories like Business, Creative, Medical, and 3D.

### 4. B2B & Print Shop Workflow
- **Submission Queue**: A dedicated "Submitted Designs" page simulates a workflow for print shops to review and manage design submissions from customers, including filtering and status updates.

### 5. Personalization
- **Customizable UI Themes**: Choose from multiple built-in color themes to personalize the application's look and feel.
- **Account Management**: A dedicated page to manage your user profile details, including your name, email, and profile picture.

## Tech Stack

This application is built using a modern, type-safe, and performant technology stack.

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (Google's Generative AI toolkit) powered by the [Google AI (Gemini)](https://ai.google.dev/) models.
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with CSS Variables for robust theming.
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1.  Navigate to the **Settings** page to configure your Google AI API Key. This is required to enable the AI-powered features.
2.  Go to the **Design Studio** or the **Templates** page to start creating your first card.
3.  Use the **AI Tools** panel in the Design Studio to generate or import designs.
4.  Save your creations to your **My Cards** collection.
