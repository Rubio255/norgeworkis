import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const body = await request.json();

    const kandidatIds = body.kandidatIds as number[];

    if (!supabaseUrl) {
      return NextResponse.json(
        {
          error: "Trūksta NEXT_PUBLIC_SUPABASE_URL.",
        },
        { status: 500 }
      );
    }

    if (!supabaseServiceRoleKey) {
      return NextResponse.json(
        {
          error: "Trūksta SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    /*
     * Gauname VISŲ kandidatų ID iš tos Supabase DB,
     * prie kurios jungiasi Vercel serveris.
     */
    const {
      data: visiKandidatai,
      error: visiError,
    } = await supabase
      .from("kandidatai")
      .select("id")
      .order("id", { ascending: true });

    if (visiError) {
      console.error(
        "DIAGNOSTIKA - visų kandidatų klaida:",
        visiError
      );

      return NextResponse.json(
        {
          error: "Nepavyko perskaityti kandidatų lentelės.",
          diagnostics: {
            requestedIds: kandidatIds,
            supabaseHost: new URL(supabaseUrl).host,
            databaseError: visiError.message,
          },
        },
        { status: 500 }
      );
    }

    const visiIds =
      visiKandidatai?.map((k) => k.id) || [];

    const {
      data: pasirinkti,
      error: pasirinktiError,
    } = await supabase
      .from("kandidatai")
      .select("id")
      .in("id", kandidatIds);

    console.log("===== NORGEWORKIS DIAGNOSTIKA =====");
    console.log("Supabase host:", new URL(supabaseUrl).host);
    console.log("Gauti kandidatų ID:", kandidatIds);
    console.log("Visi DB kandidatų ID:", visiIds);
    console.log(
      "Rasti pasirinkti ID:",
      pasirinkti?.map((k) => k.id) || []
    );
    console.log(
      "Supabase klaida:",
      pasirinktiError?.message || "nėra"
    );
    console.log("===================================");

    return NextResponse.json({
      success: true,
      diagnostics: {
        requestedIds: kandidatIds,
        supabaseHost: new URL(supabaseUrl).host,
        totalCandidatesInDatabase: visiIds.length,
        allCandidateIds: visiIds,
        matchedCandidateIds:
          pasirinkti?.map((k) => k.id) || [],
        supabaseError:
          pasirinktiError?.message || null,
      },
    });
  } catch (error) {
    console.error("DIAGNOSTIKOS KLAIDA:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nežinoma klaida.",
      },
      { status: 500 }
    );
  }
}