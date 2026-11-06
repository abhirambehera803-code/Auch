import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;
const DB_PATH = path.resolve(process.cwd(), 'data', 'calorie_tracker_db.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Server-side Gemini AI client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.use(express.json());

// --- Database Helper ---
interface DBStructure {
  friends: Array<{
    id: string;
    name: string;
    email?: string;
    pin: string;
    avatarColor: string;
    profile: any;
  }>;
  logs: Record<string, any>; // key: `${userId}_${date}`
}

function getInitialDB(): DBStructure {
  return {
    friends: [
      {
        id: 'user_abhiram',
        name: 'Abhiram',
        email: 'abhiram@caloriemate.app',
        pin: '1234',
        avatarColor: 'bg-emerald-600',
        profile: {
          id: 'user_abhiram',
          name: 'Abhiram',
          age: 26,
          gender: 'male',
          heightCm: 175,
          weightKg: 72,
          activityLevel: 'moderate',
          goal: 'maintain',
          dietaryPreference: 'non-veg',
          targetCalories: 2150,
          targetProtein: 130,
          targetCarbs: 240,
          targetFat: 60,
          waterGoalGlasses: 12,
        },
      },
      {
        id: 'user_priya',
        name: 'Priya',
        email: 'priya@caloriemate.app',
        pin: '1234',
        avatarColor: 'bg-teal-600',
        profile: {
          id: 'user_priya',
          name: 'Priya',
          age: 24,
          gender: 'female',
          heightCm: 162,
          weightKg: 58,
          activityLevel: 'light',
          goal: 'loss',
          dietaryPreference: 'veg',
          targetCalories: 1650,
          targetProtein: 85,
          targetCarbs: 195,
          targetFat: 48,
          waterGoalGlasses: 10,
        },
      },
      {
        id: 'user_rohan',
        name: 'Rohan',
        email: 'rohan@caloriemate.app',
        pin: '1234',
        avatarColor: 'bg-amber-600',
        profile: {
          id: 'user_rohan',
          name: 'Rohan',
          age: 28,
          gender: 'male',
          heightCm: 180,
          weightKg: 82,
          activityLevel: 'very',
          goal: 'gain',
          dietaryPreference: 'non-veg',
          targetCalories: 2750,
          targetProtein: 165,
          targetCarbs: 320,
          targetFat: 75,
          waterGoalGlasses: 14,
        },
      },
    ],
    logs: {},
  };
}

function loadDB(): DBStructure {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db:', err);
  }
  const init = getInitialDB();
  saveDB(init);
  return init;
}

function saveDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// Seed initial meal logs for today for Abhiram so the dashboard immediately shines
function ensureSeedData() {
  const db = loadDB();
  const today = new Date().toISOString().split('T')[0];
  const logKey = `user_abhiram_${today}`;

  if (!db.logs[logKey]) {
    db.logs[logKey] = {
      date: today,
      userId: 'user_abhiram',
      meals: {
        breakfast: [
          {
            id: 'item_1',
            name: 'Poha with Peanuts & Veggies',
            quantity: 1,
            unit: 'bowl',
            calories: 240,
            protein: 5.2,
            carbs: 42,
            fat: 6.5,
            fiber: 2.8,
            verifiedBy: 'database',
            isEstimated: false,
            loggedAt: '08:30 AM',
          },
          {
            id: 'item_2',
            name: 'Boiled Egg (Large)',
            quantity: 2,
            unit: 'piece',
            calories: 148,
            protein: 12.6,
            carbs: 0.8,
            fat: 10,
            fiber: 0,
            verifiedBy: 'database',
            isEstimated: false,
            loggedAt: '08:35 AM',
          },
          {
            id: 'item_3',
            name: 'Masala Chai with Milk (No Sugar)',
            quantity: 1,
            unit: 'cup',
            calories: 55,
            protein: 3,
            carbs: 4.5,
            fat: 3.2,
            fiber: 0,
            verifiedBy: 'database',
            isEstimated: false,
            loggedAt: '08:40 AM',
          },
        ],
        lunch: [
          {
            id: 'item_4',
            name: 'Roti / Chapati (Whole Wheat)',
            quantity: 2,
            unit: 'roti',
            calories: 170,
            protein: 6.2,
            carbs: 33,
            fat: 1,
            fiber: 4.4,
            verifiedBy: 'database',
            isEstimated: false,
            loggedAt: '01:15 PM',
          },
          {
            id: 'item_5',
            name: 'Dal Tadka / Toor Dal',
            quantity: 1,
            unit: 'bowl',
            calories: 160,
            protein: 7.8,
            carbs: 22,
            fat: 4.5,
            fiber: 4,
            verifiedBy: 'database',
            isEstimated: false,
            loggedAt: '01:15 PM',
          },
          {
            id: 'item_6',
            name: 'Chicken Breast (Grilled/Tandoori)',
            quantity: 150,
            unit: 'g',
            calories: 245,
            protein: 46.5,
            carbs: 2,
            fat: 5.2,
            fiber: 0,
            verifiedBy: 'database',
            isEstimated: false,
            loggedAt: '01:20 PM',
          },
          {
            id: 'item_7',
            name: 'Fresh Mixed Salad',
            quantity: 1,
            unit: 'bowl',
            calories: 45,
            protein: 1.8,
            carbs: 9,
            fat: 0.4,
            fiber: 3.2,
            verifiedBy: 'database',
            isEstimated: false,
            loggedAt: '01:20 PM',
          },
        ],
        dinner: [],
        snacks: [
          {
            id: 'item_8',
            name: 'Curd / Dahi (Plain Homemade)',
            quantity: 1,
            unit: 'bowl',
            calories: 98,
            protein: 5.2,
            carbs: 6.8,
            fat: 5.5,
            fiber: 0,
            verifiedBy: 'database',
            isEstimated: false,
            loggedAt: '04:45 PM',
          },
          {
            id: 'item_9',
            name: 'Banana (1 Medium)',
            quantity: 1,
            unit: 'piece',
            calories: 105,
            protein: 1.3,
            carbs: 27,
            fat: 0.3,
            fiber: 3.1,
            verifiedBy: 'database',
            isEstimated: false,
            loggedAt: '04:50 PM',
          },
        ],
      },
      waterGlasses: 7,
      wearable: {
        connected: true,
        deviceName: 'Apple Health',
        lastSyncedAt: new Date().toLocaleTimeString(),
        steps: 7420,
        activeCaloriesBurned: 340,
        restingHeartRate: 64,
        activeMinutes: 42,
      },
    };
    saveDB(db);
  }
}
ensureSeedData();

// --- Auth & Friends Routes ---
app.get('/api/auth/friends', (_req: Request, res: Response) => {
  const db = loadDB();
  // Return list of friends with public profile and id
  const list = db.friends.map(f => ({
    id: f.id,
    name: f.name,
    email: f.email,
    avatarColor: f.avatarColor,
    hasPin: Boolean(f.pin),
    profile: f.profile,
  }));
  res.json({ success: true, friends: list });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { userId, pin } = req.body;
  const db = loadDB();
  const friend = db.friends.find(f => f.id === userId);

  if (!friend) {
    return res.status(404).json({ success: false, error: 'Friend profile not found' });
  }

  // Friendly passcode check (default is 1234 if not customized)
  if (friend.pin && pin && friend.pin !== pin) {
    return res.status(401).json({ success: false, error: 'Incorrect passcode. Hint: Default is 1234' });
  }

  res.json({
    success: true,
    user: {
      id: friend.id,
      name: friend.name,
      email: friend.email,
      avatarColor: friend.avatarColor,
      profile: friend.profile,
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, pin, profile } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }

  const db = loadDB();
  const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const colors = ['bg-emerald-600', 'bg-teal-600', 'bg-cyan-600', 'bg-indigo-600', 'bg-emerald-700', 'bg-green-600'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const newFriend = {
    id,
    name: name.trim(),
    pin: pin || '1234',
    avatarColor,
    profile: profile || {
      id,
      name: name.trim(),
      age: 25,
      gender: 'male',
      heightCm: 170,
      weightKg: 68,
      activityLevel: 'moderate',
      goal: 'maintain',
      dietaryPreference: 'veg',
      targetCalories: 2000,
      targetProtein: 120,
      targetCarbs: 220,
      targetFat: 55,
      waterGoalGlasses: 10,
    },
  };

  db.friends.push(newFriend);
  saveDB(db);

  res.json({ success: true, user: newFriend });
});

// --- Profile Routes ---
app.get('/api/user/profile', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_abhiram';
  const db = loadDB();
  const friend = db.friends.find(f => f.id === userId);
  if (!friend) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, profile: friend.profile });
});

