# ELEVENLABS AUDIO PRODUCTION WORKFLOW

**Purpose:** Generate high-quality narration for Prophet stories using AI text-to-speech.

---

## CONTENT OVERVIEW

### Total Audio Files

- **5 Prophets** × **5 Episodes** = 25 stories
- **2 Voices** (male + female) = **50 audio files**
- **Duration:** ~5-8 minutes per episode
- **Total Audio:** ~4-6 hours

---

## ELEVENLABS SETUP

### 1. Create Account

- Sign up at <https://elevenlabs.io/>
- **Plan:** Creator ($22/month) or Pro ($99/month) recommended
  - Creator: 100k characters/month (~40-50 episodes)
  - Pro: 500k characters/month (sufficient for all content)

### 2. Voice Selection

**Male Voice (Recommended):**

- **Josh** - Warm, narrative, mature
- **Adam** - Deep, authoritative, calming
- **Antoni** - Smooth, meditative

**Female Voice (Recommended):**

- **Rachel** - Warm, gentle, storytelling
- **Domi** - Calm, soothing, mature
- **Bella** - Soft, empathetic

**Test voices with sample text before finalizing.**

### 3. Voice Settings

- **Stability:** 0.7 (balanced)
- **Clarity + Similarity:** 0.8 (high quality)
- **Style Exaggeration:** 0.3 (subtle emotion)
- **Speaker Boost:** ON (enhanced clarity)

---

## STORY TEXT PREPARATION

### Format Example

**File:** `prophet_nuh_episode1.txt`

```
Prophet Nuh: Episode 1 - The Call to Truth

[Pause: 1s]

In a time when the earth was cloaked in darkness,
when hearts had turned from their Creator,
there lived a man named Nuh.

[Pause: 0.5s]

Allah chose him as a messenger to his people,
not for his strength,
not for his wealth,
but for the purity of his heart.

[Pause: 1s]

For nine hundred and fifty years,
Nuh called his people to worship Allah alone.

[Pause: 0.5s]

But they mocked him.
They laughed.
They turned away.

[Pause: 1s]

Yet Nuh did not waver.

[Continue story...]

[End: 2s pause]
```

### Writing Guidelines

- **Tone:** Meditatif, reflective, not preachy
- **Pacing:** Use pauses for dramatic effect (`[Pause: 1s]`)
- **Length:** ~1,200-1,500 words per episode (5-8 min narration)
- **Theological Accuracy:** Cite Qur'an verses where relevant
- **Emotional Arc:** Build tension, climax, resolution

---

## ELEVENLABS API WORKFLOW

### Option 1: Manual Upload (MVP)

1. Go to ElevenLabs dashboard
2. Select voice
3. Paste story text
4. Adjust settings
5. Generate audio
6. Download MP3
7. Upload to Firebase Storage

**Pros:** Easy, no coding
**Cons:** Manual, time-consuming for 50 files

---

### Option 2: API Automation (Recommended)

**Install ElevenLabs SDK:**

```bash
npm install elevenlabs
```

**Script:** `/scripts/generateStoryAudio.ts`

```typescript
import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";
import path from "path";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const VOICES = {
  male: "voice_id_adam", // Replace with actual voice ID
  female: "voice_id_rachel",
};

async function generateEpisodeAudio(
  storyText: string,
  voiceGender: "male" | "female",
  outputFilename: string,
) {
  const audio = await elevenlabs.generate({
    voice: VOICES[voiceGender],
    text: storyText,
    model_id: "eleven_multilingual_v2", // High-quality model
    voice_settings: {
      stability: 0.7,
      similarity_boost: 0.8,
      style: 0.3,
      use_speaker_boost: true,
    },
  });

  const audioBuffer = await audio.arrayBuffer();
  const outputPath = path.join(__dirname, "../output", outputFilename);

  fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
  console.log(`✅ Generated: ${outputFilename}`);
}

// Example: Generate all episodes for Prophet Nuh
const stories = [
  { prophet: "Nuh", episode: 1, textFile: "nuh_ep1.txt" },
  { prophet: "Nuh", episode: 2, textFile: "nuh_ep2.txt" },
  // ... add all 25 episodes
];

async function generateAllAudio() {
  for (const story of stories) {
    const text = fs.readFileSync(`./stories/${story.textFile}`, "utf-8");

    // Generate male version
    await generateEpisodeAudio(
      text,
      "male",
      `${story.prophet}_ep${story.episode}_male.mp3`,
    );

    // Generate female version
    await generateEpisodeAudio(
      text,
      "female",
      `${story.prophet}_ep${story.episode}_female.mp3`,
    );
  }
}

generateAllAudio();
```

