import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("query");
  const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    
    const products = await inventory.aggregate([
      {
        $match: {
          $or: [
            { brandName: { $regex: query, $options: "i" } },
            { productName: { $regex: query, $options: "i" } },
            { modelName: { $regex: query, $options: "i" } },
          ]
        }
      }
    ]).toArray();
    
    return NextResponse.json({ success: true, products });
  } finally {
    await client.close();
  }
}