app.post('/api/user/profile', (req: Request, res: Response) => {
  const { userId, profile } = req.body;
  const db = loadDB();
  const friendIndex = db.friends.findIndex(f => f.id === userId);
  if (friendIndex === -1) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  db.friends[friendIndex].profile = { ...db.friends[friendIndex].profile, ...profile };
  saveDB(db);
  res.json({ success: true, profile: db.friends[friendIndex].profile });
});

// --- Meals & Log Routes ---
app.get('/api/meals', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_abhiram';
  const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
  const db = loadDB();
  const logKey = `${userId}_${date}`;

  if (!db.logs[logKey]) {
    // create blank log
    db.logs[logKey] = {
      date,
      userId,
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      },
      waterGlasses: 0,
      wearable: {
        connected: false,
        deviceName: 'None',
        steps: 0,
        activeCaloriesBurned: 0,
        restingHeartRate: 0,
        activeMinutes: 0,
      },
    };
    saveDB(db);
  }

  res.json({ success: true, log: db.logs[logKey] });
});

app.post('/api/meals/item', (req: Request, res: Response) => {
  const { userId, date, mealType, item } = req.body;
  if (!userId || !date || !mealType || !item) {
    return res.status(400).json({ success: false, error: 'Missing parameters' });
  }

  const db = loadDB();
  const logKey = `${userId}_${date}`;
  if (!db.logs[logKey]) {
    db.logs[logKey] = {
      date,
      userId,
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      waterGlasses: 0,
      wearable: { connected: false, deviceName: 'None', steps: 0, activeCaloriesBurned: 0, restingHeartRate: 0, activeMinutes: 0 },
    };
  }

  const newItem = {
    ...item,
    id: item.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    loggedAt: item.loggedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  db.logs[logKey].meals[mealType].push(newItem);
  saveDB(db);

  res.json({ success: true, item: newItem, log: db.logs[logKey] });
});

app.put('/api/meals/item', (req: Request, res: Response) => {
  const { userId, date, mealType, item } = req.body;
  const db = loadDB();
  const logKey = `${userId}_${date}`;
  if (!db.logs[logKey] || !db.logs[logKey].meals[mealType]) {
    return res.status(404).json({ success: false, error: 'Log or meal not found' });
  }

  const items = db.logs[logKey].meals[mealType];
  const idx = items.findIndex((i: any) => i.id === item.id);
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...item, verifiedBy: 'user' };
    saveDB(db);
    return res.json({ success: true, item: items[idx], log: db.logs[logKey] });
  }

  res.status(404).json({ success: false, error: 'Food item not found' });
});

app.delete('/api/meals/item', (req: Request, res: Response) => {
  const { userId, date, mealType, itemId } = req.body;
  const db = loadDB();
  const logKey = `${userId}_${date}`;
  if (!db.logs[logKey] || !db.logs[logKey].meals[mealType]) {
    return res.status(404).json({ success: false, error: 'Log not found' });
  }

  db.logs[logKey].meals[mealType] = db.logs[logKey].meals[mealType].filter((i: any) => i.id !== itemId);
  saveDB(db);

  res.json({ success: true, log: db.logs[logKey] });
});

app.delete('/api/meals/clear', (req: Request, res: Response) => {
  const { userId, date, mealType } = req.body;
  const db = loadDB();
  const logKey = `${userId}_${date}`;
  if (!db.logs[logKey]) {
    return res.json({ success: true });
  }

  if (mealType) {
    db.logs[logKey].meals[mealType] = [];
  } else {
    db.logs[logKey].meals = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    db.logs[logKey].waterGlasses = 0;
  }

  saveDB(db);
  res.json({ success: true, log: db.logs[logKey] });
});

