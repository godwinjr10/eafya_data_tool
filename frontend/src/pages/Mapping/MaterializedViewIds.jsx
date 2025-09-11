import React, { useEffect, useState } from "react";
import {
  listMaterializedViewIds,
  createMaterializedViewId,
  updateMaterializedViewId,
  bulkAddMaterializedViewIds,
} from "../../helpers/mappedItemsApi";
import MappingDialog from "../../components/MappingDialog";
import MappingTable from "../../components/MappingTable";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const MaterializedViewIds = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", id_no: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTable, setSearchTable] = useState("clinic");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogItems, setDialogItems] = useState([]);
  const [dialogRow, setDialogRow] = useState(null);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.id_no) return;
    if (editingId) {
      await updateMaterializedViewId(editingId, form);
    } else {
      await createMaterializedViewId(form);
    }
    setForm({ name: "", id_no: "" });
    setEditingId(null);
    await load();
  };

  const inferTable = (text) => {
    const t = (text || "").toLowerCase();
    if (t.includes("clinic")) return "clinic";
    if (t.includes("ward")) return "ward";
    if (t.includes("vaccine")) return "vaccine";
    if (t.includes("store")) return "store";
    return "clinic";
  };

  const onEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, id_no: item.id_no });
    setSearchTable(inferTable(item.name));
  };

  const openMapDialog = (row) => {
    setDialogRow(row);
    setSearchTable(inferTable(row.name));
    setDialogOpen(true);
  };

  const handleDialogSave = async (selectedIds) => {
    if (!dialogRow || !Array.isArray(selectedIds) || selectedIds.length === 0)
      return;
    await bulkAddMaterializedViewIds(dialogRow.name, selectedIds);
    setDialogOpen(false);
    setDialogRow(null);
    await load();
  };

  const columns = [
    { accessor: "name", header: "Name" },

    {
      accessor: "actions",
      header: "Actions",
      width: '180px',
      render: (row) => (
        <div className="btn-group btn-group-sm" >
          <Link
            className="btn btn-outline-primary btn-sm me-2"
            to={`/materialized-ids/${encodeURIComponent(row.name)}`}
          >
            <FaEye /> View Details
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="container-fluid">

        <>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <MappingTable
              data={items}
              columns={columns}
              loading={loading}
              pageSize={10}
              searchable={true}
              filterable={true}
              sortable={true}
              emptyMessage="No customized items mappings found"
              className="mapping-table"
              onRowClick={() => {}}
            />
          )}
        </>

      <MappingDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleDialogSave}
        hmisName={dialogRow?.name || ""}
        section={""}
        eafyaItems={dialogItems}
        onEafyaItemsLoaded={setDialogItems}
        datasetCode={"HMIS1052_CONDITIONS"}
        searchEndpoint={`/materialized-view-ids/items?table=${searchTable}`}
      />
    </div>
  );
};

export default MaterializedViewIds;
