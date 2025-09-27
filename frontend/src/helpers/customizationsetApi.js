import API from "./api";

export const listCustomizationsets = async () => {
  const res = await API.get(`/customizationsets`);
  return res.data;
};

export const listCustomizationSetByName = async (name) => {
  const res = await API.get(
    `/customizationsets/${encodeURIComponent(name)}`
  );
  return res.data;
};

export const createCustomizationSet = async ({ name, id_no }) => {
  const res = await API.post(`/customizationsets`, { name, id_no });
  return res.data;
};

export const updateCustomizationSet = async (id, { name, id_no }) => {
  const res = await API.put(`/customizationsets/${id}`, { name, id_no });
  return res.data;
};

export const deleteCustomizationSet = async (id) => {
  const res = await API.delete(`/customizationsets/${id}`);
  return res.data;
};

export const deleteCustomizationSetMapping = async (name, mappingId) => {
  const res = await API.delete(
    `/customizationsets/${encodeURIComponent(
      name
    )}/mappings/${mappingId}`
  );
  return res.data;
};

export const searchReferenceItems = async (table, q) => {
  const res = await API.get(`/customizationsets/search`, {
    params: { table, q },
  });
  return res.data;
};

export const listReferenceItems = async (table, category) => {
  const res = await API.get(`/customizationsets/items`, {
    params: { table, category },
  });
  return res.data;
};

export const bulkAddCustomizationSets = async (name, payload) => {
  const res = await API.post(`/customizationsets/bulk`, {
    name,
    ...payload,
  });
  return res.data;
};