**Run:**

```bash
tsx scripts/generateStoryAudio.ts
```

---

## FIREBASE STORAGE UPLOAD

### Folder Structure

```
/audio/
  /stories/
    /nuh/
      nuh_ep1_male.mp3
      nuh_ep1_female.mp3
      nuh_ep2_male.mp3
      nuh_ep2_female.mp3
      ...
    /ibrahim/
      ibrahim_ep1_male.mp3
      ibrahim_ep1_female.mp3
      ...
```

### Upload Script

```typescript
import { getStorage, ref, uploadBytes } from "firebase/storage";
import fs from "fs";

const storage = getStorage();

async function uploadAudio(localPath: string, remotePath: string) {
  const fileBuffer = fs.readFileSync(localPath);
  const storageRef = ref(storage, remotePath);

  await uploadBytes(storageRef, fileBuffer, {
    contentType: "audio/mpeg",
  });

  console.log(`✅ Uploaded: ${remotePath}`);
}

// Example
await uploadAudio(
  "./output/nuh_ep1_male.mp3",
  "audio/stories/nuh/nuh_ep1_male.mp3",
);
```

---

## FIRESTORE METADATA

After uploading audio, add metadata to Firestore:

```typescript
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

await setDoc(doc(db, "content/stories", "nuh"), {
  prophetName: "Nuh",
  episodes: [
    {
      episodeNumber: 1,
      title: "The Call to Truth",
      textContent: "...", // Full text
      audioURL: {
        male: "https://firebasestorage.googleapis.com/.../nuh_ep1_male.mp3",
        female: "https://firebasestorage.googleapis.com/.../nuh_ep1_female.mp3",
      },
      duration: 420, // seconds (7 min)
      isPremium: false, // Episodes 1-2 are free
      theme: "Patience in hardship",
      moodTags: ["anxious", "weary"],
    },
    // ... episodes 2-5
  ],
});
```

---

## QUALITY CONTROL CHECKLIST

### Text Review

- [ ] Theological accuracy verified
- [ ] No controversial interpretations
- [ ] Qur'anic references cited correctly
- [ ] Language is inclusive, not preachy
- [ ] Grammar and spelling checked

### Audio Review

- [ ] Pronunciation correct (especially Arabic names)
- [ ] Pacing appropriate (not too fast/slow)
- [ ] Emotional tone matches content
- [ ] No robotic artifacts
- [ ] Volume levels consistent

### Technical Review

- [ ] File size < 10 MB per episode
- [ ] Audio format: MP3, 128kbps (good quality, reasonable size)
- [ ] Filenames follow convention
- [ ] Firebase URLs accessible
- [ ] Metadata in Firestore correct

---

## COST ESTIMATION

### ElevenLabs Pricing

**Pro Plan ($99/month):**

- 500k characters/month
- Each episode: ~10k characters
- 50 episodes × 10k = 500k characters
- **Total:** 1 month of Pro plan = $99

**Alternative:** Creator Plan ($22/month)

- 100k characters/month
- Generate 10 episodes/month
- **Total:** 5 months × $22 = $110

**Recommendation:** Use Pro plan for 1 month, generate all audio at once.

---

## ALTERNATIVE: MANUAL RECORDING

If ElevenLabs budget is tight:

- **Hire voice actors** (Fiverr, Upwork)
- **Cost:** ~$50-100 per hour of narration
- **Total:** ~$300-500 for all content
- **Pros:** More human, custom direction
- **Cons:** Expensive, slower, less consistent

---

## TESTING CHECKLIST

- [ ] Sample episode generated with both voices
- [ ] Audio quality acceptable (no robotic sounds)
- [ ] Pronunciation of Arabic names correct
- [ ] Pause markers work as expected
- [ ] File size acceptable (< 10 MB)
- [ ] Upload to Firebase Storage successful
- [ ] Firestore metadata correct
- [ ] Audio playable in app (react-native-track-player)

---

## TIMELINE

**Phase 2 (Content Production):**

1. Write all 25 episode scripts
2. Theological review by advisors
3. Generate audio (ElevenLabs)
4. Upload to Firebase + metadata
5. QA testing, iterate if needed

---

## NEXT STEPS

1. Write Prophet Nuh Episode 1 (sample)
2. Test with ElevenLabs (both voices)
3. Get theological review
4. If approved, proceed with remaining 24 episodes
5. Upload to Firebase
6. Integrate into app (see `/documentation/03-audio/AudioPlayer_Architecture.md`)
