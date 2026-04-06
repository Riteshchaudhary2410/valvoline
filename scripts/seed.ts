import dotenv from "dotenv";
dotenv.config();
import { connectToDatabase } from '../lib/mongodb';
import { loadEnvConfig } from '@next/env';

import { productSeeds } from '../lib/catalog';
import { ProductModel } from '../models/Product';

loadEnvConfig(process.cwd());

async function main() {
  await connectToDatabase();

  const operations = productSeeds.map((product) => ({
    updateOne: {
      filter: { slug: product.slug },
      update: {
        $set: {
          ...product,
          images: product.images ?? [],
          active: product.active ?? true,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length === 0) {
    console.log('No product seeds found.');
    return;
  }

  const result = await ProductModel.bulkWrite(operations, { ordered: false });

  console.log(`Seed complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`);
}

main()
  .then(async () => {
    await ProductModel.db.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);

    try {
      await ProductModel.db.close();
    } catch {
      // ignore close errors
    }

    process.exit(1);
  });
console.log("MONGO:", process.env.MONGODB_URI);