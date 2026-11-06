import { FoodUnit } from '../types';

export interface FoodDatabaseEntry {
  id: string;
  name: string;
  category: 'Grains & Breads' | 'Lentils & Dals' | 'Dairy & Eggs' | 'Meat & Poultry' | 'Breakfast & Snacks' | 'Fruits & Veg' | 'Beverages';
  defaultUnit: FoodUnit;
  defaultServingSize: number;
  unitWeightGrams: number; // weight of 1 defaultUnit in grams
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  fiberPerServing: number;
  isVegetarian: boolean;
  tags: string[];
  healthierAlternative?: string;
  notes?: string;
}

export const INDIAN_FOOD_DATABASE: FoodDatabaseEntry[] = [
  // Breads & Grains
  {
    id: 'roti_chapati',
    name: 'Roti / Chapati (Whole Wheat)',
    category: 'Grains & Breads',
    defaultUnit: 'roti',
    defaultServingSize: 1,
    unitWeightGrams: 35,
    caloriesPerServing: 85,
    proteinPerServing: 3.1,
    carbsPerServing: 16.5,
    fatPerServing: 0.5,
    fiberPerServing: 2.2,
    isVegetarian: true,
    tags: ['roti', 'chapati', 'phulka', 'bread'],
    notes: 'Plain without ghee. Add ~35 kcal if brushed with 1/2 tsp ghee.'
  },
  {
    id: 'roti_ghee',
    name: 'Roti with Ghee (1 tsp)',
    category: 'Grains & Breads',
    defaultUnit: 'roti',
    defaultServingSize: 1,
    unitWeightGrams: 40,
    caloriesPerServing: 125,
    proteinPerServing: 3.1,
    carbsPerServing: 16.5,
    fatPerServing: 5.0,
    fiberPerServing: 2.2,
    isVegetarian: true,
    tags: ['roti', 'chapati with ghee', 'ghee phulka'],
    healthierAlternative: 'Dry roti or brush with only 1/4 tsp cold-pressed oil'
  },
  {
    id: 'steamed_rice',
    name: 'Steamed White Rice',
    category: 'Grains & Breads',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 150,
    caloriesPerServing: 195,
    proteinPerServing: 4.1,
    carbsPerServing: 44.0,
    fatPerServing: 0.4,
    fiberPerServing: 0.8,
    isVegetarian: true,
    tags: ['rice', 'chawal', 'white rice', 'bhat'],
    healthierAlternative: 'Brown rice, quinoa, or cauliflower rice for more fiber'
  },
  {
    id: 'brown_rice',
    name: 'Cooked Brown Rice',
    category: 'Grains & Breads',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 150,
    caloriesPerServing: 165,
    proteinPerServing: 3.8,
    carbsPerServing: 35.0,
    fatPerServing: 1.2,
    fiberPerServing: 2.5,
    isVegetarian: true,
    tags: ['brown rice', 'whole grain rice']
  },
  {
    id: 'aloo_paratha',
    name: 'Aloo Paratha (Medium)',
    category: 'Grains & Breads',
    defaultUnit: 'piece',
    defaultServingSize: 1,
    unitWeightGrams: 120,
    caloriesPerServing: 290,
    proteinPerServing: 6.0,
    carbsPerServing: 42.0,
    fatPerServing: 11.0,
    fiberPerServing: 3.5,
    isVegetarian: true,
    tags: ['paratha', 'aloo paratha', 'stuffed paratha'],
    healthierAlternative: 'Paneer or methi paratha with minimal oil for higher protein'
  },

  // Lentils & Dals
  {
    id: 'yellow_dal_tadka',
    name: 'Dal Tadka / Toor Dal',
    category: 'Lentils & Dals',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 180,
    caloriesPerServing: 160,
    proteinPerServing: 7.8,
    carbsPerServing: 22.0,
    fatPerServing: 4.5,
    fiberPerServing: 4.0,
    isVegetarian: true,
    tags: ['dal', 'daal', 'toor dal', 'dal tadka', 'yellow dal', 'arhar']
  },
  {
    id: 'moong_dal',
    name: 'Moong Dal (Light Yellow)',
    category: 'Lentils & Dals',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 180,
    caloriesPerServing: 140,
    proteinPerServing: 8.5,
    carbsPerServing: 20.0,
    fatPerServing: 2.8,
    fiberPerServing: 4.2,
    isVegetarian: true,
    tags: ['moong', 'moong dal', 'light dal', 'protein']
  },
  {
    id: 'rajma_masala',
    name: 'Rajma Masala (Kidney Beans)',
    category: 'Lentils & Dals',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 200,
    caloriesPerServing: 230,
    proteinPerServing: 11.2,
    carbsPerServing: 34.0,
    fatPerServing: 5.5,
    fiberPerServing: 7.5,
    isVegetarian: true,
    tags: ['rajma', 'rajma chawal', 'kidney beans', 'beans']
  },
  {
    id: 'chole_chana',
    name: 'Chole / Chickpea Curry',
    category: 'Lentils & Dals',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 200,
    caloriesPerServing: 245,
    proteinPerServing: 10.5,
    carbsPerServing: 35.0,
    fatPerServing: 7.0,
    fiberPerServing: 8.0,
    isVegetarian: true,
    tags: ['chole', 'chana masala', 'kabuli chana']
  },

  // Dairy & Eggs
  {
    id: 'paneer_raw',
    name: 'Paneer (Cottage Cheese, Fresh)',
    category: 'Dairy & Eggs',
    defaultUnit: 'g',
    defaultServingSize: 100,
    unitWeightGrams: 100,
    caloriesPerServing: 265,
    proteinPerServing: 18.3,
    carbsPerServing: 3.5,
    fatPerServing: 20.8,
    fiberPerServing: 0,
    isVegetarian: true,
    tags: ['paneer', 'cottage cheese', 'raw paneer'],
    healthierAlternative: 'Low fat paneer or tofu for lower saturated fat'
  },
  {
    id: 'paneer_bhurji',
    name: 'Paneer Bhurji',
    category: 'Dairy & Eggs',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 150,
    caloriesPerServing: 280,
    proteinPerServing: 16.5,
    carbsPerServing: 6.0,
    fatPerServing: 21.0,
    fiberPerServing: 1.5,
    isVegetarian: true,
    tags: ['paneer bhurji', 'paneer scramble']
  },
  {
    id: 'paneer_butter_masala',
    name: 'Paneer Butter Masala',
    category: 'Dairy & Eggs',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 200,
    caloriesPerServing: 380,
    proteinPerServing: 14.0,
    carbsPerServing: 15.0,
    fatPerServing: 30.0,
    fiberPerServing: 2.0,
    isVegetarian: true,
    tags: ['paneer butter masala', 'shahi paneer'],
    healthierAlternative: 'Palak paneer or tandoori paneer tikka with half the fat'
  },
  {
    id: 'curd_dahi',
    name: 'Curd / Dahi (Plain Homemade)',
    category: 'Dairy & Eggs',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 150,
    caloriesPerServing: 98,
    proteinPerServing: 5.2,
    carbsPerServing: 6.8,
    fatPerServing: 5.5,
    fiberPerServing: 0,
    isVegetarian: true,
    tags: ['curd', 'dahi', 'yogurt', 'raita']
  },
  {
    id: 'milk_toned',
    name: 'Milk (Toned, 1 glass)',
    category: 'Dairy & Eggs',
    defaultUnit: 'cup',
    defaultServingSize: 1,
    unitWeightGrams: 250,
    caloriesPerServing: 145,
    proteinPerServing: 7.8,
    carbsPerServing: 12.0,
    fatPerServing: 7.2,
    fiberPerServing: 0,
    isVegetarian: true,
    tags: ['milk', 'doodh', 'toned milk', 'cow milk']
  },
  {
    id: 'boiled_egg_whole',
    name: 'Boiled Egg (Whole, Large)',
    category: 'Dairy & Eggs',
    defaultUnit: 'piece',
    defaultServingSize: 1,
    unitWeightGrams: 50,
    caloriesPerServing: 74,
    proteinPerServing: 6.3,
    carbsPerServing: 0.4,
    fatPerServing: 5.0,
    fiberPerServing: 0,
    isVegetarian: false,
    tags: ['egg', 'boiled egg', 'anda']
  },
  {
    id: 'egg_white',
    name: 'Egg White (Boiled)',
    category: 'Dairy & Eggs',
    defaultUnit: 'piece',
    defaultServingSize: 1,
    unitWeightGrams: 33,
    caloriesPerServing: 17,
    proteinPerServing: 3.6,
    carbsPerServing: 0.2,
    fatPerServing: 0.1,
    fiberPerServing: 0,
    isVegetarian: false,
    tags: ['egg white', 'boiled egg white']
  },
  {
    id: 'egg_omelette_2',
    name: 'Egg Omelette (2 Eggs with Onions/Chilli)',
    category: 'Dairy & Eggs',
    defaultUnit: 'plate',
    defaultServingSize: 1,
    unitWeightGrams: 120,
    caloriesPerServing: 210,
    proteinPerServing: 13.5,
    carbsPerServing: 3.5,
    fatPerServing: 15.8,
    fiberPerServing: 0.5,
    isVegetarian: false,
    tags: ['omelette', 'egg omelette', 'masala omelette']
  },

  // Meat & Poultry
  {
    id: 'chicken_curry',
    name: 'Chicken Curry (Home-style)',
    category: 'Meat & Poultry',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 200,
    caloriesPerServing: 280,
    proteinPerServing: 24.0,
    carbsPerServing: 7.0,
    fatPerServing: 16.5,
    fiberPerServing: 1.2,
    isVegetarian: false,
    tags: ['chicken', 'chicken curry', 'murgh']
  },
  {
    id: 'chicken_breast_grilled',
    name: 'Chicken Breast (Grilled/Tandoori)',
    category: 'Meat & Poultry',
    defaultUnit: 'g',
    defaultServingSize: 150,
    unitWeightGrams: 150,
    caloriesPerServing: 245,
    proteinPerServing: 46.5,
    carbsPerServing: 2.0,
    fatPerServing: 5.2,
    fiberPerServing: 0,
    isVegetarian: false,
    tags: ['chicken breast', 'grilled chicken', 'tandoori chicken', 'high protein']
  },
  {
    id: 'chicken_biryani',
    name: 'Chicken Biryani (Standard Plate)',
    category: 'Meat & Poultry',
    defaultUnit: 'plate',
    defaultServingSize: 1,
    unitWeightGrams: 350,
    caloriesPerServing: 560,
    proteinPerServing: 28.0,
    carbsPerServing: 64.0,
    fatPerServing: 21.0,
    fiberPerServing: 3.5,
    isVegetarian: false,
    tags: ['biryani', 'chicken biryani', 'dum biryani'],
    healthierAlternative: 'Grilled chicken with brown rice and cucumber raita'
  },

  // Breakfast & Snacks
  {
    id: 'idli',
    name: 'Idli (Steamed Rice & Urad Dal)',
    category: 'Breakfast & Snacks',
    defaultUnit: 'piece',
    defaultServingSize: 2,
    unitWeightGrams: 50,
    caloriesPerServing: 130, // for 2 idlis
    proteinPerServing: 4.2,
    carbsPerServing: 26.8,
    fatPerServing: 0.4,
    fiberPerServing: 1.8,
    isVegetarian: true,
    tags: ['idli', 'steamed idli', 'south indian breakfast']
  },
  {
    id: 'masala_dosa',
    name: 'Masala Dosa with Potato Filling',
    category: 'Breakfast & Snacks',
    defaultUnit: 'plate',
    defaultServingSize: 1,
    unitWeightGrams: 180,
    caloriesPerServing: 320,
    proteinPerServing: 6.5,
    carbsPerServing: 48.0,
    fatPerServing: 11.5,
    fiberPerServing: 3.2,
    isVegetarian: true,
    tags: ['dosa', 'masala dosa', 'crispy dosa']
  },
  {
    id: 'plain_dosa',
    name: 'Plain Dosa',
    category: 'Breakfast & Snacks',
    defaultUnit: 'plate',
    defaultServingSize: 1,
    unitWeightGrams: 120,
    caloriesPerServing: 210,
    proteinPerServing: 5.2,
    carbsPerServing: 34.0,
    fatPerServing: 6.0,
    fiberPerServing: 2.0,
    isVegetarian: true,
    tags: ['plain dosa', 'sada dosa']
  },
  {
    id: 'poha',
    name: 'Poha (Flattened Rice with Peanuts & Veggies)',
    category: 'Breakfast & Snacks',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 160,
    caloriesPerServing: 240,
    proteinPerServing: 5.2,
    carbsPerServing: 42.0,
    fatPerServing: 6.5,
    fiberPerServing: 2.8,
    isVegetarian: true,
    tags: ['poha', 'kanda poha', 'aval']
  },
  {
    id: 'upma',
    name: 'Upma (Semolina / Rava with Veggies)',
    category: 'Breakfast & Snacks',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 160,
    caloriesPerServing: 220,
    proteinPerServing: 5.0,
    carbsPerServing: 38.0,
    fatPerServing: 5.8,
    fiberPerServing: 2.2,
    isVegetarian: true,
    tags: ['upma', 'rava upma', 'sooji upma']
  },
  {
    id: 'samosa',
    name: 'Samosa (Fried Potato & Pea)',
    category: 'Breakfast & Snacks',
    defaultUnit: 'piece',
    defaultServingSize: 1,
    unitWeightGrams: 90,
    caloriesPerServing: 260,
    proteinPerServing: 3.8,
    carbsPerServing: 31.0,
    fatPerServing: 14.0,
    fiberPerServing: 2.0,
    isVegetarian: true,
    tags: ['samosa', 'fried samosa', 'snack'],
    healthierAlternative: 'Air-fried paneer roll, roasted makhana, or steamed dhokla'
  },
  {
    id: 'biscuits_marie',
    name: 'Marie Biscuits (2 pieces)',
    category: 'Breakfast & Snacks',
    defaultUnit: 'piece',
    defaultServingSize: 2,
    unitWeightGrams: 20,
    caloriesPerServing: 84,
    proteinPerServing: 1.6,
    carbsPerServing: 15.6,
    fatPerServing: 1.8,
    fiberPerServing: 0.5,
    isVegetarian: true,
    tags: ['biscuits', 'biscuit', 'marie', 'tea biscuit']
  },
  {
    id: 'biscuits_digestive',
    name: 'Digestive Biscuits (2 pieces)',
    category: 'Breakfast & Snacks',
    defaultUnit: 'piece',
    defaultServingSize: 2,
    unitWeightGrams: 30,
    caloriesPerServing: 140,
    proteinPerServing: 2.2,
    carbsPerServing: 20.0,
    fatPerServing: 6.0,
    fiberPerServing: 1.8,
    isVegetarian: true,
    tags: ['digestive biscuit', 'oat biscuit']
  },

  // Fruits & Veg
  {
    id: 'banana',
    name: 'Banana (1 Medium)',
    category: 'Fruits & Veg',
    defaultUnit: 'piece',
    defaultServingSize: 1,
    unitWeightGrams: 118,
    caloriesPerServing: 105,
    proteinPerServing: 1.3,
    carbsPerServing: 27.0,
    fatPerServing: 0.3,
    fiberPerServing: 3.1,
    isVegetarian: true,
    tags: ['banana', 'kela', 'fruit', 'pre-workout']
  },
  {
    id: 'apple',
    name: 'Apple (1 Medium)',
    category: 'Fruits & Veg',
    defaultUnit: 'piece',
    defaultServingSize: 1,
    unitWeightGrams: 180,
    caloriesPerServing: 95,
    proteinPerServing: 0.5,
    carbsPerServing: 25.0,
    fatPerServing: 0.3,
    fiberPerServing: 4.4,
    isVegetarian: true,
    tags: ['apple', 'seb', 'fruit']
  },
  {
    id: 'green_salad',
    name: 'Fresh Mixed Salad (Cucumber, Tomato, Carrot)',
    category: 'Fruits & Veg',
    defaultUnit: 'bowl',
    defaultServingSize: 1,
    unitWeightGrams: 150,
    caloriesPerServing: 45,
    proteinPerServing: 1.8,
    carbsPerServing: 9.0,
    fatPerServing: 0.4,
    fiberPerServing: 3.2,
    isVegetarian: true,
    tags: ['salad', 'cucumber', 'kachumber']
  },

  // Beverages
  {
    id: 'chai_with_sugar',
    name: 'Masala Chai with Milk & 1 tsp Sugar',
    category: 'Beverages',
    defaultUnit: 'cup',
    defaultServingSize: 1,
    unitWeightGrams: 150,
    caloriesPerServing: 90,
    proteinPerServing: 3.0,
    carbsPerServing: 12.0,
    fatPerServing: 3.5,
    fiberPerServing: 0,
    isVegetarian: true,
    tags: ['chai', 'tea', 'masala chai', 'milk tea'],
    healthierAlternative: 'Chai without added refined sugar or green tea with lemon'
  },
  {
    id: 'chai_no_sugar',
    name: 'Masala Chai (Toned Milk, No Sugar)',
    category: 'Beverages',
    defaultUnit: 'cup',
    defaultServingSize: 1,
    unitWeightGrams: 150,
    caloriesPerServing: 55,
    proteinPerServing: 3.0,
    carbsPerServing: 4.5,
    fatPerServing: 3.2,
    fiberPerServing: 0,
    isVegetarian: true,
    tags: ['sugar-free tea', 'chai without sugar']
  },
  {
    id: 'buttermilk_chaas',
    name: 'Spiced Buttermilk / Chaas',
    category: 'Beverages',
    defaultUnit: 'cup',
    defaultServingSize: 1,
    unitWeightGrams: 200,
    caloriesPerServing: 45,
    proteinPerServing: 2.8,
    carbsPerServing: 4.0,
    fatPerServing: 1.8,
    fiberPerServing: 0.2,
    isVegetarian: true,
    tags: ['chaas', 'buttermilk', 'mattha', 'digestive']
  }
];