// --- Water Tracker ---
app.post('/api/water', (req: Request, res: Response) => {
  const { userId, date, glasses } = req.body;
  const db = loadDB();
  const logKey = `${userId}_${date}`;
  if (!db.logs[logKey]) {
    db.logs[logKey] = {
      date,
      userId,
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      waterGlasses: 0,
      wearable: { connected: false, deviceName: 'None', steps: 0, activeCaloriesBurned: 0, restingHeartRate: 0, activeMinutes: 0 },
    };
  }

  db.logs[logKey].waterGlasses = Math.max(0, glasses);
  saveDB(db);
  res.json({ success: true, waterGlasses: db.logs[logKey].waterGlasses });
});

// --- Wearable Sync ---
app.post('/api/wearables/sync', (req: Request, res: Response) => {
  const { userId, date, deviceName, steps, activeCaloriesBurned, restingHeartRate, activeMinutes, connected } = req.body;
  const db = loadDB();
  const logKey = `${userId}_${date}`;
  if (!db.logs[logKey]) {
    db.logs[logKey] = {
      date,
      userId,
      meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
      waterGlasses: 0,
      wearable: { connected: false, deviceName: 'None', steps: 0, activeCaloriesBurned: 0, restingHeartRate: 0, activeMinutes: 0 },
    };
  }

  db.logs[logKey].wearable = {
    connected: connected ?? true,
    deviceName: deviceName || 'Apple Health',
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    steps: steps ?? Math.floor(6000 + Math.random() * 4000),
    activeCaloriesBurned: activeCaloriesBurned ?? Math.floor(250 + Math.random() * 250),
    restingHeartRate: restingHeartRate ?? Math.floor(62 + Math.random() * 8),
    activeMinutes: activeMinutes ?? Math.floor(30 + Math.random() * 30),
  };

  saveDB(db);
  res.json({ success: true, wearable: db.logs[logKey].wearable });
});

// --- History & Analytics ---
app.get('/api/history', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'user_abhiram';
  const db = loadDB();

  // Generate last 7 days history
  const today = new Date();
  const history = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const logKey = `${userId}_${dateStr}`;
    const dayLog = db.logs[logKey];

    let cals = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let water = 0;
    let steps = 0;
    let activeBurn = 0;

    if (dayLog) {
      water = dayLog.waterGlasses || 0;
      steps = dayLog.wearable?.steps || 0;
      activeBurn = dayLog.wearable?.activeCaloriesBurned || 0;
      for (const m of ['breakfast', 'lunch', 'dinner', 'snacks']) {
        const items = dayLog.meals?.[m] || [];
        for (const item of items) {
          cals += item.calories || 0;
          protein += item.protein || 0;
          carbs += item.carbs || 0;
          fat += item.fat || 0;
        }
      }
    } else {
      // Mock realistic prior days if not logged yet to showcase charts
      cals = Math.round(1850 + Math.sin(i) * 200);
      protein = Math.round(110 + Math.cos(i) * 15);
      carbs = Math.round(210 + Math.sin(i) * 30);
      fat = Math.round(55 + Math.cos(i) * 8);
      water = 8 + (i % 4);
      steps = 7500 + i * 400;
      activeBurn = 320 + i * 15;
    }

    history.push({
      date: dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      calories: Math.round(cals),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      waterGlasses: water,
      steps,
      activeBurn,
    });
  }

  res.json({ success: true, history });
});

// --- Smart AI Features using Gemini 3.8 Flash ---

