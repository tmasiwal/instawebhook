const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = "token_to_verify_instagram_tanuj";
const ACCESS_TOKEN =
  "EAAWSNNZAupnkBO6HcFZAQHOQYEvpkZAl0L6jrZAN9pPuuGLsGzl4Ne1dZCIfUfvZBJqCZB0CHP6f5Mu0fMFCf4UN5Xm5XCc2dgpNmrrrlvvmW4nagyiWE8SzZAxVKOCKxio34sf6jHzGghJHeuZAf2PhqJDD15tiQa5X4byYJEHkZAgZB2fCgPV8dbGzDWikNxemDFrZCtayn5ZAor6Iin1UYjCtN467fotAZD"; // Replace with your actual Instagram access token

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
  console.log("this is post request")
  const body = req.body;

  console.log("Received webhook:", body);

  // Check if the webhook is for a message and contains the text "hello"
  if (body.object === "instagram" && body.entry) {
    body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        console.log(event);
        if (
          event.message &&
          event.message.text &&
          event.message.text.toLowerCase() === "hello"
        ) {
          const senderId = event.sender.id;

          // Send a reply
          sendMessage(senderId, "Hello, how are you?");
        }
      });
    });
  }

  res.sendStatus(200);
});

// Function to send a message using Instagram's API
function sendMessage(recipientId, messageText) {
  const url = `https://graph.facebook.com/v13.0/me/messages?access_token=${ACCESS_TOKEN}`;

  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
    },
  };

  axios
    .post(url, messageData)
    .then((response) => {
      console.log("Message sent successfully:", response.data);
    })
    .catch((error) => {
      console.error(
        "Error sending message:",
        error.response ? error.response.data : error.message
      );
    });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
