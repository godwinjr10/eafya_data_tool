import API from "./api";

// Get mapped items for a data element
export const getMappedItems = async (dataElementId) => {
  const res = await API.get(`/mapItems/${dataElementId}/items`);
  return res.data;
};

// Add a mapped item
export const addMappedItem = async (dataElementId, eafya_id, eafya_name) => {
  const res = await API.post(`/mapItems/${dataElementId}/items`, {
    eafya_id,
    eafya_name,
  });
  return res.data;
};

// Update a mapped item
export const updateMappedItem = async (itemId, eafya_id, eafya_name) => {
  const res = await API.put(`/mapItems/items/${itemId}`, {
    eafya_id,
    eafya_name,
  });
  return res.data;
};

// Delete a mapped item
export const deleteMappedItem = async (itemId) => {
  const res = await API.delete(`/mapItems/items/${itemId}`);
  return res.data;
};

// Materialized View IDs API
export const listMaterializedViewIds = async () => {
  const res = await API.get(`/materialized-view-ids`);
  return res.data; // [{ name, category }]
};

export const listMaterializedViewIdsByName = async (name) => {
  const res = await API.get(
    `/materialized-view-ids/by-name/${encodeURIComponent(name)}`
  );
  return res.data; // [{ id, name }]
};

export const createMaterializedViewId = async ({ name, id_no }) => {
  const res = await API.post(`/materialized-view-ids`, { name, id_no });
  return res.data;
};

export const updateMaterializedViewId = async (id, { name, id_no }) => {
  const res = await API.put(`/materialized-view-ids/${id}`, { name, id_no });
  return res.data;
};

export const deleteMaterializedViewId = async (id) => {
  const res = await API.delete(`/materialized-view-ids/${id}`);
  return res.data;
};

export const deleteMaterializedMapping = async (name, mappingId) => {
  const res = await API.delete(
    `/materialized-view-ids/by-name/${encodeURIComponent(
      name
    )}/mappings/${mappingId}`
  );
  return res.data;
};

// Search reference tables: table = clinic | ward | vaccine | store; q = query string
export const searchReferenceItems = async (table, q) => {
  const res = await API.get(`/materialized-view-ids/search`, {
    params: { table, q },
  });
  return res.data;
};

export const listReferenceItems = async (table, category) => {
  const res = await API.get(`/materialized-view-ids/items`, {
    params: { table, category },
  });
  return res.data; // [{ id, name }]
};

export const bulkAddMaterializedViewIds = async (name, payload) => {
  // payload can be { mappings: [{id,name}], ids: [], table }
  const res = await API.post(`/materialized-view-ids/bulk`, {
    name,
    ...payload,
  });
  return res.data;
};
