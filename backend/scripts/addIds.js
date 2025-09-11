import MaterializedViewIdsModel from "../models/materializedViewIds.js";

const addIds = async () => {
  const materializedViewIds = [
    { name: "Maternity Ward", category: "Wards" },
    { name: "Postnantal Ward", category: "Wards" },
    { name: "Main Store", category: "Stores" },
    { name: "HPV Vaccine", category: "Vaccines" },
    { name: "Antenatal Clinic", category: "Clinics" },
    { name: "Major Theatre", category: "Theatres" },
  ];
  try {
    // Seed distinct names with categories (no mapping yet)
    for (const row of materializedViewIds) {
      await MaterializedViewIdsModel.findOrCreate({
        where: { name: row.name, mapping_id: 0 },
        defaults: {
          name: row.name,
          category: row.category,
          mapping_id: 0,
          mapping_name: null,
        },
      });
    }
    console.log("Seeded materialized view names");
  } catch (error) {
    console.log("ERROR", error);
  }
};

addIds();
