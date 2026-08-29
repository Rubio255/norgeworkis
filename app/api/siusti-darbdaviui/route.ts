import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

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

    if (!smtpHost || !smtpUser || !smtpPassword) {
      return NextResponse.json(
        {
          error:
            "Trūksta SMTP nustatymų Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const kandidatIds =
      body.kandidatIds as number[];

    const darbdavioEmail =
      body.darbdavioEmail as string;

    if (
      !Array.isArray(kandidatIds) ||
      kandidatIds.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Nepasirinkti kandidatai.",
        },
        { status: 400 }
      );
    }

    if (
      !darbdavioEmail ||
      typeof darbdavioEmail !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Nenurodytas darbdavio el. paštas.",
        },
        { status: 400 }
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

    const {
      data: kandidatai,
      error: kandidataiError,
    } = await supabase
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
        {
          error: "Kandidatų nerasta.",
        },
        { status: 404 }
      );
    }

    const excelData =
      kandidatai.map(
        (kandidatas, index) => ({
          "Nr.": index + 1,
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

        to: darbdavioEmail,

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
            filename: fileName,
            content: excelBuffer,
            contentType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        ],
      });

    console.log(
      "Laiškas išsiųstas. Message ID:",
      info.messageId
    );

    const {
      error: updateError,
    } = await supabase
      .from("kandidatai")
      .update({
        statusas:
          "Išsiųstas darbdaviui",

        issiusta_darbdaviui_at:
          new Date().toISOString(),
      })
      .in("id", kandidatIds);

    if (updateError) {
      return NextResponse.json({
        success: true,

        warning:
          "Laiškas išsiųstas, tačiau statuso atnaujinti nepavyko.",

        messageId:
          info.messageId,
      });
    }

    return NextResponse.json({
      success: true,

      message:
        `Excel failas išsiųstas adresu ${darbdavioEmail}.`,

      messageId:
        info.messageId,
    });
  } catch (error) {
    console.error(
      "Siuntimo klaida:",
      error
    );

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