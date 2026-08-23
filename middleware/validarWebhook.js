const crypto = require("crypto");

function validarWebhookMercadoPago(req, res, next) {
    try {
        // =====================================================
        // 1. ACEITAR SOMENTE WEBHOOK MODERNO DE PAGAMENTO
        // =====================================================

        if (req.query.type !== "payment") {
            console.log(
                "Webhook ignorado:",
                req.query.type || req.query.topic || "tipo desconhecido"
            );

            return res.sendStatus(200);
        }

        // =====================================================
        // 2. DADOS NECESSÁRIOS PARA VALIDAR A ASSINATURA
        // =====================================================

        const xSignature = req.headers["x-signature"];
        const xRequestId = req.headers["x-request-id"];
        const dataId = req.query["data.id"];

        const secret = process.env.MP_WEBHOOK_SECRET;

        console.log("========== MP WEBHOOK ==========");
        console.log("tipo:", req.query.type);
        console.log("data.id:", dataId);
        console.log("x-request-id:", xRequestId);
        console.log("================================");

        // =====================================================
        // 3. VERIFICAR CONFIGURAÇÃO
        // =====================================================

        if (!xSignature || !xRequestId || !dataId) {
            console.warn(
                "Webhook de pagamento sem dados necessários."
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

        // =====================================================
        // 4. EXTRAIR ts E v1
        // =====================================================

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
                "x-signature em formato inválido."
            );

            return res.status(401).json({
                error: "Assinatura do webhook inválida."
            });
        }

        // =====================================================
        // 5. CRIAR MANIFEST
        // =====================================================

        const manifest =
            `id:${dataId};request-id:${xRequestId};ts:${ts};`;

        // =====================================================
        // 6. CALCULAR HMAC SHA-256
        // =====================================================

        const calculatedSignature = crypto
            .createHmac("sha256", secret)
            .update(manifest)
            .digest("hex");

        // =====================================================
        // 7. COMPARAÇÃO SEGURA
        // =====================================================

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

        // =====================================================
        // 8. RESULTADO DA VALIDAÇÃO
        // =====================================================

        if (!assinaturaValida) {
            console.warn(
                "Webhook Mercado Pago REJEITADO",
                {
                    type: req.query.type,
                    topic: req.query.topic,
                    dataId,
                    requestId: xRequestId
                }
            );

            return res.status(401).json({
                error: "Assinatura do webhook inválida."
            });
        }

        // =====================================================
        // 9. ASSINATURA VÁLIDA
        // =====================================================

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