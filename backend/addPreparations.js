import mongoose from "mongoose";
import "dotenv/config";
import productModel from "./models/productModel.js";

const roundPrice = (price) => Math.round(price / 10) * 10;

const fishPreparations = (price) => [
  {
    name: "Whole / Uncleaned",
    pricePerKg: price,
  },
  {
    name: "Whole Cleaned",
    pricePerKg: roundPrice(price * 1.05),
  },
  {
    name: "With Head & Tail",
    pricePerKg: roundPrice(price * 1.08),
  },
  {
    name: "Head Removed",
    pricePerKg: roundPrice(price * 1.12),
  },
  {
    name: "Without Head & Tail",
    pricePerKg: roundPrice(price * 1.18),
  },
  {
    name: "Curry Cut",
    pricePerKg: roundPrice(price * 1.15),
  },
  {
    name: "Fry Cut",
    pricePerKg: roundPrice(price * 1.18),
  },
  {
    name: "Steak Cut",
    pricePerKg: roundPrice(price * 1.22),
  },
  {
    name: "Boneless Fillet",
    pricePerKg: roundPrice(price * 1.35),
  },
];

const prawnPreparations = (price) => [
  {
    name: "Whole / Uncleaned",
    pricePerKg: price,
  },
  {
    name: "Whole Cleaned",
    pricePerKg: roundPrice(price * 1.05),
  },
  {
    name: "Headless & Shell-On",
    pricePerKg: roundPrice(price * 1.12),
  },
  {
    name: "Headless & Deveined",
    pricePerKg: roundPrice(price * 1.20),
  },
  {
    name: "Peeled & Deveined",
    pricePerKg: roundPrice(price * 1.35),
  },
  {
    name: "Butterfly / Split Back",
    pricePerKg: roundPrice(price * 1.30),
  },
];

const crabPreparations = (price) => [
  {
    name: "Whole / Uncleaned",
    pricePerKg: price,
  },
  {
    name: "Whole Cleaned",
    pricePerKg: roundPrice(price * 1.08),
  },
  {
    name: "Half Cut",
    pricePerKg: roundPrice(price * 1.15),
  },
  {
    name: "Curry Pieces",
    pricePerKg: roundPrice(price * 1.18),
  },
  {
    name: "Body & Claws Separated",
    pricePerKg: roundPrice(price * 1.15),
  },
];

const lobsterPreparations = (price) => [
  {
    name: "Whole / Uncleaned",
    pricePerKg: price,
  },
  {
    name: "Whole Cleaned",
    pricePerKg: roundPrice(price * 1.08),
  },
  {
    name: "Half Cut",
    pricePerKg: roundPrice(price * 1.15),
  },
  {
    name: "Tail Section",
    pricePerKg: roundPrice(price * 1.25),
  },
  {
    name: "Butterfly Tail",
    pricePerKg: roundPrice(price * 1.30),
  },
  {
    name: "Tail Meat",
    pricePerKg: roundPrice(price * 1.40),
  },
];

const getPreparations = (product) => {
  const price = Number(product.price || 0);
  const category = String(product.category || "").toLowerCase();
  const name = String(product.name || "").toLowerCase();

  // PRAWNS
  if (
    category.includes("prawn") ||
    category.includes("shrimp")
  ) {
    return prawnPreparations(price);
  }

  // CRABS
  if (category.includes("crab")) {
    return crabPreparations(price);
  }

  // LOBSTER / SCAMPI
  if (
    name.includes("lobster") ||
    name.includes("scampi")
  ) {
    return lobsterPreparations(price);
  }

  // SPECIAL HILSA / PULASA
  if (
    name.includes("elisha") ||
    name.includes("elesha") ||
    name.includes("pulasa") ||
    name.includes("hilsa")
  ) {
    return [
      {
        name: "Whole / Uncleaned",
        pricePerKg: price,
      },
      {
        name: "Whole Cleaned",
        pricePerKg: roundPrice(price * 1.05),
      },
      {
        name: "With Head & Tail",
        pricePerKg: roundPrice(price * 1.08),
      },
      {
        name: "Head Removed",
        pricePerKg: roundPrice(price * 1.12),
      },
      {
        name: "Curry Cut",
        pricePerKg: roundPrice(price * 1.15),
      },
      {
        name: "Steak Cut",
        pricePerKg: roundPrice(price * 1.20),
      },
      {
        name: "Fry Cut",
        pricePerKg: roundPrice(price * 1.18),
      },
    ];
  }

  // VANJIRAM / SEER
  if (
    name.includes("vanjiram") ||
    name.includes("seer") ||
    name.includes("king mackerel")
  ) {
    return [
      {
        name: "Whole / Uncleaned",
        pricePerKg: price,
      },
      {
        name: "Whole Cleaned",
        pricePerKg: roundPrice(price * 1.05),
      },
      {
        name: "With Head & Tail",
        pricePerKg: roundPrice(price * 1.08),
      },
      {
        name: "Head Removed",
        pricePerKg: roundPrice(price * 1.12),
      },
      {
        name: "Without Head & Tail",
        pricePerKg: roundPrice(price * 1.18),
      },
      {
        name: "Curry Cut",
        pricePerKg: roundPrice(price * 1.15),
      },
      {
        name: "Fry Cut",
        pricePerKg: roundPrice(price * 1.18),
      },
      {
        name: "Steak Cut",
        pricePerKg: roundPrice(price * 1.22),
      },
      {
        name: "Boneless Fillet",
        pricePerKg: roundPrice(price * 1.35),
      },
    ];
  }

  // GENERAL FISH
  return fishPreparations(price);
};

async function addPreparations() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
  dbName: "e-commerce",
});

    console.log("MongoDB connected.");

    const products = await productModel.find({});

    console.log(`Found ${products.length} products.`);

    if (products.length === 0) {
      console.log("No products found.");
      process.exit(0);
    }

    let updated = 0;

    for (const product of products) {
      const preparationOptions = getPreparations(product);

      await productModel.updateOne(
        { _id: product._id },
        {
          $set: {
            preparationOptions,
          },
        }
      );

      updated++;

      console.log(
        `${updated}/${products.length} - ${product.name} - ₹${product.price}/kg`
      );
    }

    console.log("");
    console.log("======================================");
    console.log("PREPARATION UPDATE COMPLETED");
    console.log("======================================");
    console.log(`Products found: ${products.length}`);
    console.log(`Products updated: ${updated}`);
    console.log("======================================");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("ERROR:", error);
    console.error("");

    await mongoose.disconnect();

    process.exit(1);
  }
}

addPreparations();