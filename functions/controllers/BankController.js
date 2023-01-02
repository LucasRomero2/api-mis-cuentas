const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = !admin.apps.length ? admin.initializeApp() : admin.app();
const db = app.firestore();
const banksCtrl = {};

/** Obtiene todos los bancos de Firestore
 *
 * @returns {Array} [{id, name, icon_url}, {...}]
 */
banksCtrl.getBanks = async (req, res) => {
  try {
    const banskQuery = await db.collection("banks").get();

    const response = banskQuery.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      icon_url: doc.data().icon_url,
    }));

    return res.status(200).json(response);
  } catch (error) {
    functions.logger.error(`Error obteniendo todas los bancos`, error);
    return res.status(500).json(error);
  }
};

module.exports = banksCtrl;
