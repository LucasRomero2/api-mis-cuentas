const functions = require("firebase-functions");
const admin = require("firebase-admin");
const applyDynamicFilters = require("../helpers/applyDynamicFilters");
const app = !admin.apps.length ? admin.initializeApp() : admin.app();
const db = app.firestore();
const accountCtrl = {};

/**
 * Obtiene todas las cuentas activas de un usuario
 *
 * Puede recibir filtros y aplicarse dinamicamente
 *
 * @returns {Array} [{id, user_uid, name, icon_url, initial_balance, disabled, is_wallet}, {...}]
 */
accountCtrl.getAccounts = async (req, res) => {
  const userUID = req.params.userUID;
  const filters = req.query.filters ? JSON.parse(req.query.filters) : null;

  try {
    let accountsRef = db.collection("accounts");

    accountsRef = accountsRef
      .where("user_uid", "==", userUID)
      .where("disabled", "==", false);

    if (filters) {
      accountsRef = applyDynamicFilters(accountsRef, filters);
    }

    const accountsQuery = await accountsRef.get();

    const response = accountsQuery.docs.map((doc) => ({
      id: doc.id,
      user_uid: doc.data().user_uid,
      name: doc.data().name,
      icon_url: doc.data().icon_url,
      initial_balance: doc.data().initial_balance,
      disabled: doc.data().disabled,
      is_wallet: doc.data().is_wallet,
    }));

    return res.status(200).json(response);
  } catch (error) {
    functions.logger.error("Error obteniendo las cuentas", error);
    return res.status(400).send("Error obteniendo las cuentas");
  }
};

/**
 * Crea una cuenta en Firestore
 *
 * @param {object} req.body {user_uid, name, icon_url}
 * @return {string} Mensaje con id de la cuenta creada
 */
accountCtrl.createAccount = async (req, res) => {
  const payload = { ...req.body, is_wallet: false, disabled: false };
  try {
    const accountCreated = await db.collection("accounts").add(payload);

    return res
      .status(201)
      .json(`Se ha creado la cuenta con id: ${accountCreated.id}`);
  } catch (error) {
    functions.logger.error("Error creando la cuenta", error);

    return res.status(400).send("Error creando la cuenta");
  }
};

module.exports = accountCtrl;