// Helper to look up food by search string
export function searchFoodDatabase(query: string): FoodDatabaseEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return INDIAN_FOOD_DATABASE.slice(0, 15);
  
  return INDIAN_FOOD_DATABASE.filter(item => {
    return (
      item.name.toLowerCase().includes(q) ||
      item.tags.some(tag => tag.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });
}

// Helper to calculate nutrition for given quantity and unit
export function calculateEntryNutrition(
  entry: FoodDatabaseEntry,
  quantity: number,
  unit: FoodUnit
): { calories: number; protein: number; carbs: number; fat: number; fiber: number } {
  let multiplier = 1;

  if (unit === entry.defaultUnit) {
    multiplier = quantity / entry.defaultServingSize;
  } else if (unit === 'g') {
    // If unit is grams, base on unitWeightGrams
    const totalGramsInDefault = entry.unitWeightGrams * entry.defaultServingSize;
    multiplier = quantity / (totalGramsInDefault || 100);
  } else if (unit === 'bowl' || unit === 'cup') {
    // ~150-180g standard
    multiplier = quantity * (160 / entry.unitWeightGrams);
  } else if (unit === 'piece' || unit === 'roti') {
    multiplier = quantity;
  } else if (unit === 'plate') {
    multiplier = quantity * 1.5;
  } else if (unit === 'ml') {
    multiplier = quantity / 250;
  } else {
    multiplier = quantity / entry.defaultServingSize;
  }

  // Ensure positive values rounded to 1 decimal place
  const factor = Math.max(0.1, multiplier);
  return {
    calories: Math.round(entry.caloriesPerServing * factor),
    protein: Math.round(entry.proteinPerServing * factor * 10) / 10,
    carbs: Math.round(entry.carbsPerServing * factor * 10) / 10,
    fat: Math.round(entry.fatPerServing * factor * 10) / 10,
    fiber: Math.round(entry.fiberPerServing * factor * 10) / 10,
  };
}
