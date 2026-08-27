import { assets } from './assets';
export const products = [
  {
    id: 1,
    name: 'Rohu (Live***)',
    category: 'Live Fish',
    price: '120 - 122',
    image: assets. rohu_freshwater,
    sizes: ['S', 'M', 'L'],
    min: 500,
    max: 10000,
    bestseller : true,
    description: {
    overview: 'Popular freshwater carp with a mild flavor and medium bones. Widely eaten in India, especially in Bengal & Andhra. Improves vision, bone strength, and heart health.',
      proteins: "17–20g per 100g",
      calories: '97 kcal',
      vitamins: 'Vitamin A, Vitamin D, Vitamin B12',
  minerals: 'Calcium, Phosphorus, Potassium, Iron',
  uses: 'Curries, fried, baked, grilled, Bengali and Odia style preparations',
  benefits: [
    "Rich source of lean protein for muscle growth and repair",
    "Omega-3 fatty acids support heart and brain health",
    "Vitamins A & D promote eye, skin, and immune health",
    "Phosphorus and calcium strengthen bones and teeth",
    "Low in saturated fat, good for a balanced diet",
    "Widely accepted fish for regular consumption in Indian households",
  ]
  }
  },
  {
    id: 2,
    name: 'Katla',
    category: 'Fresh Water Fish',
    price: '130 - 150',
    sizes: ['S', 'M', 'L'],
    image: assets. katla_freshwater,
    min: 500,
    max: 10000,
    bestseller : true,
    description: {
    overview: 'Large freshwater carp with a rich flavor and firm flesh. A popular Indian carp, native to rivers of North India. Great source of Vitamin A, minerals, and low-fat protein.',
     proteins: '18-20g per 100g',
  calories: '112 kcal',
  vitamins: 'Vitamin A, Vitamin D, Vitamin B12',
  minerals: 'Phosphorus, Calcium, Potassium, Iron',
  uses: 'Curries, fried, grilled, steamed, festive and traditional dishes',
  benefits: [
    "Excellent source of high-quality protein for muscle repair",
    "Rich in omega-3 fatty acids that support heart and brain health",
    "Vitamin A improves vision and immunity",
    "Vitamin D and calcium strengthen bones and teeth",
    "Iron supports healthy blood circulation",
    "Widely enjoyed for its taste and cultural significance in Indian cuisine",
  ]
   }
  },
  {
    id: 3,
    name: 'Pandugappa (2.5-3.5kg)',
    category: 'Fresh Water Fish',
    price: '400 - 450',
    image: assets.pandugappa,
    min: 20,
    max: 1000,
    bestseller : false,
    description: {
    overview: 'Local Indian freshwater fish, flavorful and oily – rich in heart-friendly fats.',
    proteins: '22g per 100g', 
    calories: '110-120 kcal',
vitamins: 'Vitamins A, B complex, D', 
minerals: 'Potassium, Selenium, Phosphorus, Calcium', 
uses: 'Grilling, baking, steaming, curry', 
benefits: [
"Supports heart health via omega-3 fatty acids",
      "Helps in brain function and memory",
      "Lean protein supports muscle repair",
      "Rich in minerals for bone and metabolic health",
 ] }
  },
  {
    id: 4,
    name: 'Tuna',
    category: 'Sea Fish',
    price: '210 - 240',
    image: assets.tuna_seawater,
    min: 20,
    max: 1000,
    bestseller : true,
    description: {
    overview: 'Popular globally. Excellent protein source, packed with Vitamin D & omega-3, supports brain function.',
    proteins: "23.38 g per 100 g (raw)",
    calories: '108 kcal',
    vitamins: "B-complex, small amounts of A, C, D, others",
    minerals: "Calcium, Iron, Potassium, Selenium, etc.",
    uses: "Grilling, searing, stews, sushi, canned preparations",
    benefits: [
      "Lean high-quality protein source",
      "Supports heart health via omega-3 fats",
      "Supports brain and cognition",
      "Helps with immune function and metabolism",
      "Good for weight management"
 ] 
}
  },
  {
    id: 5,
    name: 'Maga (Indian Salmon)',
    category: 'sea Fish',
    price: '600 - 700',
    image: assets.maga_seawater,
    min: 20,
    max: 100,
    bestseller : true,
    description: {
    overview: ' Deep-sea fish, oily and full of healthy fats. Helps in cholesterol management.',
     proteins: '20-22g per 100g',
  calories: '142 kcal',
  vitamins: 'Vitamin D, Vitamin B12, Niacin, Vitamin A',
  minerals: 'Selenium, Phosphorus, Potassium, Iron',
  uses: 'Grilled, fried, baked, in curries, kebabs, tandoori dishes',
  benefits: [
    "Excellent source of high-quality protein for muscle growth",
    "Rich in omega-3 fatty acids that support heart health",
    "Vitamin D and calcium help in maintaining strong bones",
    "Vitamin B12 supports blood and nervous system health",
    "Improves brain function and reduces inflammation",
    "Delicious, premium fish suitable for festive and special meals",
  ]
  }
},
  {
    id: 6,
    name: 'Indian Mackerel',
    category: 'Sea Fish',
    price: '330 - ₹370',
    image: assets.indian_mackerel_seawater, 
    min: 20,
    max: 100,
    bestseller : false,
    description: {
    overview: 'Very common on Indian coasts. Excellent for omega-3, Vitamin B12, brain and heart health.',
    proteins: '18.5-22 gg per 100g', 
    calories: '141 kcal',
vitamins: 'Vitamin D, B12, some B complex (B1, B2, B3)', 
minerals: 'Omega-3, Selenium, Phosphorus, Calcium', 
uses: 'Fry, Curry, Tawa fry, Grilled, steamed', 
benefits: [
 "Supports heart health with omega-3 fatty acids",
      "Boosts brain and cognitive function",
      "Improves bone strength",
      "Enhances immunity & antioxidant protection",
      "Good for skin, hair, and eye health",
      "Helps in maintaining weight and satiety"
 ] }
  },
  {
    id: 7,
    name: 'Pabda (Indian Butterfish)',
    category: 'Kolkata Fish',
    price: '700 - ₹800',
    image: assets.pabda, 
    min: 20,
    max: 100,
    bestseller : true,
    description: {
    overview: 'Native to Bengal rivers. Soft meat, low bones, highly nutritious.',
    proteins: '18–19g per 100g',
    calories: '114 kcal',
vitamins: 'Vitamin A, B', 
minerals: 'potassium, sodium, magnesium', 
uses: 'Curries, Tel Jhaal, light stews', 
benefits: [
"Supports heart health via healthy fats",
      "Lean protein for muscle repair & growth",
      "Boosts immunity & metabolic function",
      "Provides essential minerals for body balance"
]}
  },
  {
    id: 8,
    name: 'Ari (Catfish)',
    category: 'Kolkata Fish',
    price: '700 - ₹800',
    image: assets.ari, 
    min: 20,
    max: 100,
    bestseller : true,
    description: {
    overview: 'Found in Ganga basin. High in omega-3 and vitamins, strengthens immunity.',
    proteins: '22g per 100g', 
    calories: '99 kcal',
vitamins: 'Vitamin D, A, B-complex (Thiamine, Riboflavin, Niacin', 
minerals: 'Calcium, Phosphorus, Potassium, Magnesium', 
uses: 'Grill, Curry, Fry, Bake', 
benefits:[ 
 "High-quality lean protein",
      "Supports metabolism and immune system",
      "Contributes to bone, nerve & muscle health",
      "Good for weight management",
      "Helps provide essential vitamins and minerals"
    ]
  }
  },
  {
    id: 9,
    name: 'Mud Crabs (2 piece/kg)',
    category: 'Crabs',
    price: '750 - ₹800',
    image: assets.mud_crabs,
    min: 20,
    max: 100,
    bestseller : true,
     description: {
    overview: 'Found in mangroves, sweet and firm meat. Rich in zinc, boosts immunity.',
    proteins: '18g per 100g', 
    calories: '89 kcal',
vitamins: 'Vitamin B complex, trace vitamins', 
minerals: 'Selenium, Zinc, Phosphorus, Calcium, Iron, Magnesium', 
uses: 'Steaming, boiling, grilling, curries, crab soups', 
benefits:[ 
"High-quality lean protein for muscle repair",
      "Supports bone & blood health via minerals",
      "Boosts immunity through trace minerals and antioxidants",
      "Helps with metabolism & thyroid via selenium",
      "Contributes to heart & brain health with omega-3s",
      "May reduce inflammation and oxidative stress"
     ]
    }
  },
  {
    id: 10,
    name: 'Tiger Shrimp',
    category: 'Prawns',
    price: '500',
    image: assets.tiger_shrimp, 
    min: 200,
    max: 500,
    bestseller : true,
    description: {
    overview: 'Large prawns with striped shell. Rich in antioxidants and omega-3.',
    proteins: '18g per 100g', 
    calories: '141 kcal',
vitamins: '"B-complex vitamins, antioxidants', 
minerals: 'Calcium, Iron, Selenium', 
uses: 'Grilling, frying, steaming, prawn curries, sautés', 
benefits: [
 "High-quality lean protein supportive of muscle repair",
      "Low in calories and fat — good for weight management",
      "Rich in minerals for bone, blood & metabolic health",
      "Contains antioxidants and anti-inflammatory compounds",
      "Supports heart and brain health",
      "Helps in immune function and metabolism",
]
  }
  },

  {
    id: 11,
    name: 'Tullu',
    category: 'Fresh Water Fish',
    price: '130',
    image: assets.tullu_freshwater,
    min: 20,
    max: 500,
    bestseller : false,
    description: {
    overview: 'A small native fish from Andhra/Telangana rivers. High in calcium & phosphorus, good for children and bone health.',
    proteins: '16–17 g per 100g', 
    calories: '130 kcal',
vitamins: 'Vitamin B-complex(B1, B2, B12), some Vitamin A, Vitamin D', 
minerals: 'Calcium, Phosphorus, Potassium, Iron', 
uses: 'Curry, fry, steam, grill', 
benefits: [
"Provides lean, high-quality protein",
      "Supports metabolism and energy via vitamins",
      "Aids bone & teeth health via minerals",
      "Helps immune & antioxidant function",
      "Supports nerve & muscle activity"
    ]
  }
  },
  {
    id: 12,
    name: 'Grass Craft (Gaddi Chepa 2.5-3kg)',
    category: 'Fresh Water Fish',
    price: '130',
    image: assets.grass_craft_gaddi_chepa,
    min: 20,
    max: 1000,
    bestseller : false,
    description: {
    overview: 'Herbivorous fish from freshwater ponds. Lean meat, good for weight management and digestion.',
    protiens: '16-20g per 100g', 
    calories: '90-110 kcal',
vitamins: 'B-complex (especially B12, B6), Vitamin A, D', 
minerals: 'Calcium, Potassium, Phosphorus, Iron', 
uses: 'Curry, fry, steam, grill', 
benefits: [
"Provides lean protein for muscle repair",
      "Supports bone & teeth health",
      "Helps boost immunity through vitamins and minerals",
      "Low to moderate fat — good for balanced diets",
      "Contributes to vision & red blood cell health",
      "Helps with metabolic and heart health via minerals"
    ]
  }
  },
  {
    id: 13,
    name: 'Grass Craft (Gaddi Chepa 2.5-3kg) (Live***)',
    category: 'Live Fish',
    price: '130',
    image: assets.grass_craft_gaddi_chepa,
    min: 20,
    max: 1000,
    bestseller : true,
    description: {
    overview: 'Herbivorous fish from freshwater ponds. Lean meat, good for weight management and digestion.',
   protiens: '16-20g per 100g', 
    calories: '90-110 kcal',
vitamins: 'B-complex (especially B12, B6), Vitamin A, D', 
minerals: 'Calcium, Potassium, Phosphorus, Iron', 
uses: 'Curry, fry, steam, grill', 
benefits: [
"Provides lean protein for muscle repair",
      "Supports bone & teeth health",
      "Helps boost immunity through vitamins and minerals",
      "Low to moderate fat — good for balanced diets",
      "Contributes to vision & red blood cell health",
      "Helps with metabolic and heart health via minerals"
    
    ]
  }
  },
  {
    id: 14,
    name: 'Miriga (Mosu 2.5-3kg)',
    category: 'Fresh Water Fish',
    price: '130',
    image: assets.miriga_mosu,
    min: 20,
    max: 1000,
    bestseller : false,
    description: {
    overview: 'Regional freshwater fish, soft flesh, known for delicate taste and high protein content.',
    proteins: '18-20g per 100g', 
    calories: '120-150 kcal',
vitamins: 'Vitamin B(including B12, Niacin), Vitamin A', 
minerals: 'Good source of Phosphorus, Potassium, Calcium', 
uses: 'Curries, fry, steam, grill', 
benefits: [
 "High-quality lean protein for muscle repair and growth",
      "Supports bone & teeth health",
      "Helps energy metabolism and nerve function",
      "Low fat – suitable for balanced diets",
      "Versatile for many recipes preserving nutrients"
    ]
  }
  },
  {
    id: 15,
    name: 'Miriga (Mosu 2.5-3kg) (Live***)',
    category: 'Live Fish',
    price: '130',
    image: assets.miriga_mosu,
    min: 20,
    max: 1000,
    bestseller : true,
    description: {
    overview: 'Regional freshwater fish, soft flesh, known for delicate taste and high protein content.',
    proteins: '18-20g per 100g', 
    calories: '120-150 kcal',
vitamins: 'Vitamin B(including B12, Niacin), Vitamin A', 
minerals: 'Good source of Phosphorus, Potassium, Calcium', 
uses: 'Curries, fry, steam, grill', 
benefits: [
 "High-quality lean protein for muscle repair and growth",
      "Supports bone & teeth health",
      "Helps energy metabolism and nerve function",
      "Low fat – suitable for balanced diets",
      "Versatile for many recipes preserving nutrients"
    ]
  }
  },
  {
    id: 16,
    name: 'Rupchand (Pomfret Freshwater variant)',
    category: 'Fresh Water Fish',
    price: '100 - ₹105',
    image: assets.rupchand, 
    min: 20,
    max: 1000,
    bestseller : true,
    description: {
    overview: 'Mild taste, less bones, rich in omega-3 – great for grilling and frying.',
    proteins: '18-20g per 100g', 
    calories: '118 kcal',
vitamins: 'Vitamin B12,  Vitamin A, Niacin, small amounts of Vitamin D', 
minerals: 'Selenium, Phosphorus, Potassium, calcium', 
uses: 'Grilled, fried, steamed, in curries, tawa fry, Bengali-style preparations', 
benefits:[ 
 "Good lean protein source for muscle repair & growth",
      "Supports heart health via omega-3 fatty acids",
      "Helps red blood cell formation & neurological health via B12",
      "Supports bone & metabolic health through minerals",
      "Helps with immune function, skin, and eye health",
      "Balanced fat & moderate cholesterol",
]
  }
},
  {
    id: 17,
    name: 'Tilapi',
    category: 'Fresh Water Fish',
    price: '50 - ₹60',
    image: assets.tilapi, 
    min: 20,
    max: 1000,
    bestseller : false,
     description: {
    overview: 'Farm-raised freshwater fish, very mild flavor. High in lean protein, low calories, supports weight loss.',
  proteins: '20–22g per 100g', 
calories: '128 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin, small amounts of Vitamin A',
  minerals: 'Phosphorus, Potassium, Selenium, Magnesium, Calcium',
  uses: 'Grilled, fried, steamed, in curries, tawa fry, baked dishes',
  benefits: [
    "High-quality lean protein for muscle growth and repair",
    "Supports heart health through omega-3 and balanced fat content",
    "B12 content aids red blood cell formation & neurological function",
    "Minerals support bone strength and metabolic health",
    "Helps maintain skin, eye, and immune health",
    "Low in mercury compared to some other fish, safer for regular consumption",
  ] 
  }

  },
  {
    id: 18,
    name: 'Pangas (Basa / Pangasius) ',
    category: 'Fresh Water Fish',
    price: '100 - ₹105',
    image: assets.pangas, 
    min: 20,
    max: 1000,
    bestseller : false,
     description: {
    overview: ' Vietnamese freshwater fish, boneless fillets are common. Affordable, mild taste, protein-rich.',
    proteins: '15–18g per 100g', 
calories: '105 kcal',
  vitamins: 'Vitamin D, Vitamin B12, Niacin, small amounts of Vitamin A',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Curries, fried fillets, grilled, steamed, soups, pakoras',
  benefits: [
    "Affordable source of lean protein",
    "Mild taste makes it kid-friendly and versatile in cooking",
    "Supports heart health with omega-3 fatty acids (in moderate amounts)",
    "Helps bone and muscle maintenance through phosphorus and calcium",
    "Vitamin B12 supports energy, brain, and blood health",
    "Easily digestible and low in fat",
  ]
    }
  },
  {
    id: 19,
    name: 'Rohu',
    category: 'Fresh Water Fish',
    price: '120 - ₹122',
    image: assets.rohu_freshwater, 
    min: 500,
    max: 10000,
    bestseller : true,
     description: {
    overview: 'Popular freshwater carp with a mild flavor and medium bones. Widely eaten in India, especially in Bengal & Andhra. Improves vision, bone strength, and heart health.',
      proteins: "17–20g per 100g",
      calories: '97 kcal',
      vitamins: 'Vitamin A, Vitamin D, Vitamin B12',
  minerals: 'Calcium, Phosphorus, Potassium, Iron',
  uses: 'Curries, fried, baked, grilled, Bengali and Odia style preparations',
  benefits: [
    "Rich source of lean protein for muscle growth and repair",
    "Omega-3 fatty acids support heart and brain health",
    "Vitamins A & D promote eye, skin, and immune health",
    "Phosphorus and calcium strengthen bones and teeth",
    "Low in saturated fat, good for a balanced diet",
    "Widely accepted fish for regular consumption in Indian households",
  ]
  }
  },
  
  {
    id: 20,
    name: 'Katla (Live***)',
    category: 'Live Fish',
    price: '130 - ₹150',
    image: assets.katla_freshwater,
    min: 500,
    max: 10000,
    bestseller : true,
     description: {
    overview: 'Large freshwater carp with a rich flavor and firm flesh. A popular Indian carp, native to rivers of North India. Great source of Vitamin A, minerals, and low-fat protein.',
     proteins: '18-20g per 100g',
  calories: '112 kcal',
  vitamins: 'Vitamin A, Vitamin D, Vitamin B12',
  minerals: 'Phosphorus, Calcium, Potassium, Iron',
  uses: 'Curries, fried, grilled, steamed, festive and traditional dishes',
  benefits: [
    "Excellent source of high-quality protein for muscle repair",
    "Rich in omega-3 fatty acids that support heart and brain health",
    "Vitamin A improves vision and immunity",
    "Vitamin D and calcium strengthen bones and teeth",
    "Iron supports healthy blood circulation",
    "Widely enjoyed for its taste and cultural significance in Indian cuisine",
  ]
   }
  },
  {
    id: 21,
    name: 'Vanjiram  (Seer Fish/King Mackerel)',
    category: 'Sea Fish',
    price: '700 - ₹1100',
    image: assets.vanjiram_seawater,
    min: 20,
    max: 500,
    bestseller : true,
    description: {
    overview: 'Premium sea fish with firm, boneless flesh and rich taste – considered one of the most popular and expensive fishes in South India.',
  proteins: '20-21g per 100g',
  calories: '134 kcal',
  vitamins: 'Vitamin D, Vitamin B12, Niacin, small amounts of Vitamin A',
  minerals: 'Selenium, Phosphorus, Potassium, Calcium',
  uses: 'Fried, grilled, baked, tawa fry, curries, biryani-style dishes',
  benefits: [
    "High in protein, supports muscle growth and repair",
    "Rich in omega-3 fatty acids for heart and brain health",
    "Vitamin B12 supports healthy blood cells and nerve function",
    "Vitamin D and phosphorus maintain bone health",
    "Low in bones, making it easy to eat for all age groups",
    "Premium taste and widely loved in Indian coastal cuisine",
  ]
  }
  },
  {
    id: 22,
    name: 'Sole Fish (Nangu)',
    category: 'Sea Fish',
    price: '220 - ₹250',
    image: assets.sole_fish_nangu, 
    min: 20,
    max: 100,
    bestseller : false,
    description: {
    overview: 'Flat-bodied sea fish with delicate, mild flavor and fine texture – often enjoyed fried or grilled.',
  proteins: '18-20g per 100g',
  calories: '99 kcal',
  vitamins: 'Vitamin B12, Niacin, Vitamin D, small amounts of Vitamin A',
  minerals: 'Phosphorus, Selenium, Potassium, Magnesium',
  uses: 'Shallow fried, grilled, steamed, tawa fry, continental-style fillets',
  benefits: [
    "Lean protein source that aids muscle repair and growth",
    "Low in fat and calories, good for weight-conscious diets",
    "Vitamin B12 supports healthy nerves and blood formation",
    "Omega-3 and minerals improve heart and brain health",
    "Easy to digest, suitable for children and elderly",
    "Mild taste makes it versatile for multiple cuisines",
  ]
  }
  },
  {
    id: 23,
    name: 'Ribbon',
    category: 'Sea Fish',
    price: '300 - ₹350',
    image: assets.ribbon_seawater, 
    min: 20,
    max: 100,
    bestseller : false,
    description: {
    overview: 'Long, silver, ribbon-shaped fish with soft flesh and mild flavor – commonly used in coastal cuisines of India.',
  proteins: '17-19g per 100g',
  calories: '105 kcal',
  vitamins: 'Vitamin B12, Niacin, Vitamin D',
  minerals: 'Phosphorus, Selenium, Calcium, Potassium',
  uses: 'Curries, fried, grilled, fish cutlets, coastal-style recipes',
  benefits: [
    "Good source of lean protein for muscle health",
    "Supports heart function with omega-3 fatty acids",
    "Vitamin B12 aids nerve and red blood cell health",
    "Minerals like phosphorus and calcium strengthen bones",
    "Low in fat, easy to digest, suitable for daily cooking",
    "Popular coastal delicacy with unique flavor profile",
  ]
  }
  },
  {
    id: 24,
    name: 'Para',
    category: 'Sea Fish',
    price: '250 - ₹280',
    image: assets.para_seawater,
    min: 20,
    max: 100,
    bestseller : false,
    description: {
    overview: 'Medium-sized sea fish with firm, tasty flesh and few bones – popular in coastal curries and fries.',
  proteins: '18-20g per 100g',
  calories: '115 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Curries, fried, grilled, baked, coastal-style spicy preparations',
  benefits: [
    "High-quality protein for muscle repair and strength",
    "Omega-3 fatty acids support heart and brain function",
    "Vitamin B12 boosts nerve and blood health",
    "Phosphorus and calcium help maintain bone strength",
    "Low in bones, easy to eat and cook",
    "Widely loved in South Indian and coastal cuisines",
  ]
  }
  },
  {
    id: 25,
    name: 'Nemali Pincham',
    category: 'Sea Fish',
    price: '210 - ₹300',
    image: assets.nemalipincham_seawater,
    min: 20,
    max: 1000,
    bestseller : false,
     description: {
    overview: 'Colorful sea fish resembling peacock feathers in its fins – mild flavor and soft flesh, popular in curries and fries.',
  proteins: '18-20g per 100g',
  calories: '110 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin, Vitamin A (small amounts)',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Curries, fried, grilled, tawa fry, coastal-style masala dishes',
  benefits: [
    "Rich in lean protein, helps muscle growth and repair",
    "Contains omega-3 fatty acids that support heart health",
    "Vitamin B12 improves nerve function and red blood cell health",
    "Minerals like phosphorus and calcium strengthen bones and teeth",
    "Low in fat, suitable for regular consumption",
    "Attractive appearance and tasty flesh make it a coastal favorite",
  ]
    }
  },
  {
    id: 26,
    name: 'Methadulu',
    category: 'Sea Fish',
    price: '170 - ₹200',
    image: assets.methadulu_seawater,
    min: 10,
    max: 100,
    bestseller : true,
    description: {
   overview: 'Medium-sized sea fish with soft, slightly oily flesh and mild flavor – commonly used in curries and shallow fry.',
  proteins: '17-19g per 100g',
  calories: '110 kcal',
  vitamins: 'Vitamin B12, Niacin, Vitamin D',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Curries, shallow fried, tawa fry, coastal-style preparations',
  benefits: [
    "Good source of lean protein for muscle health",
    "Supports heart health with omega-3 fatty acids",
    "Vitamin B12 supports blood formation and nervous system",
    "Phosphorus and calcium strengthen bones and teeth",
    "Low fat and mild taste, suitable for everyday cooking",
    "Widely consumed in South Indian coastal cuisine",
  ]
  }
  },
  {
    id: 27,
    name: 'Madugu',
    category: 'Sea Fish',
    price: '200 - ₹350',
    image: assets.madugu_seawater,
    min: 20,
    max: 100,
    bestseller : false,
    description: {
  overview: 'Sea fish with firm, flavorful flesh – suitable for frying, grilling, and coastal-style curries.',
  proteins: '18-20g per 100g',
  calories: '125 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Grilled, fried, baked, curries, tawa fry, coastal masala dishes',
  benefits: [
    "Good source of high-quality protein for muscle repair",
    "Supports heart and brain health with omega-3 fatty acids",
    "Vitamin B12 aids red blood cell formation and nerve function",
    "Minerals like phosphorus and calcium strengthen bones and teeth",
    "Low in fat, making it ideal for regular consumption",
    "Delicious and versatile for multiple sea fish recipes",
  ]
}
  },
  {
    id: 28,
    name: 'Kanugurthu (Threadfin)',
    category: 'Sea Fish',
    price: '300 - ₹400',
    image: assets.kanugurthu_seawater,
    min: 20,
    max: 100,
    bestseller : false,
     description: {
    overview: 'Medium-sized sea fish with firm, white flesh and mild flavor – ideal for grilling, frying, and curries.',
  proteins: '19-21g per 100g',
  calories: '120 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin, small amounts of Vitamin A',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Grilled, fried, baked, in curries, tawa fry, coastal-style dishes',
  benefits: [
    "Rich source of lean protein for muscle repair and growth",
    "Omega-3 fatty acids support heart and brain health",
    "Vitamin B12 aids in blood formation and nerve function",
    "Minerals like phosphorus and calcium help strengthen bones",
    "Low fat and easy to digest, suitable for all age groups",
    "Popular in South Indian coastal cuisine for its taste and texture",
  ]
}
  },
  {
    id: 29,
    name: 'Guruva (Goraka)',
    category: 'Sea Fish',
    price: '220 - ₹250',
    image: assets.guruva_goraka,
    min: 20,
    max: 100,
    bestseller : false,
    description: {
  overview: 'Medium-sized sea fish with firm flesh and mild taste – commonly used in coastal curries and fried preparations.',
  proteins: '18-20g per 100g',
  calories: '118 kcal',
  vitamins: 'Vitamin B12, Niacin, Vitamin D, small amounts of Vitamin A',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Curries, shallow fried, grilled, tawa fry, coastal-style masala dishes',
  benefits: [
    "Good source of high-quality protein for muscle growth and repair",
    "Omega-3 fatty acids support heart and brain health",
    "Vitamin B12 aids nerve function and blood formation",
    "Minerals like phosphorus and calcium strengthen bones",
    "Low fat, easily digestible, suitable for daily consumption",
    "Widely enjoyed in South Indian coastal cuisine",
  ]
}
  },
  {
    id: 30,
    name: 'Mud Crabs (3 piece/kg)',
    category: 'Crabs',
    price: '650 - ₹700',
    image: assets.mud_crabs,
    min: 20,
    max: 100,
    bestseller : false,
     description: {
    overview: 'Found in mangroves, sweet and firm meat. Rich in zinc, boosts immunity.',
    proteins: '18g per 100g', 
    calories: '89 kcal',
vitamins: 'Vitamin B complex, trace vitamins', 
minerals: 'Selenium, Zinc, Phosphorus, Calcium, Iron, Magnesium', 
uses: 'Steaming, boiling, grilling, curries, crab soups', 
benefits:[ 
"High-quality lean protein for muscle repair",
      "Supports bone & blood health via minerals",
      "Boosts immunity through trace minerals and antioxidants",
      "Helps with metabolism & thyroid via selenium",
      "Contributes to heart & brain health with omega-3s",
      "May reduce inflammation and oxidative stress"
     ]
    }
  },
  {
    id: 31,
    name: 'Mud Crabs (4-6 piece/kg)',
    category: 'Crabs',
    price: '500 - ₹550',
    image: assets.mud_crabs,
    min: 20,
    max: 100,
    bestseller : false,
     description: {
    overview: 'Found in mangroves, sweet and firm meat. Rich in zinc, boosts immunity.',
    proteins: '18g per 100g', 
    calories: '89 kcal',
vitamins: 'Vitamin B complex, trace vitamins', 
minerals: 'Selenium, Zinc, Phosphorus, Calcium, Iron, Magnesium', 
uses: 'Steaming, boiling, grilling, curries, crab soups', 
benefits:[ 
"High-quality lean protein for muscle repair",
      "Supports bone & blood health via minerals",
      "Boosts immunity through trace minerals and antioxidants",
      "Helps with metabolism & thyroid via selenium",
      "Contributes to heart & brain health with omega-3s",
      "May reduce inflammation and oxidative stress"
     ]
    }
  },
  {
    id: 32,
    name: 'Yellow Crab (1 piece/kg)',
    category: 'Crabs',
    price: '1200 - ₹1350',
    image: assets.yellow_crab, 
    min: 20,
    max: 100,
    bestseller : true,
    description: {
  overview: 'Medium-sized crab, coastal delicacy. Good for joint and bone health.',
   proteins: '18-20g per 100g',
  calories: '97 kcal',
  vitamins: 'Vitamin B12, Vitamin A, Vitamin C',
  minerals: 'Calcium, Phosphorus, Selenium, Iron',
  uses: 'Curries, stir-fried, steamed, masala fry, coastal recipes',
  benefits: [
    "Excellent source of lean protein for muscle repair",
    "Minerals like calcium and phosphorus support bone health",
    "Vitamin B12 aids in red blood cell formation and nerve function",
    "Low in fat and calories, suitable for healthy diets",
    "Rich, sweet meat enhances flavor in traditional dishes",
    "Supports immunity, skin, and eye health",
  ]
}
  },
  {
    id: 33,
    name: 'Yellow Crab (2-3 piece/kg)',
    category: 'Crabs',
    price: '900 - ₹1050',
    image: assets.yellow_crab, 
    min: 20,
    max: 100,
    bestseller : false,
    description: {
  overview: 'Medium-sized crab, coastal delicacy. Good for joint and bone health.',
   proteins: '18-20g per 100g',
  calories: '97 kcal',
  vitamins: 'Vitamin B12, Vitamin A, Vitamin C',
  minerals: 'Calcium, Phosphorus, Selenium, Iron',
  uses: 'Curries, stir-fried, steamed, masala fry, coastal recipes',
  benefits: [
    "Excellent source of lean protein for muscle repair",
    "Minerals like calcium and phosphorus support bone health",
    "Vitamin B12 aids in red blood cell formation and nerve function",
    "Low in fat and calories, suitable for healthy diets",
    "Rich, sweet meat enhances flavor in traditional dishes",
    "Supports immunity, skin, and eye health",
  ]
}

  },
  {
    id: 34,
    name: 'Yellow Crab (4-5 piece/kg)',
    category: 'Crabs',
    price: '700 - ₹800',
    image: assets.yellow_crab, 
    min: 20,
    max: 100,
    bestseller : false,
    description: {
  overview: 'Medium-sized crab, coastal delicacy. Good for joint and bone health.',
   proteins: '18-20g per 100g',
  calories: '97 kcal',
  vitamins: 'Vitamin B12, Vitamin A, Vitamin C',
  minerals: 'Calcium, Phosphorus, Selenium, Iron',
  uses: 'Curries, stir-fried, steamed, masala fry, coastal recipes',
  benefits: [
    "Excellent source of lean protein for muscle repair",
    "Minerals like calcium and phosphorus support bone health",
    "Vitamin B12 aids in red blood cell formation and nerve function",
    "Low in fat and calories, suitable for healthy diets",
    "Rich, sweet meat enhances flavor in traditional dishes",
    "Supports immunity, skin, and eye health",
  ]
}

  },
  {
    id: 35,
    name: 'Elesha seawater/Pulasa',
    category: 'Sea Fish',
    price: '2000',
    image: assets.elesha_seawater, 
    min: 2000,
    max: 5000,
    bestseller : true,
    description: {
  overview: 'Rare and highly prized seawater fish with firm, flavorful flesh – ideal for grilling, frying, or traditional coastal delicacies.',
  proteins: '20-22g per 100g',
  calories: '135 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin, small amounts of Vitamin A',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Grilled, fried, baked, special curries, coastal delicacies',
  benefits: [
    "Premium source of high-quality protein for muscle growth",
    "Rich in omega-3 fatty acids, supporting heart and brain health",
    "Vitamin B12 and D aid blood formation, nerve function, and immunity",
    "Minerals like phosphorus and calcium strengthen bones and teeth",
    "Low in saturated fat, easily digestible",
    "Highly valued and rare fish, considered a delicacy in coastal cuisine",
  ]
}
  },


   {
    id: 36,
    name: 'Lobster Scambi(1Piece KG) ',
    category: 'Prawns',
    price: '2200',
    image: assets.lobster_scambi, 
    min: 100,
    max: 500,
    bestseller : true,
    description: {
  overview: 'Premium shellfish with firm, succulent meat – ideal for grilling, baking, or preparing luxurious coastal dishes.',
  proteins: '19-21g per 100g',
  calories: '98 kcal',
  vitamins: 'Vitamin B12, Vitamin A, Vitamin D',
  minerals: 'Calcium, Phosphorus, Selenium, Iron',
  uses: 'Grilled, baked, butter-fried, seafood platters, coastal delicacies',
  benefits: [
    "Rich source of lean protein for muscle repair and growth",
    "Minerals support bone health, immunity, and metabolism",
    "Vitamin B12 supports healthy blood cells and nerve function",
    "Low in fat, easily digestible",
    "Highly prized seafood, adds gourmet value to dishes",
    "Supports heart and brain health through omega-3 content",
  ]
}
  },
   {
    id: 37,
    name: 'Sea Prawns',
    category: 'Prawns',
    price: '600 - ₹900',
    image: assets.sea_prawns, 
    min: 200,
    max: 500,
    bestseller : true,
    description: {
  overview: 'Fresh sea prawns with firm, juicy flesh – perfect for frying, grilling, or adding to curries and seafood dishes.',
  proteins: '18-20g per 100g',
  calories: '99 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin',
  minerals: 'Selenium, Phosphorus, Potassium, Calcium',
  uses: 'Grilled, fried, curries, tawa fry, seafood platters, stir-fries',
  benefits: [
    "Excellent source of lean protein for muscle repair and growth",
    "Rich in minerals that support bone health and metabolism",
    "Vitamin B12 aids nerve and blood cell health",
    "Low in saturated fat, easy to digest",
    "Omega-3 fatty acids support heart and brain health",
    "Versatile seafood, widely used in coastal cuisines",
  ]
}
  },
   {
    id: 38,
    name: 'Vanami Prawns',
    category: 'Prawns',
    price: '500',
    image: assets.vonami_prawns, 
    min: 200,
    max: 500,
    bestseller : true,
    description: {
  overview: 'Freshwater/sea prawns with firm, succulent flesh – ideal for curries, frying, grilling, and tawa preparations.',
  proteins: '18-20g per 100g',
  calories: '100 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin',
  minerals: 'Selenium, Phosphorus, Potassium, Calcium',
  uses: 'Grilled, fried, curries, tawa fry, seafood stir-fries',
  benefits: [
    "Rich source of high-quality protein for muscle repair and growth",
    "Omega-3 fatty acids support heart and brain health",
    "Minerals like phosphorus and calcium strengthen bones and teeth",
    "Vitamin B12 supports nerve function and red blood cell health",
    "Low in saturated fat, easy to digest",
    "Popular in coastal and South Indian seafood recipes",
  ]
}
  },
  {
    id:39,
    name: 'Prawns Meat',
    category: 'Prawns',
    subCategory: "Only Prawn Meat",
    price: '1000',
    image: assets.prawns_meat,
    min: 200,
    max: 500,
    bestseller : true,
    description: {
  overview: 'Fresh sea prawns with firm, juicy flesh – perfect for frying, grilling, or adding to curries and seafood dishes.',
  proteins: '18-20g per 100g',
  calories: '99 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin',
  minerals: 'Selenium, Phosphorus, Potassium, Calcium',
  uses: 'Grilled, fried, curries, tawa fry, seafood platters, stir-fries',
  benefits: [
    "Excellent source of lean protein for muscle repair and growth",
    "Rich in minerals that support bone health and metabolism",
    "Vitamin B12 aids nerve and blood cell health",
    "Low in saturated fat, easy to digest",
    "Omega-3 fatty acids support heart and brain health",
    "Versatile seafood, widely used in coastal cuisines",
  ]
}
  },
  {
    id: 40,
    name: 'Crabs Meat',
    category: 'Crabs',
    subCategory: 'Only Crab Meat',
    price: '2000',
    image: assets.crab_meat, 
    min: 20,
    max: 100,
    bestseller : true,
     description: {
  overview: 'Medium-sized crab, coastal delicacy. Good for joint and bone health.',
   proteins: '18-20g per 100g',
  calories: '97 kcal',
  vitamins: 'Vitamin B12, Vitamin A, Vitamin C',
  minerals: 'Calcium, Phosphorus, Selenium, Iron',
  uses: 'Curries, stir-fried, steamed, masala fry, coastal recipes',
  benefits: [
    "Excellent source of lean protein for muscle repair",
    "Minerals like calcium and phosphorus support bone health",
    "Vitamin B12 aids in red blood cell formation and nerve function",
    "Low in fat and calories, suitable for healthy diets",
    "Rich, sweet meat enhances flavor in traditional dishes",
    "Supports immunity, skin, and eye health",
  ]
}
  },
  {
    id: 41,
    name: 'Apollo',
    category: 'Sea Fish',
    price: '400',
    image: assets.apollo, 
    min: 20,
    max: 100,
    bestseller : false,
    description: {
  overview: 'Medium-sized sea fish with firm, pinkish flesh – suitable for grilling, frying, and traditional coastal curries.',
  proteins: '19-21g per 100g',
  calories: '130 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin, small amounts of Vitamin A',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Grilled, fried, baked, curries, tawa fry, coastal masala dishes',
  benefits: [
    "High-quality protein source for muscle growth and repair",
    "Rich in omega-3 fatty acids supporting heart and brain health",
    "Vitamin B12 and D support blood formation, nerve function, and immunity",
    "Minerals like phosphorus and calcium strengthen bones and teeth",
    "Low in saturated fat, easily digestible",
    "Delicious and versatile, widely enjoyed in coastal cuisine",
  ]
}
  },
  {
    id: 42,
    name: 'Boneless Apollo',
    category: 'Sea Fish',
    subCategory: "Boneless Apollo", 
    price: '700',
    image: assets.boneless_apollo, 
    min: 20,
    max: 100,
    bestseller : false,
    description: {
  overview: 'Medium-sized sea fish with firm, pinkish flesh – suitable for grilling, frying, and traditional coastal curries.',
  proteins: '19-21g per 100g',
  calories: '130 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin, small amounts of Vitamin A',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Grilled, fried, baked, curries, tawa fry, coastal masala dishes',
  benefits: [
    "High-quality protein source for muscle growth and repair",
    "Rich in omega-3 fatty acids supporting heart and brain health",
    "Vitamin B12 and D support blood formation, nerve function, and immunity",
    "Minerals like phosphorus and calcium strengthen bones and teeth",
    "Low in saturated fat, easily digestible",
    "Delicious and versatile, widely enjoyed in coastal cuisine",
  ]
}
  },
  {
    id: 43,
    name: 'Boneless Fish',
    category: 'Sea Fish',
    subCategory: "Boneless Fish",
    price: '1000',
    image: assets.boneless_fish, 
    min: 20,
    max: 100,
    bestseller : false,
    description: {
  overview: 'Fillet-style boneless fish, soft and tender – ideal for frying, grilling, baking, or making curries.',
  proteins: '18-20g per 100g',
  calories: '120 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Niacin',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Grilled, fried, baked, curries, fish fingers, tawa fry, continental-style recipes',
  benefits: [
    "Lean protein source for muscle repair and growth",
    "Easy to cook and digest due to absence of bones",
    "Supports heart and brain health with omega-3 fatty acids",
    "Vitamin B12 aids nerve function and red blood cell formation",
    "Minerals strengthen bones and overall metabolism",
    "Versatile for multiple cuisines and family-friendly meals",
  ]
}
  },
  {
    id: 44,
    name: 'Koramenu (Live***)',
    category: 'Live Fish',
    price: '530',
    image: assets.koramenu, 
    min: 20,
    max: 100,
    bestseller : true,
   description: {
  overview: 'Fresh live fish with firm, tender flesh – commonly used in curries, steaming, and frying.',
  proteins: '17-19g per 100g',
  calories: '110 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Vitamin A',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Curries, shallow fried, steamed, tawa fry, traditional freshwater recipes',
  benefits: [
    "High-quality protein source for muscle repair and growth",
    "Omega-3 fatty acids support heart and brain health",
    "Vitamin B12 aids in red blood cell formation and nerve function",
    "Minerals like phosphorus and calcium strengthen bones",
    "Low in fat and easily digestible",
    "Preferred for freshness and taste in traditional dishes",
  ]
}
  },
  {
    id: 45,
    name: 'Koramenu',
    category: 'Fresh Water Fish',
    price: '530',
    image: assets.koramenu, 
    min: 5,
    max: 100,
    bestseller : true,
    description: {
  overview: 'Fresh live freshwater fish with firm, tender flesh – ideal for curries, steaming, and frying.',
  proteins: '17-19g per 100g',
  calories: '110 kcal',
  vitamins: 'Vitamin B12, Vitamin D, Vitamin A',
  minerals: 'Phosphorus, Selenium, Potassium, Calcium',
  uses: 'Curries, shallow fried, steamed, tawa fry, traditional freshwater recipes',
  benefits: [
    "High-quality protein source for muscle repair and growth",
    "Omega-3 fatty acids support heart and brain health",
    "Vitamin B12 aids in red blood cell formation and nerve function",
    "Minerals like phosphorus and calcium strengthen bones",
    "Low in fat and easily digestible",
    "Preferred for freshness and taste in traditional freshwater dishes",
  ]
}
  },


]

export default products;


