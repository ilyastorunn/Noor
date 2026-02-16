# Hushu – Design Rules v2

> **Purpose**: Define a calm, sacred, modern visual language for Hushu.
> The UI must feel like a quiet sanctuary at night — restrained, reverent, and human.
> Inspiration is drawn from Hallow **without imitation**.

---

## 0. Prime Directive

> **If a design choice feels expressive, decorative, or loud — remove it.**
>
> Calm comes from restraint, not creativity.

The UI should *disappear*, allowing the user to feel guided rather than stimulated.

---

## 1. Core Philosophy — "Midnight Sanctuary"

* **Atmosphere**: Night, silence, inner focus
* **Emotion**: Safety, humility, softness, guidance
* **Avoid**: Productivity-app energy, startup polish, wellness clichés

### What Hushu is NOT

* Not a tech product
* Not a gamified habit tracker
* Not a colorful content library

### What Hushu IS

* A spiritual companion
* A quiet guide
* A place you return to when you need grounding

---

## 2. Color System — Silence First

### 2.1 Screen Backgrounds (Immutable Rule)

> ❌ NO gradients. Ever.

* **Primary Background**: `#020617` (Near-black, Slate 950)
* **Secondary Background**: `#0F172A` (Slate 900)

Use **one background color per screen**.
Do not mix backgrounds within a single screen.

---

### 2.2 Surfaces & Cards — Low Contrast by Default

Cards must *emerge gently* from the background.

* **Primary Surface**: `#111827`
* **Secondary Surface**: `#162021`
* **Borders (optional)**: `rgba(255,255,255,0.04)`

> If you can clearly see the card edge, it is too strong.

No drop shadows unless absolutely necessary.

---

### 2.3 Accent Colors — Ritual Use Only

Accent colors are **sacred**. They appear only at moments of meaning.

#### Primary Ritual Accent

* **Creased Khaki**: `#F8D794`

Used ONLY for:

* Primary CTA buttons
* Completion moments ("You've done today's reading")
* Selected states that represent commitment

❌ Never use Khaki for decoration
❌ Never use Khaki in large quantities

#### Structural Accent

* **Deep Emerald**: `#284139`

Used ONLY for:

* Selected card borders
* Progress indicators
* Active navigation states

#### Warm Accent (Extremely Rare)

* **Earth Ember**: `#BB6830`

Used ONLY for:

* Emotional warmth moments
* Anxiety / sadness guidance
* Never in standard flows

---

## 3. Typography — Reading Is Sacred

### 3.1 Font Roles

* **Headings**: Serif (Playfair Display / Lora)

  * Used sparingly
  * Large, calm, unhurried

* **Body Text**: Sans-serif (Inter / Nunito)

  * Optimized for long reading
  * Slightly loose line-height

---

### 3.2 Typography Hierarchy

* **Scripture / Qur'an Text**

  * Largest body size
  * Highest contrast
  * Maximum line-height

* **Guidance Text**

  * Gentle tone
  * Never instructional

* **Metadata (dates, labels)**

  * Muted color
  * Smaller size

> If text feels like UI instead of language, reduce its emphasis.

---

## 4. Layout — Vertical Stillness

* Prefer **vertical flow**
* Avoid dense grids unless browsing content
* Home screen should feel like a slow scroll, not a dashboard

### Spacing Rules

* Use space generously
* Silence is created through emptiness

Spacing scale:

* xs: 4
* sm: 8
* md: 16
* lg: 24
* xl: 32
* xxl: 48

---

## 5. Cards & Containers

### Default Card Style

* Radius: 16–24px
* Background: Surface color
* No strong borders
* No gradients

Cards should feel **soft and heavy**, not sharp or floating.

---

## 6. Buttons — Acts, Not Controls

### Primary Button

* Background: `#F8D794`
* Text: `#111A19`
* Full width
* Radius: 24px

Used ONLY when:

* The user commits
* The user begins or completes something meaningful

### Secondary / Ghost Button

* Border: `rgba(255,255,255,0.12)`
* Text: Muted

Never compete visually with primary buttons.

---

## 7. Selection States

Selection should feel like **acknowledgment**, not activation.

* Selected cards:

  * Thin emerald border
  * Very subtle glow

* Unselected cards:

  * Flat
  * Quiet

No animations that draw attention to selection.

---

## 8. Illustrations & Imagery

* **No realistic faces**
* Use:

  * Nature
  * Night sky
  * Light through darkness
  * Abstract geometry

Illustrations must:

* Support mood
* Never dominate content

Use placeholders during MVP.

---

## 9. Motion & Feedback

* Motion should reassure, not delight
* Use fades and gentle transitions
* No bouncy or playful animations

Haptics:

* Only for confirmation
* Never for discovery

---

## 10. Agent Enforcement Rules

When generating UI or code:

1. Do not ask design questions
2. Apply restraint by default
3. If unsure, reduce emphasis
4. Calm > clarity > beauty
5. No decorative elements
6. No gradients
7. No loud contrasts

> **The UI should feel like it was always there.**
