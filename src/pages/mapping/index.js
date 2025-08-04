"use client";

import React from "react";
import useMappingPage from "../../helpers/useMappingPage";
import SearchDropdown from "../../components/MappingSearch";
import SectionPanel from "./SectionPanel";
import ItemsPanel from "./ItemsPanel";
import EafyaPanel from "./EafyaPanel";
import { SectionItemDetails } from "../../components/SectionItemDetails";

const MappingPage = () => {
  const {
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

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
      }}
      className="row "
    >
      {/* Left Panel - Sections */}
      <SectionPanel
        conditions={conditions}
        labTestSections={labTestSections}
        commoditySections={commoditySections}
        selectedSection={selectedSection}
        loading={loading}
        handleSectionClick={handleSectionClick}
        resetSelections={resetSelections}
      />

      {/* Middle Panel - Conditions */}
      <ItemsPanel
        currentSectionItems={currentSectionItems}
        selectedSection={selectedSection}
        renderSectionItemDetails={(item) => (
          <SectionItemDetails
            key={item.id}
            item={item}
            handleSectionItemClick={handleSectionItemClick}
            fetchItemsCount={fetchItemsCount}
            selectedSectionItem={selectedSectionItem}
          />
        )}
      />

      {/* Right Panel - Eafya Items */}
      <EafyaPanel
        currentSearch={currentSearch}
        handleSelect={handleSelect}
        searchLoading={searchLoading}
        handleSearch={handleSearch}
        selectedItems={selectedItems}
        SearchDropdown={SearchDropdown}
        displayKey="name"
        searchKeys={["name"]}
        minSearchLength={2}
        mappedItems={mappedItems}
        mappedLoading={mappedLoading}
        onAddMappedItem={handleAddMappedItem}
        onUpdateMappedItem={handleUpdateMappedItem}
        onDeleteMappedItem={handleDeleteMappedItem}
        selectedSection={selectedSection}
        selectedSectionItem={selectedSectionItem}
        handleRemoveSelectedItem={handleRemoveSelectedItem}
      />
    </div>
  );
};

export default MappingPage;
