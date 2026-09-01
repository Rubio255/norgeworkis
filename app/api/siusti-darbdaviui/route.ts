import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const ADMIN_EMAIL = "info@optinvest.lt";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseServiceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const smtpHost =
      process.env.SMTP_HOST;

    const smtpPort =
      Number(process.env.SMTP_PORT || 465);

    const smtpSecure =
      process.env.SMTP_SECURE === "true";

    const smtpUser =
      process.env.SMTP_USER;

    const smtpPassword =
      process.env.SMTP_PASSWORD;

    if (
      !supabaseUrl ||
      !supabaseServiceRoleKey
    ) {
      return NextResponse.json(
        {
          error:
            "Serverio Supabase konfigūracijos klaida.",
        },
        { status: 500 }
      );
    }

    if (
      !smtpHost ||
      !smtpUser ||
      !smtpPassword
    ) {
      return NextResponse.json(
        {
          error:
            "Serverio el. pašto konfigūracijos klaida.",
        },
        { status: 500 }
      );
    }

    /*
     * ADMIN AUTORIZACIJA
     */
    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          error:
            "Neprisijungta prie administratoriaus paskyros.",
        },
        { status: 401 }
      );
    }

    const accessToken =
      authorization
        .slice("Bearer ".length)
        .trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Neteisinga administratoriaus sesija.",
        },
        { status: 401 }
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );

    const {
      data: { user },
      error: userError,
    } =
      await supabase.auth.getUser(
        accessToken
      );

    if (
      userError ||
      !user
    ) {
      return NextResponse.json(
        {
          error:
            "Prisijungimo sesija negalioja. Prisijunkite iš naujo.",
        },
        { status: 401 }
      );
    }

    if (
      user.email?.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {
      return NextResponse.json(
        {
          error:
            "Neturite administratoriaus teisių.",
        },
        { status: 403 }
      );
    }

    /*
     * UŽKLAUSOS DUOMENYS
     */
    const body =
      await request.json();

    const kandidatIds =
      body.kandidatIds;

    const darbdavioEmail =
      typeof body.darbdavioEmail === "string"
        ? body.darbdavioEmail
            .trim()
            .toLowerCase()
        : "";

    if (
      !Array.isArray(kandidatIds) ||
      kandidatIds.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Nepasirinkti kandidatai.",
        },
        { status: 400 }
      );
    }

    if (
      kandidatIds.length > 100
    ) {
      return NextResponse.json(
        {
          error:
            "Vienu metu galima siųsti iki 100 kandidatų.",
        },
        { status: 400 }
      );
    }

    const validIds =
      kandidatIds.filter(
        (id: unknown): id is number =>
          typeof id === "number" &&
          Number.isInteger(id) &&
          id > 0
      );

    if (
      validIds.length !==
      kandidatIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "Neteisingi kandidatų ID.",
        },
        { status: 400 }
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !darbdavioEmail ||
      !emailPattern.test(
        darbdavioEmail
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Neteisingas darbdavio el. pašto adresas.",
        },
        { status: 400 }
      );
    }

    /*
     * KANDIDATAI
     */
    const {
      data: kandidatai,
      error: kandidataiError,
    } =
      await supabase
        .from("kandidatai")
        .select(`
          id,
          vardas,
          pavarde,
          telefonas,
          email,
          profesija,
          patirtis,
          norvegu_kalba,
          anglu_kalba,
          apie
        `)
        .in(
          "id",
          validIds
        );

    if (kandidataiError) {
      console.error(
        "Kandidatų gavimo klaida:",
        kandidataiError.message
      );

      return NextResponse.json(
        {
          error:
            "Nepavyko gauti kandidatų.",
        },
        { status: 500 }
      );
    }

    if (
      !kandidatai ||
      kandidatai.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Kandidatų nerasta.",
        },
        { status: 404 }
      );
    }

    if (
      kandidatai.length !==
      validIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "Vienas ar keli kandidatai nerasti.",
        },
        { status: 404 }
      );
    }

    /*
     * EXCEL
     */
    const excelData =
      kandidatai.map(
        (kandidatas, index) => ({
          "Nr.":
            index + 1,

          Vardas:
            kandidatas.vardas || "",

          Pavardė:
            kandidatas.pavarde || "",

          Telefonas:
            kandidatas.telefonas || "",

          "El. paštas":
            kandidatas.email || "",

          Profesija:
            kandidatas.profesija || "",

          Patirtis:
            kandidatas.patirtis || "",

          "Norvegų kalba":
            kandidatas.norvegu_kalba || "",

          "Anglų kalba":
            kandidatas.anglu_kalba || "",

          "Apie kandidatą":
            kandidatas.apie || "",
        })
      );

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 30 },
      { wch: 22 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 50 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Kandidatai"
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          type: "buffer",
          bookType: "xlsx",
        }
      );

    /*
     * EL. PAŠTAS
     */
    const transporter =
      nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,

        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });

    await transporter.verify();

    const fileName =
      `norgeworkis-kandidatai-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

    const info =
      await transporter.sendMail({
        from:
          `"Norgeworkis" <${smtpUser}>`,

        to:
          darbdavioEmail,

        subject:
          "Norgeworkis – atrinktų kandidatų sąrašas",

        text:
          "Sveiki,\n\n" +
          `Prisegame atrinktų kandidatų sąrašą (${kandidatai.length}).\n\n` +
          "Kandidatų informacija pateikta Excel faile.\n\n" +
          "Pagarbiai,\n" +
          "Norgeworkis\n" +
          "www.norgeworkis.lt",

        attachments: [
          {
            filename:
              fileName,

            content:
              excelBuffer,

            contentType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        ],
      });

    console.log(
      "Kandidatų Excel išsiųstas.",
      {
        messageId:
          info.messageId,

        candidateCount:
          kandidatai.length,
      }
    );

    /*
     * STATUSO ATNAUJINIMAS
     */
    const {
      error: updateError,
    } =
      await supabase
        .from("kandidatai")
        .update({
          statusas:
            "Išsiųstas darbdaviui",

          issiusta_darbdaviui_at:
            new Date().toISOString(),
        })
        .in(
          "id",
          validIds
        );

    if (updateError) {
      console.error(
        "Statuso atnaujinimo klaida:",
        updateError.message
      );

      return NextResponse.json({
        success: true,

        warning:
          "Laiškas išsiųstas, tačiau kandidatų statuso atnaujinti nepavyko.",

        message:
          "Kandidatų sąrašas išsiųstas darbdaviui.",
      });
    }

    return NextResponse.json({
      success: true,

      message:
        "Kandidatų Excel failas sėkmingai išsiųstas darbdaviui.",
    });
  } catch (error) {
    console.error(
      "Kandidatų siuntimo API klaida:",
      error instanceof Error
        ? error.message
        : "Nežinoma klaida"
    );

    return NextResponse.json(
      {
        error:
          "Nepavyko išsiųsti kandidatų.",
      },
      { status: 500 }
    );
  }
}