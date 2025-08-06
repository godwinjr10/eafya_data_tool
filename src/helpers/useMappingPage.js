import { useState, useEffect } from "react";
import API from "./api";

const useMappingPage = () => {
  // State management for the simplified conditions-only mapping
  const [conditions, setConditions] = useState([]);
  const [labTestSections, setLabTestSections] = useState([]);
  const [commoditySections, setCommoditySections] = useState([]);
  const [vaccineSections, setVaccineSections] = useState([]);
  const [antenatalSections, setAntenatalSections] = useState([]);
  const [postnatalSections, setPostnatalSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentSectionItems, setCurrentSectionItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [mappedItems, setMappedItems] = useState([]);
  const [mappedLoading, setMappedLoading] = useState(false);
  const [selectedSectionItem, setSelectedSectionItem] = useState(null);

  // Fetch sections using the new unified API
  const fetchSections = async () => {
    setLoading(true);
    try {
      // Fetch all categories in parallel
      // Fetch all sections data at once
      const response = await API.get("/mapping/items/all-sections");

      // Filter sections by type with expanded categories
      const conditions = response.data.filter((section) =>
        section.id.startsWith("1.3.")
      );

      const labTestSections = response.data.filter((section) =>
        section.id.startsWith("10.")
      );

      const commoditySections = response.data.filter(
        (section) => section.id === "6"
      );

      // Add new section categories
      const vaccineSections = response.data.filter(
        (section) =>
          section.id.startsWith("7.") ||
          section.name.toLowerCase().includes("vaccine")
      );

      const antenatalSections = response.data.filter(
        (section) =>
          section.id.startsWith("2.") ||
          section.name.toLowerCase().includes("antenatal")
      );

      const postnatalSections = response.data.filter(
        (section) =>
          section.id.startsWith("3.") ||
          section.name.toLowerCase().includes("postnatal")
      );

      // Update state with filtered sections
      setConditions(conditions || []);
      setLabTestSections(labTestSections || []);
      setCommoditySections(commoditySections || []);
      setVaccineSections(vaccineSections || []);
      setAntenatalSections(antenatalSections || []);
      setPostnatalSections(postnatalSections || []);

      console.log("Sections loaded:", {
        conditions: conditions?.length || 0,
        labTests: labTestSections?.length || 0,
        commodities: commoditySections?.length || 0,
        vaccines: vaccineSections?.length || 0,
        antenatal: antenatalSections?.length || 0,
        postnatal: postnatalSections?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching sections:", error);
      setConditions([]);
      setLabTestSections([]);
      setCommoditySections([]);
    } finally {
      setLoading(false);
    }
  };

  // Search for EAFYA items
  const searchItems = async (query = "") => {
    try {
      const searchParam = query ? `?search=${encodeURIComponent(query)}` : "";
      const response = await API.get(`mapping/items/eafya-items${searchParam}`);
      const items = response.data || [];
      setCurrentSearch(items);
      return items;
    } catch (error) {
      console.error("Error searching items:", error);
      setCurrentSearch([]);
      return [];
    }
  };

  useEffect(() => {
    fetchSections(); // Now fetches all sections in parallel
    searchItems(); // Load initial items
  }, []);

  // Handle section selection - use data from unified API
  const handleSectionClick = async (sectionId, sectionName) => {
    console.log("Section clicked:", sectionId, sectionName);

    // Find the section in our loaded data
    const section = [
      ...conditions,
      ...labTestSections,
      ...commoditySections,
      ...vaccineSections,
      ...antenatalSections,
      ...postnatalSections,
    ].find((s) => s.id === sectionId);

    if (!section) {
      console.error("Section not found:", sectionId);
      return;
    }

    setSelectedSection({
      id: sectionId,
      name: sectionName,
      count: section.count,
    });

    setSelectedSectionItem(null);
    setMappedItems([]);

    // Data is already loaded in the section object
    setCurrentSectionItems(section.data || []);
  };

  // Handle condition selection - fetch mappings for that condition
  const handleSectionItemClick = async (condition) => {
    console.log("Condition clicked:", condition);
    setSelectedSectionItem(condition);
    setMappedLoading(true);

    try {
      const response = await API.get(
        `mapping/items/conditions/${condition.id}/mappings`
      );
      console.log("Mappings response:", response.data);
      setMappedItems(response.data || []);
    } catch (error) {
      console.error("Error fetching mappings for condition:", error);
      setMappedItems([]);
    } finally {
      setMappedLoading(false);
    }
  };

  // Fetch items count (for backward compatibility)
  const fetchItemsCount = async (conditionId) => {
    try {
      const response = await API.get(
        `mapping/items/conditions/${conditionId}/mappings`
      );
      return {
        count: (response.data || []).length,
      };
    } catch (error) {
      console.error("Error fetching items count:", error);
      return { count: 0 };
    }
  };

  // Add a new mapping between a condition and an EAFYA item
  const handleAddMappedItem = async (eafyaItem) => {
    if (!selectedSectionItem || !eafyaItem) {
      console.error("Missing selectedSectionItem or eafyaItem");
      return;
    }

    try {
      const response = await API.post(
        `mapping/items/conditions/${selectedSectionItem.id}/mappings`,
        {
          eafya_id: eafyaItem.id,
          eafya_name: eafyaItem.name,
        }
      );

      console.log("Mapping added:", response.data);

      // Refresh mappings
      await handleSectionItemClick(selectedSectionItem);

      // Remove the item from selected items
      setSelectedItems((prev) =>
        prev.filter((item) => item.id !== eafyaItem.id)
      );

      return response.data;
    } catch (error) {
      console.error("Error adding mapped item:", error);
      if (error.response?.status === 409) {
        alert("This mapping already exists!");
      } else if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Failed to add mapping. Please try again.");
      }
    }
  };

  // Update an existing mapping
  const handleUpdateMappedItem = async (mappingId, eafya_id, eafya_name) => {
    if (!mappingId) {
      console.error("Missing mappingId");
      return;
    }

    try {
      const response = await API.put(`mapping/items/mappings/${mappingId}`, {
        eafya_id,
        eafya_name,
      });

      console.log("Mapping updated:", response.data);

      // Refresh mappings
      if (selectedSectionItem) {
        await handleSectionItemClick(selectedSectionItem);
      }

      return response.data;
    } catch (error) {
      console.error("Error updating mapped item:", error);
      if (error.response?.status === 409) {
        alert("A mapping with this EAFYA item already exists!");
      } else if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Failed to update mapping. Please try again.");
      }
    }
  };

  // Delete a mapping
  const handleDeleteMappedItem = async (mappingId) => {
    if (!mappingId) {
      console.error("Missing mappingId");
      return;
    }

    try {
      await API.delete(`mapping/items/mappings/${mappingId}`);

      console.log("Mapping deleted");

      // Refresh mappings
      if (selectedSectionItem) {
        await handleSectionItemClick(selectedSectionItem);
      }
    } catch (error) {
      console.error("Error deleting mapped item:", error);
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert("Failed to delete mapping. Please try again.");
      }
    }
  };

  // Reset selections
  const resetSelections = () => {
    setSelectedSection(null);
    setSelectedSectionItem(null);
    setCurrentSectionItems([]);
    setMappedItems([]);
    setSelectedItems([]);
  };

  // Handle search
  const handleSearch = async (searchTerm) => {
    setSearchLoading(true);
    try {
      const results = await searchItems(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle select item
  const handleSelect = (item) => {
    if (!item || !item.id) {
      console.error("Invalid item selected");
      return;
    }

    setSelectedItems((prev) => {
      // Check if already selected
      if (prev.some((i) => i.id === item.id)) {
        return prev; // Don't add duplicates
      }
      return [...prev, item];
    });
  };

  // Remove item from selection
  const handleRemoveSelectedItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return {
    // State
    conditions,
    setConditions,
    labTestSections,
    commoditySections,
    vaccineSections,
    antenatalSections,
    postnatalSections,
    loading,
    selectedSection,
    currentSectionItems,
    searchResults,
    searchLoading,
    currentSearch,
    selectedItems,
    mappedItems,
    mappedLoading,
    selectedSectionItem,

    // Event handlers
    handleSectionClick,
    handleSectionItemClick,
    handleAddMappedItem,
    handleUpdateMappedItem,
    handleDeleteMappedItem,
    resetSelections,
    handleSearch,
    handleSelect,
    handleRemoveSelectedItem,
    fetchItemsCount,

    // Utility functions
    searchItems,
    fetchSections,
  };
};

export default useMappingPage;
