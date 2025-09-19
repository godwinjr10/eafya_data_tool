import React, { useEffect, useState } from "react";
import { listMaterializedViewIds } from "../../helpers/mappedItemsApi";

const MaterializedViewIdsList = ({ onItemSelect, selectedItem }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listMaterializedViewIds();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-grid gap-1">
      {items.map((item) => (
        <button
          key={item.id}
          className={`btn text-start ${
            selectedItem === item.name 
              ? "btn-primary text-white" 
              : "btn-outline-primary"
          }`}
          onClick={() => onItemSelect && onItemSelect(item.name)}
          style={{ minHeight: "32px", fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
        >
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <div className={`${
                selectedItem === item.name ? "text-white" : "text-dark"
              }`}>
                {item.name}
              </div>
            </div>
            {selectedItem === item.name && (
              <i className="fas fa-check-circle text-white ms-2" style={{ fontSize: "0.7rem" }}></i>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default MaterializedViewIdsList;
