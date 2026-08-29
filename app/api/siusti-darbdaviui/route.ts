import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const kandidatIds = body.kandidatIds as number[];
    const darbdavioEmail = body.darbdavioEmail as string;

    const diagnostics: Record<string, unknown> = {
      receivedIds: kandidatIds,
      receivedEmployerEmail: darbdavioEmail,
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasServiceRoleKey: Boolean(supabaseServiceRoleKey),
      serviceRoleKeyLength:
        supabaseServiceRoleKey?.length || 0,
      serviceRoleKeyPrefix:
        supabaseServiceRoleKey
          ? supabaseServiceRoleKey.substring(0, 8)
          : null,
    };

    if (!Array.isArray(kandidatIds) || kandidatIds.length === 0) {
      return NextResponse.json(
        {
          error: "Nepasirinkti kandidatai.",
          diagnostics,
        },
        {
          status: 400,
        }
      );
    }

    const { data: kandidatai, error: kandidataiError } =
      await supabase
        .from("kandidatai")
        .select(`
          id,
          vardas,
          pavarde,
          email,
          profesija,
          statusas
        `)
        .in("id", kandidatIds);

    diagnostics.supabaseError = kandidataiError
      ? {
          message: kandidataiError.message,
          code: kandidataiError.code,
          details: kandidataiError.details,
          hint: kandidataiError.hint,
        }
      : null;

    diagnostics.candidateCount =
      kandidatai?.length || 0;

    diagnostics.returnedCandidateIds =
      kandidatai?.map((k) => k.id) || [];

    if (kandidataiError) {
      return NextResponse.json(
        {
          error:
            "Supabase grąžino klaidą.",
          diagnostics,
        },
        {
          status: 500,
        }
      );
    }

    if (!kandidatai || kandidatai.length === 0) {
      return NextResponse.json(
        {
          error: "Kandidatų nerasta.",
          diagnostics,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Diagnostika sėkminga. Kandidatai rasti.",
      diagnostics,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nežinoma diagnostikos klaida.",
      },
      {
        status: 500,
      }
    );
  }
}