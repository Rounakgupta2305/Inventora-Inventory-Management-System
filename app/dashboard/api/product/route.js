import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
  const { userId } = getAuth(request);
  const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const query = { userId };
    const products = await inventory.find(query).toArray();
    return NextResponse.json({ success: true, products })
  } finally {
    await client.close();
  }

}

export async function POST(request) {
  let body = await request.json()
  const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const product = await inventory.insertOne(body)
    return NextResponse.json({ product, ok: true })
  } finally {
    await client.close();
  }
}
