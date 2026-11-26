type NaujaAnketa = {
  vardas: string;
  pavarde: string;
  telefonas: string;
  email: string;
  profesija: string;
  patirtis: string;
  norveguKalba: string;
  angluKalba: string;
  darboPavadinimas: string | null;
  turiCv: boolean;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Siunčia Telegram pranešimą apie naują anketą.
 * Niekada nemeta klaidos: jei kažkas nepavyksta,
 * tik užrašo į žurnalą, kad anketos išsaugojimas nenukentėtų.
 */
export async function pranestiApieNaujaAnketa(
  anketa: NaujaAnketa
) {
  const token =
    process.env.TELEGRAM_BOT_TOKEN;
  const chatId =
    process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  const e = escapeHtml;
  const vardas = [
    anketa.vardas,
    anketa.pavarde,
  ]
    .filter(Boolean)
    .join(" ");

  const eilutes = [
    "🆕 <b>Nauja anketa</b>",
    "",
    `👤 <b>${e(vardas)}</b>`,
    `📞 ${e(anketa.telefonas)}`,
    `✉️ ${e(anketa.email)}`,
    `🛠 ${e(anketa.profesija)} · ${e(anketa.patirtis)}`,
  ];

  if (
    anketa.norveguKalba ||
    anketa.angluKalba
  ) {
    eilutes.push(
      `🗣 Norvegų: ${e(
        anketa.norveguKalba || "—"
      )} · Anglų: ${e(
        anketa.angluKalba || "—"
      )}`
    );
  }

  if (anketa.darboPavadinimas) {
    eilutes.push(
      `💼 Darbas: ${e(
        anketa.darboPavadinimas
      )}`
    );
  }

  eilutes.push(
    anketa.turiCv
      ? "📎 CV pridėtas"
      : "📎 Be CV"
  );

  eilutes.push(
    "",
    '<a href="https://www.norgeworkis.lt/admin">Atidaryti administravimą</a>'
  );

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: eilutes.join("\n"),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      console.error(
        "Telegram pranešimo klaida:",
        response.status,
        await response.text()
      );
    }
  } catch (error) {
    console.error(
      "Telegram pranešimo klaida:",
      error instanceof Error
        ? error.message
        : "Nežinoma klaida"
    );
  }
}
