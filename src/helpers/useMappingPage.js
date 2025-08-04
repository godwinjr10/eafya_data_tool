import { useState, useEffect } from "react";
import API from "./api";

const useMappingPage = () => {
  // State management for the simplified conditions-only mapping
  const [conditions, setConditions] = useState([]);
  const [labTestSections, setLabTestSections] = useState([]);
  const [commoditySections, setCommoditySections] = useState([]);
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

  // Fetch sections from the new API
  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await API.get("/conditions-mapping/sections");
      console.log("Sections API response:", response.data);
      setConditions(response.data || []);
    } catch (error) {
      console.error("Error fetching sections:", error);
      setConditions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabTestSections = async () => {
    setLoading(true);
    try {
      const response = await API.get("/conditions-mapping/labTest/sections");
      console.log("Lab TestSections API response:", response.data);
      setLabTestSections(response.data || []);
    } catch (error) {
      console.error("Error fetching lab test   sections:", error);
      setLabTestSections([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommoditySections = async () => {
    setLoading(true);
    try {
      const response = await API.get("/conditions-mapping/commodity/sections");
      console.log("Commodity Sections API response:", response.data);
      setCommoditySections(response.data || []);
    } catch (error) {
      console.error("Error fetching commodity sections:", error);
      setCommoditySections([]);
    } finally {
      setLoading(false);
    }
  };

  // Search for EAFYA items
  const searchItems = async (query = "") => {
    try {
      const searchParam = query ? `?search=${encodeURIComponent(query)}` : "";
      const response = await API.get(
        `/conditions-mapping/eafya-items${searchParam}`
      );
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
    fetchSections();
    fetchCommoditySections();
    fetchLabTestSections();
    searchItems(); // Load initial items
  }, []);

  // Handle section selection - fetch conditions for that section
  const handleSectionClick = async (sectionId, sectionName) => {
    console.log("Section clicked:", sectionId, sectionName);
    setSelectedSection({
      id: sectionId,
      name: sectionName,
    });
    setSelectedSectionItem(null);
    setMappedItems([]);

    try {
      const response = await API.get(
        `/conditions-mapping/sections/${sectionId}/conditions`
      );
      console.log("Conditions response:", response.data);
      setCurrentSectionItems(response.data || []);
    } catch (error) {
      console.error("Error fetching conditions for section:", error);
      setCurrentSectionItems([]);
    }
  };

  // Handle condition selection - fetch mappings for that condition
  const handleSectionItemClick = async (condition) => {
    console.log("Condition clicked:", condition);
    setSelectedSectionItem(condition);
    setMappedLoading(true);

    try {
      const response = await API.get(
        `/conditions-mapping/conditions/${condition.id}/mappings`
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
        `/conditions-mapping/conditions/${conditionId}/mappings`
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
        `/conditions-mapping/conditions/${selectedSectionItem.id}/mappings`,
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
      const response = await API.put(
        `/conditions-mapping/mappings/${mappingId}`,
        {
          eafya_id,
          eafya_name,
        }
      );

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
      await API.delete(`/conditions-mapping/mappings/${mappingId}`);

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
    conditions,
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
