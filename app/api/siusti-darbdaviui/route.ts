import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

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

    const body = await request.json();

    const kandidatIds =
      body.kandidatIds || [];

    const darbdavioEmail =
      body.darbdavioEmail || null;

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

    // 1. Tikriname visus kandidatus
    const {
      data: visiKandidatai,
      error: visiError,
    } = await supabase
      .from("kandidatai")
      .select("id, vardas, pavarde")
      .order("id", {
        ascending: true,
      });

    // 2. Tikriname būtent pasirinktus ID
    const {
      data: pasirinktiKandidatai,
      error: pasirinktiError,
    } = await supabase
      .from("kandidatai")
      .select("id, vardas, pavarde")
      .in("id", kandidatIds);

    console.log(
      "===== NORGEWORKIS TESTAS ====="
    );

    console.log(
      "Supabase host:",
      new URL(supabaseUrl).host
    );

    console.log(
      "Gauti kandidatų ID:",
      kandidatIds
    );

    console.log(
      "Darbdavio email:",
      darbdavioEmail
    );

    console.log(
      "Visų kandidatų klaida:",
      visiError?.message || "nėra"
    );

    console.log(
      "Visi DB kandidatai:",
      visiKandidatai || []
    );

    console.log(
      "Pasirinktų kandidatų klaida:",
      pasirinktiError?.message || "nėra"
    );

    console.log(
      "Rasti pasirinkti kandidatai:",
      pasirinktiKandidatai || []
    );

    console.log(
      "============================="
    );

    return NextResponse.json({
      success: true,

      diagnostics: {
        supabaseHost:
          new URL(supabaseUrl).host,

        requestedIds:
          kandidatIds,

        employerEmail:
          darbdavioEmail,

        allCandidatesError:
          visiError?.message || null,

        allCandidates:
          visiKandidatai || [],

        selectedCandidatesError:
          pasirinktiError?.message || null,

        selectedCandidates:
          pasirinktiKandidatai || [],
      },
    });
  } catch (error) {
    console.error(
      "DIAGNOSTIKOS KLAIDA:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nežinoma klaida",
      },
      { status: 500 }
    );
  }
}