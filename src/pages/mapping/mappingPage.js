"use client";

import React from "react";
import useMappingPage from "./useMappingPage";
import SearchDropdown from "./searchItm";
import CategoryPanel from "./CategoryPanel";
import SectionPanel from "./SectionPanel";
import ItemsPanel from "./ItemsPanel";
import EafyaPanel from "./EafyaPanel";
import PaginationControls from "./PaginationControls";
import {
  paginationButtonStyle,
  panelHeaderStyle,
  columnHeaderStyle,
} from "./mappingPageStyles";
import { SectionItemDetails } from "./utils";

const MappingPage = () => {
  const {
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
    fetchItemsCount,
  } = useMappingPage();

  // Render pagination controls as a function to pass to panels
  const renderPaginationControls =
    () => (
      <PaginationControls
        paginationButtonStyle={
          paginationButtonStyle
        }
        resetSelections={
          resetSelections
        }
      />
    );

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor:
          "#f5f5f5",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Left Panel - Categories */}
        <CategoryPanel
          categories={
            categories
          }
          selectedType={
            selectedType
          }
          loading={loading}
          handleCategoryClick={
            handleCategoryClick
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
        {/* Middle Panel - Sections */}
        <SectionPanel
          currentSections={
            currentSections
          }
          selectedType={
            selectedType
          }
          selectedSection={
            selectedSection
          }
          handleSectionClick={
            handleSectionClick
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
        {/* Right Panel - Section Items */}
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
              item={item}
              handleSectionItemClick={
                handleSectionItemClick
              }
              fetchItemsCount={
                fetchItemsCount
              }
              selectedSectionItem={selectedSectionItem}
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
        {/* Far Right Panel - Eafya/Search/Selected Items */}
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
          searchKeys={[
            "name",
            "id",
          ]}
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
        />
      </div>
    </div>
  );
};

export default MappingPage;
