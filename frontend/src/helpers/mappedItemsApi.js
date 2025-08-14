import API from "./api";

// Get mapped items for a data element
export const getMappedItems =
  async (dataElementId) => {
    const res = await API.get(
      `/mapItems/${dataElementId}/items`
    );
    return res.data;
  };

// Add a mapped item
export const addMappedItem =
  async (
    dataElementId,
    eafya_id,
    eafya_name
  ) => {
 
    const res =
      await API.post(
        `/mapItems/${dataElementId}/items`,
        {
          eafya_id,
          eafya_name,
        }
      );
    return res.data;
  };

// Update a mapped item
export const updateMappedItem =
  async (
    itemId,
    eafya_id,
    eafya_name
  ) => {
    const res = await API.put(
      `/mapItems/items/${itemId}`,
      { eafya_id, eafya_name }
    );
    return res.data;
  };

// Delete a mapped item
export const deleteMappedItem =
  async (itemId) => {
    const res =
      await API.delete(
        `/mapItems/items/${itemId}`
      );
    return res.data;
  };