// 1. Natural Language Food Parsing: e.g. "I had 2 medium rotis with dal and 100g paneer"
app.post('/api/meals/quick-ai-parse', async (req: Request, res: Response) => {
  const { text, mealType } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, error: 'Text prompt is required' });
  }

  try {
    const prompt = `Analyze this food intake text for an Indian & international calorie tracker: "${text}".
Break it down into individual food items with realistic and accurate nutritional values (Indian food standards).
Return a JSON array of items where each item contains:
- name: string (e.g., "Roti / Chapati", "Yellow Dal Tadka", "Paneer Bhurji")
- quantity: number (e.g. 2, 1, 100)
- unit: string (must be one of: "roti", "piece", "bowl", "cup", "plate", "g", "ml", "tbsp")
- description: string (e.g. "Cooked with light ghee")
- calories: number (kcal)
- protein: number (grams, accurate)
- carbs: number (grams)
- fat: number (grams)
- fiber: number (grams)
- healthierAlternative: optional string (if high in refined carbs/fat, suggest a healthy swap)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert clinical dietitian specializing in Indian and global foods. Output strictly valid JSON matching the requested schema. Provide realistic portion weights and macro counts.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              quantity: { type: Type.NUMBER },
              unit: { type: Type.STRING },
              description: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              fiber: { type: Type.NUMBER },
              healthierAlternative: { type: Type.STRING },
            },
            required: ['name', 'quantity', 'unit', 'calories', 'protein', 'carbs', 'fat'],
          },
        },
      },
    });

    const parsedItems = JSON.parse(response.text ?? '[]');
    const items = parsedItems.map((item: any, idx: number) => ({
      ...item,
      id: `ai_${Date.now()}_${idx}`,
      isEstimated: true,
      verifiedBy: 'ai',
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    res.json({ success: true, items });
  } catch (error: any) {
    console.error('Gemini Quick Parse Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to parse food text with AI. Please try adding items manually or check API quota.',
      details: error?.message,
    });
  }
});

// 2. Estimate Single Food Item
app.post('/api/ai/estimate-food', async (req: Request, res: Response) => {
  const { foodName, quantity, unit, description } = req.body;
  if (!foodName) {
    return res.status(400).json({ success: false, error: 'Food name is required' });
  }

  try {
    const prompt = `Calculate the nutritional breakdown for:
Food: ${foodName}
Quantity: ${quantity || 1} ${unit || 'serving'}
Description/Preparation: ${description || 'standard preparation'}

Provide accurate Indian & international food nutritional estimates.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an accurate nutritional database. Provide calculated calories, protein (g), carbs (g), fat (g), fiber (g) for the exact portion specified. Return valid JSON only.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            fiber: { type: Type.NUMBER },
            healthierAlternative: { type: Type.STRING },
            notes: { type: Type.STRING },
          },
          required: ['calories', 'protein', 'carbs', 'fat'],
        },
      },
    });

    const data = JSON.parse(response.text ?? '{}');
    res.json({ success: true, nutrition: data });
  } catch (error: any) {
    console.error('Gemini Food Estimate Error:', error);
    res.status(500).json({ success: false, error: 'AI estimation failed', details: error?.message });
  }
});

