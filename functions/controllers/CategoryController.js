const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = !admin.apps.length ? admin.initializeApp() : admin.app();
const db = app.firestore();
const categoryCtrl = {};

/**
 * Obtiene todas las categorias de Firestore
 *
 * @returns {Array} [{id, name, icon, icon_color, user_uid, type}, {...}]
 */
categoryCtrl.getCategories = async (req, res) => {
  try {
    const categoriesQuery = await db.collection("categories").get();

    const response = categoriesQuery.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      icon: doc.data().icon,
      icon_color: doc.data().icon_color,
      user_uid: doc.data().user_uid || null,
      type: doc.data().type,
    }));

    return res.status(200).json(response);
  } catch (error) {
    functions.logger.error(`Error obteniendo las categorias`, error);
    return res.status(400).send("Error obteniendo las categorias");
  }
};

/**
 * Crea una categoria en Firestore
 *
 * @param {object} req.body {name, icon, icon_color, user_uid, type}
 * @return {string} Mensaje con id de la categoria creada
 */
categoryCtrl.createCategory = async (req, res) => {
  try {
    const categoryCreated = await db.collection("categories").add(req.body);

    return res
      .status(201)
      .json(`Se ha creado la categoria con id: ${categoryCreated.id}`);
  } catch (error) {
    functions.logger.error("Error creando la categoria", error);

    return res.status(400).send("Error creando la categoria");
  }
};

/**
 * Edita una categoria en Firestore
 *
 * @param {object} req.body {name, icon, icon_color}
 * @return {string} Mensaje con id de la categoria editada
 */
categoryCtrl.updateCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const categoryRef = db.collection("categories").doc(id);
    const categoryToEdit = await categoryRef.get();

    if (categoryToEdit.exists) {
      await categoryRef.update(req.body);

      return res
        .status(200)
        .json(`Se ha editado la categoria con id: ${id}`);
    } else {
      functions.logger.error(`No se encontro la categoria con id: ${id}`);

      return res.status(400).send(`No se encontro la categoria con id: ${id}`);
    }
  } catch (error) {
    functions.logger.error(
      `Error actualizando la categoria con id: ${id}`,
      error
    );

    return res.status(400).send("Error editando la categoria");
  }
};

/**
 * Elimina una categoria en Firestore
 *
 * @param {string} req.params.id ID de la categoria a eliminar
 * @return {string} Mensaje con id de la categoria eliminada
 */
categoryCtrl.deleteCategory = async (req, res) => {
  /* TODO: Add validacion que si tiene movimientos no puede eliminarse. */
  const id = req.params.id;

  try {
    await db.collection("categories").doc(id).delete();

    return res.status(200).json(`Categoria eliminada, id: ${id}`);
  } catch (error) {
    functions.logger.error(
      `Error eliminando la categoria con id: ${id}`,
      error
    );

    return res.status(400).send("Error eliminando la categoria");
  }
};

module.exports = categoryCtrl;
