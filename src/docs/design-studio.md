# CardHub Design Studio Documentation

The Design Studio is the heart of CardHub, providing a powerful and intuitive interface for creating, customizing, and exporting business cards. This document breaks down its components and features.

## 1. Overall Layout

The Design Studio uses a responsive layout that adapts to different screen sizes.

-   **Desktop (3-Panel View)**: On larger screens, the studio is divided into three main panels for a seamless workflow:
    1.  **Editor Panel (Left)**: Contains all the controls for modifying the card's content and style.
    2.  **Card Preview (Center)**: A large, real-time preview of the business card.
    3.  **AI Tools (Right)**: Powerful tools to generate or import designs using AI.

-   **Mobile (Tab View)**: On smaller screens, the layout switches to a tab-based interface to save space:
    1.  **Editor Tab**: Access to all content and style controls.
    2.  **Preview Tab**: A focused view of the card preview.
    3.  **AI Tools Tab**: Access to the AI generation and import tools.

## 2. Header Actions

The header at the top of the page provides the main actions for your design.

-   **Save Card**: Saves the current state of your card design to your browser's local storage. You can find all your saved designs on the "My Cards" page.
-   **Share**: If a website URL has been added to the card, this button copies the URL to your clipboard for easy sharing.
-   **Download**: Opens the Download dialog, allowing you to get a copy of your card.
    -   **Format**: Choose between `PNG`, `JPG`, or a two-page `PDF`.
    -   **Quality**:
        -   **Print (300 DPI)**: Recommended for physical printing. Generates high-resolution files.
        -   **Web (72 DPI)**: Suitable for digital use (e.g., email signatures, websites).

## 3. Editor Panel

The Editor Panel is organized into accordions to keep the workspace tidy.

### Card Content

This section controls the information displayed on the card.

-   **Name, Title, Company**: Basic text fields for your personal details.
-   **Website URL**: Entering a URL here automatically generates a **QR Code** on the back of the card.
-   **Profile Picture & Company Logo**: Upload buttons to add personal or company branding images. These images are stored as data URIs within the card's saved data.
-   **Footer Slogan**: An optional line of text that appears on the back of the card, below the QR code.

### Card Style

This section controls the visual appearance of the card.

-   **Category**: Assigning a category (e.g., Business, Creative, 3D) can influence AI suggestions and enables special features like the 3D preview.
-   **Layout**: Choose from a variety of pre-defined layouts (e.g., Center Aligned, Split Vertical) that arrange the content on the card face.
-   **Colors**: Use the color pickers to set the `Background`, `Text`, and `Accent` colors. The accent color is used for elements like the title text and patterns.
-   **Background Pattern**: Select from a list of repeatable SVG patterns. The pattern color is determined by the "Accent" color. Selecting a pattern will override any background image.
-   **Font**: Choose a font family for all the text on your card.

## 4. Card Preview

The central panel shows a live, interactive preview of your card.

-   **Real-Time Updates**: Any change made in the Editor Panel is immediately reflected here.
-   **Flip Card**: A button below the preview allows you to flip the card to see its back, which displays the company logo, QR code, and slogan.
-   **3D Effect**: If the card's `Category` is set to "3D", the preview enables a subtle perspective shift effect that follows your mouse cursor, giving the card a sense of depth.

## 5. AI Tools

The right-hand panel provides access to Genkit-powered AI features. **Note**: An API key must be set in the `Settings` page for these tools to be active.

### Generate

-   **Design Prompt**: Describe the card you want (e.g., "a modern, minimalist card for a law firm"). The AI will generate a complete design plan, including colors, a suitable font, a style description, and a category.
-   **Company Website (Optional)**: If you provide a URL, the AI will use a tool to analyze it and incorporate the company's branding (like primary colors) into its design plan, ensuring the card is on-brand.

### Import

-   **Upload Image or PDF**: Upload an image or PDF of an existing business card. The AI will analyze its design (colors, layout, style) and apply a similar design plan to your current card in the editor.

### AI Analysis

-   This section displays the `styleDescription` provided by the AI after a generation or import, giving you insight into the AI's design choices.
