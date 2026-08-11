import { NextResponse } from "next/server";
import { getAdminClient, supabase, DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { occasion, fabric, budget, matchedProductIds, completedAt, customerName, customerPhone } = body;

    const id = `QZ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Get Supabase client (service role preferred, fallback to anon client)
    let client = null;
    try {
      client = getAdminClient();
    } catch {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
      client = createClient(url, anonKey);
    }

    const { data, error } = await client.from("quiz_results").insert({
      id,
      occasion: occasion || "Not specified",
      fabric: fabric || "Not specified",
      budget: budget || "Not specified",
      matched_product_ids: matchedProductIds || [],
      completed_at: completedAt || new Date().toISOString(),
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
    }).select().single();

    if (error) {
      console.error("API /api/quiz Supabase Insert Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("API /api/quiz Internal Error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    let client = null;
    try {
      client = getAdminClient();
    } catch {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
      client = createClient(url, anonKey);
    }

    const { data, error } = await client
      .from("quiz_results")
      .select("*")
      .order("completed_at", { ascending: false })
      .limit(200);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