// 3. Daily Nutrition Insights & High/Low Protein Flagging
app.post('/api/ai/daily-insights', async (req: Request, res: Response) => {
  const { userProfile, mealsSummary, dayLog } = req.body;

  try {
    const prompt = `Review the user's daily food intake:
User Profile:
- Goal: ${userProfile?.goal || 'maintain'}
- Dietary Preference: ${userProfile?.dietaryPreference || 'veg'}
- Target Calories: ${userProfile?.targetCalories || 2000} kcal
- Target Protein: ${userProfile?.targetProtein || 120}g

Today's Intake:
- Total Calories: ${mealsSummary?.totalCalories || 0} kcal
- Total Protein: ${mealsSummary?.totalProtein || 0}g
- Total Carbs: ${mealsSummary?.totalCarbs || 0}g
- Total Fat: ${mealsSummary?.totalFat || 0}g
- Water: ${dayLog?.waterGlasses || 0} glasses

Meals Breakdown:
${JSON.stringify(dayLog?.meals || {}, null, 2)}

Provide:
1. Short empowering nutrition evaluation (2-3 sentences).
2. Identification of which meal(s) were high in protein vs low in protein, with specific recommendations.
3. 3 practical nutrition tips tailored to Indian meals (e.g. adding sprouts, dahi, paneer, eggs, seeds).
4. Overall diet grade (A+, A, B, C).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an inspiring, friendly certified sports nutritionist and dietitian with deep expertise in Indian diets. Return JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summaryText: { type: Type.STRING },
            dietGrade: { type: Type.STRING },
            proteinAssessment: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING },
                highProteinMeals: { type: Type.ARRAY, items: { type: Type.STRING } },
                lowProteinMeals: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendation: { type: Type.STRING },
              },
            },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['summaryText', 'dietGrade', 'proteinAssessment', 'tips'],
        },
      },
    });

    const insights = JSON.parse(response.text ?? '{}');
    res.json({ success: true, insights });
  } catch (error: any) {
    console.error('Gemini Daily Insights Error:', error);
    // Graceful fallback insights
    res.json({
      success: true,
      insights: {
        summaryText: 'You are making steady progress today! Keep focusing on balanced whole foods and staying hydrated.',
        dietGrade: 'A',
        proteinAssessment: {
          status: 'Good Protein Distribution',
          highProteinMeals: ['Lunch'],
          lowProteinMeals: ['Breakfast', 'Snacks'],
          recommendation: 'Try adding 1-2 boiled eggs, roasted chana, or curd to boost protein during morning and evening meals.',
        },
        tips: [
          'Pair lentils with rice or roti to create a complete essential amino acid profile.',
          'Drink a glass of water 20 minutes before meals to aid digestion.',
          'Swap refined cooking oil for measured ghee or cold-pressed mustard/coconut oil.',
        ],
      },
    });
  }
});

// 4. Healthier Alternatives Suggester
app.post('/api/ai/alternatives', async (req: Request, res: Response) => {
  const { foodItems } = req.body;

  try {
    const prompt = `Analyze these foods logged by the user: ${JSON.stringify(foodItems || [])}.
Suggest 3 to 4 healthier, delicious alternatives or smart tweaks, especially suited for Indian palates.
For each item, specify:
- originalFood: what is being swapped or improved
- betterOption: healthy alternative name
- caloriesSaved: estimated calories saved (number)
- proteinBoost: additional protein gained in grams (number)
- reason: brief benefit explanation (e.g. lower glycemic index, baked instead of deep fried)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              originalFood: { type: Type.STRING },
              betterOption: { type: Type.STRING },
              caloriesSaved: { type: Type.NUMBER },
              proteinBoost: { type: Type.NUMBER },
              reason: { type: Type.STRING },
            },
            required: ['originalFood', 'betterOption', 'caloriesSaved', 'proteinBoost', 'reason'],
          },
        },
      },
    });

    const alternatives = JSON.parse(response.text ?? '[]');
    res.json({ success: true, alternatives });
  } catch (error: any) {
    console.error('Gemini Alternatives Error:', error);
    res.json({
      success: true,
      alternatives: [
        {
          originalFood: 'Fried Samosa',
          betterOption: 'Air-Fried Paneer Roll or Roasted Makhana',
          caloriesSaved: 140,
          proteinBoost: 6,
          reason: 'Cuts saturated fats from deep frying while doubling the satiety and protein.',
        },
        {
          originalFood: 'Refined Sugar in Chai',
          betterOption: 'Cardamom Cinnamon Chai (Unsweetened)',
          caloriesSaved: 40,
          proteinBoost: 0,
          reason: 'Natural sweet spices provide warming aroma without insulin spikes.',
        },
        {
          originalFood: 'White Rice (Large Portion)',
          betterOption: '50% Steamed Rice + 50% Sprouts or Brown Rice',
          caloriesSaved: 60,
          proteinBoost: 5,
          reason: 'Adds dietary fiber and sustained energy release throughout the afternoon.',
        },
      ],
    });
  }
});

// 5. AI Nutrition Chat Assistant: "Ask CalorieMate AI"
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, conversationHistory, userProfile, currentLogSummary } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Message cannot be empty' });
  }

  try {
    const systemPrompt = `You are CalorieMate AI, a warm, highly knowledgeable, evidence-based fitness and Indian nutrition coach.
User Context:
- Name: ${userProfile?.name || 'Friend'}
- Goal: ${userProfile?.goal || 'Maintain weight'}
- Preference: ${userProfile?.dietaryPreference || 'Any'}
- Target Calories: ${userProfile?.targetCalories || 2000} kcal (Consumed today: ${currentLogSummary?.totalCalories || 0} kcal, Remaining: ${currentLogSummary?.caloriesRemaining || 0} kcal)
- Protein Goal: ${userProfile?.targetProtein || 120}g (Consumed today: ${currentLogSummary?.totalProtein || 0}g)

Answer questions concisely with actionable advice, realistic food examples (focusing on Indian cuisine when applicable), and clear portions. Use friendly formatting with bullet points.`;

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: systemPrompt,
      },
    });

    // Provide past turns if available
    const promptToSend = `User Question: "${message}"\nKeep response concise, practical and under 150 words.`;
    const response = await chat.sendMessage({
      message: promptToSend,
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({
      success: false,
      error: 'AI Chat error. Please try again.',
      details: error?.message,
    });
  }
});

// --- Start Express & Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CalorieMate server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
