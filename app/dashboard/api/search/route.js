import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("query");
  const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "User not authenticated" });
    }

    const database = client.db('stock');
    const inventory = database.collection('inventory');

    const products = await inventory.aggregate([
      {
        $match: {
          userId,
          $or: [
            { brandName: { $regex: query, $options: "i" } },
            { productName: { $regex: query, $options: "i" } },
            { modelName: { $regex: query, $options: "i" } },
          ]
        }
      }
    ]).toArray();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error during search operation:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  } finally {
    await client.close();
  }
}
