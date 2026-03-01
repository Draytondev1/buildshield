import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user credits
    let { data: userCredits, error } = await supabaseAdmin
      .from("users")
      .select("credits_remaining, total_reports_generated")
      .eq("user_id", userId)
      .single();

    if (error || !userCredits) {
      // Create new user with 3 free credits
      const { data: newUser, error: createError } = await supabaseAdmin
        .from("users")
        .insert({
          user_id: userId,
          credits_remaining: 3,
          total_reports_generated: 0,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      userCredits = newUser;
    }

    return NextResponse.json({
      creditsRemaining: userCredits.credits_remaining,
      totalReportsGenerated: userCredits.total_reports_generated,
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
