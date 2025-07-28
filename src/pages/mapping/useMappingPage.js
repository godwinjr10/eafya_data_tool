import {
  useState,
  useEffect,
} from "react";
import API from "../../helpers/api";
import {
  getMappedItems,
  addMappedItem,
  updateMappedItem,
  deleteMappedItem,
} from "../../helpers/mappedItemsApi";

const useMappingPage = () => {
  // State management
  const [
    dataElements,
    setDataElements,
  ] = useState([]);
  const [
    loading,
    setLoading,
  ] = useState(false);
  const [
    selectedType,
    setSelectedType,
  ] = useState(null);
  const [
    selectedSection,
    setSelectedSection,
  ] = useState(null);
  const [
    currentSections,
    setCurrentSections,
  ] = useState([]);
  const [
    currentSectionItems,
    setCurrentSectionItems,
  ] = useState([]);
  const [
    searchResults,
    setSearchResults,
  ] = useState([]);
  const [
    searchLoading,
    setSearchLoading,
  ] = useState(false);
  const [
    currentSearch,
    setCurrentSearch,
  ] = useState([]);
  const categories = [
    "conditions",
    "labtests",
    "familyplanning",
    "commodities",
    "vaccines"
  ];
  const [
    selectedItems,
    setSelectedItems,
  ] = useState([]);
  const [
    mappedItems,
    setMappedItems,
  ] = useState([]);
  const [
    mappedLoading,
    setMappedLoading,
  ] = useState(false);
  const [
    selectedSectionItem,
    setSelectedSectionItem,
  ] = useState(null);

  const searchItems = async (
    query
  ) => {
    const res = await API.get(
      `/elements/all`
    );
    setCurrentSearch(
      res.data
    );
    return res.data;
  };

  // Fetch all data elements
  const fetchDataElements =
    async () => {
      setLoading(true);
      try {
        const response =
          await API.get(
            "/elements"
          );
        setDataElements(
          response.data
        );
      } catch (error) {
        setDataElements([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDataElements();
    searchItems();
  }, []);

  // Handle category selection
  const handleCategoryClick =
    async (category) => {
      setSelectedType(
        category
      );
      setSelectedSection(
        null
      );
      setCurrentSectionItems(
        []
      );
      // Get unique sections for this category
      const sections =
        Array.from(
          new Map(
            dataElements
              .filter(
                (item) =>
                  item.map_type ===
                  category
              )
              .map((item) => [
                item.section_id,
                {
                  id: item.section_id,
                  name: item.section_name,
                },
              ])
          ).values()
        );
      setCurrentSections(
        sections
      );
    };

  // Handle section selection
  const handleSectionClick =
    async (
      sectionId,
      sectionName
    ) => {
      setSelectedSection({
        id: sectionId,
        name: sectionName,
      });
      // Get items for this section
      const items =
        dataElements.filter(
          (item) =>
            item.section_id ===
            sectionId
        );
      setCurrentSectionItems(
        items
      );
      // Fetch mapped items for this section/data element
      setMappedLoading(true);
      try {
        const mapped =
          await getMappedItems(
            sectionId
          );
        setMappedItems(
          mapped
        );
      } catch (e) {
        setMappedItems([]);
      } finally {
        setMappedLoading(
          false
        );
      }
    };

  const fetchItems = async (
    id
  ) => {
    const response =
      await API.get(
        `/mapItems/${id}/items`
      );
    const items =
      response.data;
    setSelectedItems(items);
  };

  const fetchItemsCount = async (
    id
  ) => {
    const response =
      await API.get(
        `/mapItems/${id}/items/count`
      );
     return response.data;
  };

  const handleSectionItemClick =
    (item) => {
      fetchItems(item.id);
      setSelectedSectionItem(
        item
      );
    };

  const handleAddMappedItem =
    async (eafyaItem) => {
      if (
        !selectedSection ||
        !eafyaItem
      )
        return;
      const eafya_id =
        eafyaItem.id;
      const eafya_name =
        eafyaItem.name;
      await addMappedItem(
        selectedSectionItem.id,
        eafya_id,
        eafya_name
      );
      fetchItems(
        selectedSectionItem.id
      );
    };

  const handleUpdateMappedItem =
    async (
      itemId,
      eafya_id,
      eafya_name
    ) => {
      const updated =
        await updateMappedItem(
          itemId,
          eafya_id,
          eafya_name
        );
      setMappedItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? updated
            : item
        )
      );
    };

  const handleDeleteMappedItem =
    async (itemId) => {
      await deleteMappedItem(
        itemId
      );
      setMappedItems((prev) =>
        prev.filter(
          (item) =>
            item.id !== itemId
        )
      );
    };

  // Reset selections
  const resetSelections =
    () => {
      setSelectedType(null);
      setSelectedSection(
        null
      );
      setCurrentSections([]);
      setCurrentSectionItems(
        []
      );
    };

  const handleSearch = async (
    searchTerm
  ) => {
    setSearchLoading(true);
    try {
      const results =
        await searchItems(
          searchTerm
        );
      setSearchResults(
        results
      );
    } catch (e) {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelect = (
    item
  ) => {
    setSelectedItems((prev) =>
      prev.some(
        (i) =>
          i.id === item.id
      )
        ? prev
        : [...prev, item]
    );
  };

  return {
    dataElements,
    loading,
    selectedType,
    selectedSection,
    currentSections,
    currentSectionItems,
    searchResults,
    searchLoading,
    currentSearch,
    categories,
    selectedItems,
    mappedItems,
    mappedLoading,
    selectedSectionItem,
    handleCategoryClick,
    handleSectionClick,
    handleSectionItemClick,
    handleAddMappedItem,
    handleUpdateMappedItem,
    handleDeleteMappedItem,
    resetSelections,
    handleSearch,
    handleSelect,
    fetchItems,
    fetchItemsCount
  };
};

export default useMappingPage;
