import express from 'express';
import nodemailer from 'nodemailer';
import { createMollieClient } from '@mollie/api-client';
import { lookup } from '../shared/menu/index.js';

const { MOLLIE_KEY, SMTP_HOST, SMTP_USER, SMTP_PASS, BASE_URL, SHOP_MAIL } = process.env;
const mollie = createMollieClient({ apiKey: MOLLIE_KEY });
const mail = nodemailer.createTransport({ host: SMTP_HOST, port: 587, auth: { user: SMTP_USER, pass: SMTP_PASS } });
const orders = new Map(); // productie: vervang door database

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/api/checkout', async (req, res) => {
  try {
    const { customer, lines } = req.body;
    // prijzen opnieuw berekenen op de server (nooit de client vertrouwen)
    const priced = lines.map((l) => {
      const { item, options } = lookup[l.id];
      const i = options.indexOf(l.opt);
      return { name: item.name, opt: l.opt, qty: l.qty, price: item.prices[i] };
    });
    const total = priced.reduce((s, l) => s + l.price * l.qty, 0);
    const payment = await mollie.payments.create({
      amount: { currency: 'EUR', value: total.toFixed(2) },
      description: 'Bestelling Excelsior Snack',
      redirectUrl: `${BASE_URL}/?betaald`,
      webhookUrl: `${BASE_URL}/api/webhook`,
      locale: 'nl_BE',
    });
    orders.set(payment.id, { customer, priced, total });
    res.json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Betaling kon niet gestart worden' });
  }
});

app.post('/api/webhook', async (req, res) => {
  const payment = await mollie.payments.get(req.body.id);
  const o = orders.get(payment.id);
  if (payment.isPaid() && o && !o.sent) {
    o.sent = true;
    const rows = o.priced.map((l) => `${l.qty}x ${l.name} (${l.opt}) - ${(l.price * l.qty).toFixed(2)} €`).join('\n');
    await mail.sendMail({
      from: SMTP_USER,
      to: SHOP_MAIL, // bestellingen@excelsiorsnack.be
      subject: `Nieuwe bestelling - ${o.customer.name} - afhaling ${o.customer.time}`,
      text: `${rows}\n\nTotaal: ${o.total.toFixed(2)} € (BETAALD)\n\nNaam: ${o.customer.name}\nGSM: ${o.customer.phone}\nOpmerking: ${o.customer.note || '-'}`,
    });
  }
  res.sendStatus(200);
});

app.listen(3001, () => console.log('Server op :3001'));