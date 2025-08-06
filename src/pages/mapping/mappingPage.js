"use client";

import React from "react";
import useMappingPage from "./useMappingPage";
import SearchDropdown from "./searchItm";
import SectionPanel from "./SectionPanel";
import ItemsPanel from "./ItemsPanel";
import EafyaPanel from "./EafyaPanel";
import PaginationControls from "./PaginationControls";
import { SectionItemDetails } from "./utils";

const MappingPage = () => {
  const {
    sections,
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
  } = useMappingPage();

  // Styles
  const panelHeaderStyle = {
    padding: "12px 16px",
    backgroundColor:
      "#4a90e2",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    borderBottom:
      "1px solid #ddd",
  };

  const columnHeaderStyle = {
    padding: "8px 12px",
    backgroundColor:
      "#f8f9fa",
    fontWeight: "600",
    fontSize: "12px",
    borderBottom:
      "1px solid #ddd",
  };

  const renderPaginationControls =
    () => (
      <PaginationControls />
    );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor:
          "#f5f5f5",
      }}
    >
      {/* Left Panel - Sections */}
      <SectionPanel
        currentSections={
          sections
        }
        labTestSections={
          labTestSections
        }
        commoditySections={
          commoditySections
        }
        selectedSection={
          selectedSection
        }
        loading={loading}
        handleSectionClick={
          handleSectionClick
        }
        resetSelections={
          resetSelections
        }
        renderPaginationControls={
          renderPaginationControls
        }
        panelHeaderStyle={
          panelHeaderStyle
        }
        columnHeaderStyle={
          columnHeaderStyle
        }
      />

      {/* Middle Panel - Conditions */}
      <ItemsPanel
        currentSectionItems={
          currentSectionItems
        }
        selectedSection={
          selectedSection
        }
        renderSectionItemDetails={(
          item
        ) => (
          <SectionItemDetails
            key={item.id}
            item={item}
            handleSectionItemClick={
              handleSectionItemClick
            }
            fetchItemsCount={
              fetchItemsCount
            }
            selectedSectionItem={
              selectedSectionItem
            }
          />
        )}
        renderPaginationControls={
          renderPaginationControls
        }
        panelHeaderStyle={
          panelHeaderStyle
        }
        columnHeaderStyle={
          columnHeaderStyle
        }
      />

      {/* Right Panel - Eafya Items */}
      <EafyaPanel
        currentSearch={
          currentSearch
        }
        handleSelect={
          handleSelect
        }
        searchLoading={
          searchLoading
        }
        handleSearch={
          handleSearch
        }
        selectedItems={
          selectedItems
        }
        SearchDropdown={
          SearchDropdown
        }
        panelHeaderStyle={
          panelHeaderStyle
        }
        displayKey="name"
        searchKeys={["name"]}
        minSearchLength={2}
        mappedItems={
          mappedItems
        }
        mappedLoading={
          mappedLoading
        }
        onAddMappedItem={
          handleAddMappedItem
        }
        onUpdateMappedItem={
          handleUpdateMappedItem
        }
        onDeleteMappedItem={
          handleDeleteMappedItem
        }
        selectedSection={
          selectedSection
        }
        selectedSectionItem={
          selectedSectionItem
        }
        handleRemoveSelectedItem={
          handleRemoveSelectedItem
        }
      />
    </div>
  );
};

export default MappingPage;
