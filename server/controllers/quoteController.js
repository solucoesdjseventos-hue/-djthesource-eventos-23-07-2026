const nodemailer = require('nodemailer');
const { addQuoteRow, getAllQuotes, deleteQuote } = require('../utils/db');
const { supabase } = require('../utils/supabaseClient');

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error(
      "SMTP configuration is required. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in .env",
    );
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
};

const sendQuote = async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, organizerEmail, quote } =
      req.body;
    if (!organizerEmail || !quote || !clientName || !clientEmail) {
      return res
        .status(400)
        .json({
          error:
            "organizerEmail, clientName, clientEmail and quote are required",
        });
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    try {
      await addQuoteRow({
        id,
        clientName: clientName || '',
        clientEmail: clientEmail || '',
        clientPhone: clientPhone || '',
        organizerEmail: organizerEmail || '',
        quoteText: JSON.stringify(quote),
        createdAt: new Date().toISOString(),
      });
    } catch (storeErr) {
      console.error('Erro ao salvar orçamento no DB local:', storeErr);
      return res.status(500).json({ error: 'Orçamento não pôde ser salvo no banco local.' });
    }

    const transporterConfigured =
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS;

    // persist quote to Supabase
    if (supabase) {
      const { data: orcamento, error: orcamentoError } = await supabase
        .from('orcamentos')
        .insert([{
          nome_cliente: clientName || '',
          email_cliente: clientEmail || '',
          telefone_cliente: clientPhone || '',
          nome_evento: quote.eventName || '',
          email_organizador: organizerEmail || '',
          valor_total: quote.total || 0
        }])
        .select('id')
        .single();

      if (orcamentoError) {
        console.error('Erro ao inserir orcamento no Supabase:', orcamentoError);
        return res.status(500).json({ error: 'Erro ao salvar orçamento no Supabase' });
      }

      const orcamentoId = orcamento?.id;
      const servicos = (quote.items || []).map(item => ({
        orcamento_id: orcamentoId,
        nome_servico: item.title || '',
        descricao: item.info || '',
        quantidade: 1,
        preco_unitario: item.total || 0
      }));

      if (servicos.length) {
        const { error: servicosError } = await supabase.from('orcamento_servicos').insert(servicos);
        if (servicosError) {
          console.error('Erro ao inserir servicos no Supabase:', servicosError);
          return res.status(500).json({ error: 'Erro ao salvar serviços do orçamento no Supabase' });
        }
      }
    } else {
      console.warn('Supabase não está configurado. Ajuste SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_KEY.');
    }

    const html = `
      <h1>Orçamento DJ The Source</h1>
      <p><strong>Cliente</strong>: ${clientName || "Não informado"}</p>
      <p><strong>Email</strong>: ${clientEmail || "Não informado"}</p>
      <p><strong>Telefone</strong>: ${clientPhone || "Não informado"}</p>
      <p><strong>Valor final</strong>: R$ ${quote.total.toFixed(2)}</p>
      <h2>Itens do orçamento</h2>
      <ul>
        ${quote.items.map((item) => `<li>${item.title} - ${item.info} - R$ ${item.total.toFixed(2)}</li>`).join("")}
      </ul>
      <p>Salão: ${quote.salon || "Não selecionado"}</p>
      <p>Mensagem enviada pelo sistema DJ The Source.</p>
    `;

    if (!transporterConfigured) {
      return res.json({
        status: "saved",
        warning:
          "Orçamento salvo no Supabase, mas o servidor SMTP não está configurado. Configure SMTP para enviar o email.",
      });
    }

    try {
      const transporter = createTransporter();
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: organizerEmail,
        subject: "Orçamento DJ The Source",
        html,
      });

      return res.json({ status: "sent", messageId: info.messageId });
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError);
      return res.json({
        status: "saved",
        warning: "Orçamento salvo no Supabase, mas o envio de email falhou.",
      });
    }
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return res
      .status(500)
      .json({ error: error.message || "Erro no servidor ao enviar email" });
  }
};

const listQuotes = async (req, res) => {
  try {
    const rows = await getAllQuotes();
    // parse quote JSON
    const parsed = rows.map((r) => ({
      id: r.id,
      clientName: r.clientName,
      clientEmail: r.clientEmail,
      clientPhone: r.clientPhone,
      organizerEmail: r.organizerEmail,
      quote: r.quoteText
        ? typeof r.quoteText === 'string'
          ? JSON.parse(r.quoteText)
          : r.quoteText
        : null,
      createdAt: r.createdAt,
    }));
    res.json(parsed);
  } catch (err) {
    console.error("Erro ao listar orçamentos:", err);
    res.status(500).json({ error: "Erro ao listar orçamentos" });
  }
};

const deleteQuoteHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "id is required" });
    const result = await deleteQuote(id);
    if (result && result.changes > 0) {
      return res.status(204).end();
    }
    return res.status(404).json({ error: "Orçamento não encontrado" });
  } catch (err) {
    console.error("Erro ao excluir orçamento:", err);
    return res.status(500).json({ error: "Erro ao excluir orçamento" });
  }
};

module.exports = { sendQuote, listQuotes, deleteQuoteHandler };
