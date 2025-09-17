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
-   **Download**: Opens a dialog to download your card.
    -   **Format**: Choose between `PNG`, `JPG`, or a two-page `PDF`.
    -   **Quality**:
        -   **Print (300 DPI)**: Recommended for physical printing. Generates high-resolution files.
        -   **Web (72 DPI)**: Suitable for digital use (e.g., email signatures, websites).

## 3. Editor Panel: Customizing Your Card

The Editor Panel is organized into accordions to keep the workspace tidy. This is where you control every aspect of your card's design and content.

### Card Content

This section controls the information displayed on the card.

-   **Name, Title, Company**: Basic text fields for your personal details.
-   **Website URL (for QR Code)**: Entering a valid URL here (e.g., `https://example.com`) automatically generates a **QR Code** on the back of the card. The QR code links directly to this URL.
-   **Profile Picture & Company Logo**: Upload buttons to add personal or company branding images. These images are stored as data URIs within the card's saved data. The logo appears on the back of the card and can be part of certain front layouts.
-   **Footer Slogan**: An optional line of text that appears on the back of the card, below the QR code.

### Card Style

This section controls the visual appearance of the card.

-   **Category**: Assigning a category (e.g., Business, Creative, 3D) can influence AI suggestions and enables special features. Setting the category to **"3D"** activates a special preview mode where the card has a perspective shift effect that follows your mouse cursor.
-   **Layout**: Choose from a variety of pre-defined layouts (e.g., Center Aligned, Split Vertical, Top Left) that arrange the content on the card face. This is a powerful way to quickly change the entire composition of your card.
-   **Color Palette**:
    -   **Background**: Sets the base color of the card.
    -   **Text**: Sets the color for the primary text elements, like your name and company.
    -   **Accent**: Sets the color for secondary elements, such as your title, background patterns, and the border on your profile picture.
-   **Background Pattern**: Select from a list of repeatable SVG patterns (dots, lines, grid, etc.). The pattern's color is determined by the **Accent** color you've chosen. Selecting a pattern will remove any background image, as they are mutually exclusive.
-   **Font**: Choose a font family (e.g., Inter, Georgia, Source Code Pro) for all the text on your card to match its style.

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
