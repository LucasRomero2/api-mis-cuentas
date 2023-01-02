const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const app = express();

admin.initializeApp();
app.use(cors());

exports.app = functions.https.onRequest(app);

exports.newUser = functions.auth.user().onCreate(async (user) => {
  try {
    const accountData = {
      name: "Billetera",
      icon_url: "https://iedhiggzgrkhvvelhcks.supabase.co/storage/v1/object/public/images/accountsLogos/wallet-1.png",
      initial_balance: 0,
      disabled: false,
      is_wallet: true
    }

    await db.collection("accounts").add(accountData);
  } catch (error) {
    functions.logger.error("Error creando la billetera", error);
  }
});