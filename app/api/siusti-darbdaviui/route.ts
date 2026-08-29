import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const kandidatIds = body.kandidatIds as number[];
    const darbdavioEmail = body.darbdavioEmail as string;

    if (!Array.isArray(kandidatIds) || kandidatIds.length === 0) {
      return NextResponse.json(
        { error: "Nepasirinkti kandidatai." },
        { status: 400 }
      );
    }

    if (!darbdavioEmail) {
      return NextResponse.json(
        { error: "Nenurodytas darbdavio el. paštas." },
        { status: 400 }
      );
    }

    const { data: kandidatai, error: kandidataiError } =
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
          apie,
          statusas
        `)
        .in("id", kandidatIds);

    if (kandidataiError) {
      return NextResponse.json(
        {
          error:
            "Nepavyko gauti kandidatų: " +
            kandidataiError.message,
        },
        { status: 500 }
      );
    }

    if (!kandidatai || kandidatai.length === 0) {
      return NextResponse.json(
        { error: "Kandidatų nerasta." },
        { status: 404 }
      );
    }

    const excelData = kandidatai.map((kandidatas) => ({
      Vardas: kandidatas.vardas,
      Pavardė: kandidatas.pavarde,
      Telefonas: kandidatas.telefonas,
      "El. paštas": kandidatas.email,
      Profesija: kandidatas.profesija,
      Patirtis: kandidatas.patirtis,
      "Norvegų kalba": kandidatas.norvegu_kalba || "",
      "Anglų kalba": kandidatas.anglu_kalba || "",
      "Apie kandidatą": kandidatas.apie || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 20 },
      { wch: 18 },
      { wch: 28 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 50 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Kandidatai"
    );

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Norgeworkis" <${process.env.SMTP_USER}>`,
      to: darbdavioEmail,
      subject: "Norgeworkis kandidatų sąrašas",
      text:
        "Sveiki,\n\n" +
        "Prisegame atrinktų kandidatų sąrašą.\n\n" +
        "Pagarbiai,\n" +
        "Norgeworkis",
      attachments: [
        {
          filename: `norgeworkis-kandidatai-${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx`,
          content: excelBuffer,
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    });

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("kandidatai")
      .update({
        statusas: "Išsiųstas darbdaviui",
        issiusta_darbdaviui_at: now,
      })
      .in("id", kandidatIds);

    if (updateError) {
      console.error(
        "Laiškas išsiųstas, tačiau nepavyko atnaujinti statusų:",
        updateError
      );

      return NextResponse.json({
        success: true,
        warning:
          "Laiškas išsiųstas, tačiau kandidatų statusai nebuvo atnaujinti.",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Išsiųsta ${kandidatai.length} kandidatų.`,
    });
  } catch (error) {
    console.error("Siuntimo klaida:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nepavyko išsiųsti laiško.",
      },
      { status: 500 }
    );
  }
}