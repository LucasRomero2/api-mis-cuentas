/**
 * Aplica filtros dinamicos a una consulta.
 * Se hará una consulta where sobre cada nombre de propiedad dentro de filters y tendra q ser
 * igual al valor.
 *
 * @param {object} ref Referencia a una colleccion de Firebase
 * @param {object} filters {name: "Billetera", amount: 2000}
 */
const applyDynamicFilters = (ref, filters) => {
  filters = Object.entries(filters);

  filters.forEach((filter) => {
    let [key, val] = filter;

    ref = ref.where(key, "==", val);
  });

  return ref;
};

module.exports = applyDynamicFilters;
