const crypto = require("crypto");

function validarWebhookMercadoPago(req, res, next) {
    try {
        // ==========================================
        // IGNORA NOTIFICAÇÕES ANTIGAS / INDESEJADAS
        // ==========================================

        if (req.query.type !== "payment") {
            console.log(
                "Webhook ignorado. Tipo:",
                req.query.type || req.query.topic
            );

            return res.sendStatus(200);
        }

        // ==========================================
        // DADOS DO WEBHOOK
        // ==========================================

        const xSignature = req.headers["x-signature"];
        const xRequestId = req.headers["x-request-id"];
        const dataId = req.query["data.id"];

        const secret = process.env.MP_WEBHOOK_SECRET;

        console.log("========== MP WEBHOOK ==========");
        console.log("x-request-id:", xRequestId);
        console.log("data.id:", dataId);
        console.log("tipo:", req.query.type);
        console.log("================================");

        // ==========================================
        // VERIFICA CONFIGURAÇÃO
        // ==========================================

        if (!xSignature || !xRequestId || !dataId) {
            console.warn(
                "Webhook sem dados necessários."
            );

            return res.status(401).json({
                error: "Webhook inválido."
            });
        }

        if (!secret) {
            console.error(
                "MP_WEBHOOK_SECRET não configurado."
            );

            return res.status(500).json({
                error: "Configuração do webhook indisponível."
            });
        }

        // ==========================================
        // EXTRAI ts E v1 DO X-SIGNATURE
        // ==========================================

        const parts = xSignature.split(",");

        let ts = null;
        let v1 = null;

        for (const part of parts) {
            const [key, value] = part.split("=");

            if (key === "ts") {
                ts = value;
            }

            if (key === "v1") {
                v1 = value;
            }
        }

        if (!ts || !v1) {
            console.warn(
                "x-signature está em formato inválido."
            );

            return res.status(401).json({
                error: "Assinatura do webhook inválida."
            });
        }

        // ==========================================
        // MANIFEST
        // ==========================================

        const manifest =
            `id:${dataId};request-id:${xRequestId};ts:${ts};`;

        // ==========================================
        // CALCULA HMAC SHA-256
        // ==========================================

        const calculatedSignature = crypto
            .createHmac("sha256", secret)
            .update(manifest)
            .digest("hex");

        // ==========================================
        // COMPARAÇÃO SEGURA
        // ==========================================

        const receivedBuffer = Buffer.from(v1, "hex");
        const calculatedBuffer = Buffer.from(
            calculatedSignature,
            "hex"
        );

        let assinaturaValida = false;

        if (
            receivedBuffer.length === calculatedBuffer.length
        ) {
            assinaturaValida = crypto.timingSafeEqual(
                receivedBuffer,
                calculatedBuffer
            );
        }

        // ==========================================
        // LOG DE DIAGNÓSTICO
        // ==========================================

        console.log("========== HMAC TEST ==========");
        console.log("data.id:", dataId);
        console.log("request-id:", xRequestId);
        console.log("ts:", ts);
        console.log("manifest:", manifest);
        console.log("MATCH:", assinaturaValida);
        console.log("===============================");

        // ==========================================
        // ASSINATURA INVÁLIDA
        // ==========================================

        if (!assinaturaValida) {
            console.warn(
                "Webhook do Mercado Pago rejeitado: assinatura inválida."
            );

            return res.status(401).json({
                error: "Assinatura do webhook inválida."
            });
        }

        // ==========================================
        // ASSINATURA VÁLIDA
        // ==========================================

        console.log(
            "Webhook Mercado Pago: assinatura válida."
        );

        next();

    } catch (error) {
        console.error(
            "Erro ao validar webhook do Mercado Pago:",
            error
        );

        return res.status(500).json({
            error: "Erro ao validar webhook."
        });
    }
}

module.exports = validarWebhookMercadoPago;