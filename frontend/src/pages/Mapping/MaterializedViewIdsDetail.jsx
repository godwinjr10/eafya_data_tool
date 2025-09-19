import React, { useEffect, useState, useImperativeHandle, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  listMaterializedViewIdsByName,
  deleteMaterializedMapping,
  bulkAddMaterializedViewIds,
} from "../../helpers/mappedItemsApi";

const MaterializedViewIdsDetail = React.forwardRef(({ name: propName, onOpenDialog }, ref) => {
  const { name: urlName } = useParams();
  const name = propName || urlName;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTable, setSearchTable] = useState("clinic");
  const [dialogItems, setDialogItems] = useState([]);
  const [replaceTargetId, setReplaceTargetId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listMaterializedViewIdsByName(name);
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    const infer = (text) => {
      const t = (text || "").toLowerCase();
      if (t.includes("clinic")) return "clinic";
      if (t.includes("ward")) return "ward";
      if (t.includes("vaccine")) return "vaccine";
      if (t.includes("store")) return "store";
      return "clinic";
    };
    setSearchTable(infer(name));
    load();
  }, [name, load]);

  const onDelete = async (id) => {
    await deleteMaterializedMapping(name, id);
    await load();
  };

  const openAdd = () => {
    setReplaceTargetId(null);
    if (onOpenDialog) {
      onOpenDialog({
        hmisName: name,
        section: "",
        eafyaItems: dialogItems,
        onEafyaItemsLoaded: setDialogItems,
        datasetCode: "HMIS1052_CONDITIONS",
        searchEndpoint: `/materialized-view-ids/items?category=${searchTable}`,
        onSave: onSaveDialog
      });
    }
  };

  // Expose openAdd function to parent component via ref
  useImperativeHandle(ref, () => ({
    openAdd
  }));

  const openReplace = (rowId) => {
    setReplaceTargetId(rowId);
    if (onOpenDialog) {
      onOpenDialog({
        hmisName: name,
        section: "",
        eafyaItems: dialogItems,
        onEafyaItemsLoaded: setDialogItems,
        datasetCode: "HMIS1052_CONDITIONS",
        searchEndpoint: `/materialized-view-ids/items?category=${searchTable}`,
        onSave: onSaveDialog
      });
    }
  };

  const onSaveDialog = async (selectedIds) => {
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) return;
    if (replaceTargetId) {
      await deleteMaterializedMapping(name, replaceTargetId);
    }
    // Build mappings with names from dialogItems
    const idToName = new Map(dialogItems.map((it) => [String(it.id), it.name]));
    const mappings = selectedIds.map((id) => ({
      id: Number(id),
      name: idToName.get(String(id)) || null,
    }));
    await bulkAddMaterializedViewIds(name, {
      allData: {
        name,
        category:
          searchTable === "ward"
            ? "Wards"
            : searchTable === "clinic"
            ? "Clinics"
            : searchTable === "vaccine"
            ? "Vaccines"
            : searchTable === "store"
            ? "Stores"
            : null,
        mappings,
      },
    });
    setReplaceTargetId(null);
    await load();
  };

  const columns = [
    { accessor: "id", header: "Id" },
    { accessor: "name", header: "Name" },

    {
      accessor: "actions",
      header: "Actions",
      width: "180px",
      render: (r) => (
        <div className="btn-group btn-group-sm">
          <button
            className="btn btn-outline-primary"
            onClick={() => openReplace(r.id)}
          >
            Replace
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => onDelete(r.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      {loading ? (
        <div className="text-center py-3">Loading...</div>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                {columns.map((column) => (
                  <th key={column.accessor} className="fw-semibold">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((item, index) => (
                  <tr key={item.id || index}>
                    {columns.map((column) => (
                      <td key={column.accessor}>
                        {column.render ? column.render(item) : item[column.accessor] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-muted">
                    No customized items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

export default MaterializedViewIdsDetail;
