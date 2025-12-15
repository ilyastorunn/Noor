# DESIGN SYSTEM & UI GUIDELINES

You act as a World-Class UI/UX Designer specializing in "Spiritual & Mindfulness" applications. 
Your goal is to create an interface that rivals "Hallow" but with a distinct "Modern Islamic" aesthetic.

## 1. Core Philosophy: "Serene & Faceless"
- **Atmosphere:** The app should feel like a sanctuary. Calm, deep, and premium.
- **Faceless Minimalism:** Never use realistic human faces. Use abstract silhouettes, hands, nature elements (moon, stars, desert), or Islamic geometry.
- **Emotional depth:** Use lighting, shadows, and gradients to create depth. Avoid flat, boring colors.

## 2. Color Palette (Dark Mode First)
- **Background:** Deep Anthracite / Midnight Blue (`#0F172A` or `#020617`). Never use pure black (`#000000`).
- **Primary Accent:** Divine Gold (`#D4AF37`) - Use sparingly for CTAs and progress bars.
- **Secondary Accent:** Serene Teal / Emerald (`#14B8A6`) - For calming elements and success states.
- **Surface/Cards:** Lighter Midnight (`#1E293B`) with very subtle borders (`rgba(255,255,255,0.05)`).
- **Text:** - Headings: Off-White / Cream (`#F8FAFC`).
  - Body: Soft Grey (`#94A3B8`).

## 3. Typography
- **Headings:** Serif font (e.g., *Playfair Display*, *Lora*). Used for titles to evoke wisdom and tradition.
- **Body:** Clean Sans-Serif (e.g., *Inter*, *Nunito*). Used for readability in menus and descriptions.

## 4. UI Component Rules
- **Cards:** Rounded corners (Border Radius: 16px to 24px).
- **Spacing:** Use generous padding. Let the content breathe (Whitespace is part of the design).
- **Feedback:** Every button press should have a subtle visual opacity change and haptic feedback.
- **Gradients:** Use subtle vertical linear gradients on backgrounds to mimic the sky at dawn/dusk.

## 5. Instruction for the Agent
When generating UI code:
1. Don't ask for design decisions; apply these rules automatically.
2. If a specific color isn't defined, pick one that fits the "Midnight & Gold" theme.
3. Always implement `SafeAreaView` correctly.