const crypto = require("crypto");

function validarWebhookMercadoPago(req, res, next) {
  try {
    // =====================================================
    // IGNORA NOTIFICAÇÕES ANTIGAS / OUTROS EVENTOS
    // =====================================================

    if (req.query.type !== "payment") {
      console.log(
        "Webhook ignorado:",
        req.query.type || req.query.topic || "desconhecido"
      );

      return res.sendStatus(200);
    }

    // =====================================================
    // DADOS DO WEBHOOK
    // =====================================================

    const xSignature = req.headers["x-signature"];
    const xRequestId = req.headers["x-request-id"];
    const dataId = req.query["data.id"];

    const secret = process.env.MP_WEBHOOK_SECRET;

    console.log("========== TESTE SECRET ==========");
console.log(
  "SECRET LENGTH:",
  process.env.MP_WEBHOOK_SECRET?.length
);

console.log(
  "SECRET SHA256:",
  crypto
    .createHash("sha256")
    .update(process.env.MP_WEBHOOK_SECRET || "")
    .digest("hex")
);

console.log("==================================");

    console.log("\n========== MP WEBHOOK ==========");
    console.log("tipo:", req.query.type);
    console.log("data.id:", dataId);
    console.log("x-request-id:", xRequestId);
    console.log("x-signature:", xSignature);
    console.log("================================");

    if (!xSignature || !xRequestId || !dataId) {
      console.warn("Webhook sem dados necessários.");
      return res.sendStatus(200);
    }

    if (!secret) {
      console.error("MP_WEBHOOK_SECRET não configurado.");
      return res.sendStatus(500);
    }

    // =====================================================
    // EXTRAI ts E v1
    // =====================================================

    let ts;
    let v1;

    for (const item of xSignature.split(",")) {
      const [key, value] = item.split("=");

      if (key === "ts") {
        ts = value;
      }

      if (key === "v1") {
        v1 = value;
      }
    }

    console.log("ts:", ts);
    console.log("v1 recebido:", v1);

    if (!ts || !v1) {
      console.warn("x-signature inválida.");
      return res.sendStatus(401);
    }

    // =====================================================
    // MANIFEST
    // =====================================================

    const manifest =
      `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    console.log("manifest:", manifest);

    // =====================================================
    // HMAC
    // =====================================================

    const calculated = crypto
      .createHmac("sha256", secret)
      .update(manifest)
      .digest("hex");

    console.log("HMAC calculado:", calculated);

    // =====================================================
    // COMPARAÇÃO
    // =====================================================

    const recebido = Buffer.from(v1, "hex");
    const calculado = Buffer.from(calculated, "hex");

    let valido = false;

    if (recebido.length === calculado.length) {
      valido = crypto.timingSafeEqual(
        recebido,
        calculado
      );
    }

    console.log("MATCH:", valido);
    console.log("================================\n");

    if (!valido) {
      console.warn(
        "Webhook Mercado Pago REJEITADO."
      );

      return res.status(401).json({
        error: "Assinatura do webhook inválida."
      });
    }

    console.log(
      "Webhook Mercado Pago: assinatura válida."
    );

    next();

  } catch (erro) {
    console.error(
      "Erro ao validar webhook:",
      erro
    );

    return res.sendStatus(500);
  }
}

module.exports = validarWebhookMercadoPago;