const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(bodyParser.json());

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

bot.command('open_link', (ctx) => {
  ctx.reply('Please visit this link: https://ahab.co.in');
});

bot.command('terms', (ctx) => {
  ctx.reply('Please review and agree to the following terms:');
  ctx.reply('Condition Terms: https://link-to-terms.com');
  ctx.reply('Privacy Policy: https://link-to-privacy.com');
  ctx.reply('Subscription Rules: https://link-to-rules.com');
});

bot.on('text', (ctx) => {
  const feedback = ctx.message.text;
  fetch(`${SERVER_URL}/sendFeedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feedback, user: ctx.from.username }),
  })
    .then(response => response.ok ? ctx.reply('Your feedback has been sent!') : ctx.reply('Failed to send your feedback.'))
    .catch(() => ctx.reply('An error occurred. Please try again.'));
});

app.post('/sendFeedback', (req, res) => {
  const { feedback, user } = req.body;
  console.log(`Feedback from ${user}: ${feedback}`);
  res.sendStatus(200);
});

bot.launch();
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});
