const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "token_to_verify_instagram_tanuj";

app.use(bodyParser.json());

// Endpoint for webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Endpoint to handle webhook events
app.post("/webhook", (req, res) => {
  const body = req.body;

  console.log("Received webhook:", body);

  // Process the webhook payload here

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
