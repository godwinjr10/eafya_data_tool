import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  listMaterializedViewIdsByName,
  deleteMaterializedMapping,
  bulkAddMaterializedViewIds,
} from "../../helpers/mappedItemsApi";
import MappingDialog from "../../components/MappingDialog";
import MappingTable from "../../components/MappingTable";
import { FaArrowLeft, FaPlus } from "react-icons/fa";

const MaterializedViewIdsDetail = () => {
  const { name } = useParams();
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTable, setSearchTable] = useState("clinic");
  const [dialogItems, setDialogItems] = useState([]);
  const [replaceTargetId, setReplaceTargetId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listMaterializedViewIdsByName(name);
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

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
  }, [name]);

  const onDelete = async (id) => {
    await deleteMaterializedMapping(name, id);
    await load();
  };

  const openAdd = () => {
    setReplaceTargetId(null);
    setDialogOpen(true);
  };

  const openReplace = (rowId) => {
    setReplaceTargetId(rowId);
    setDialogOpen(true);
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
    setDialogOpen(false);
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
      <div className="row">
        <div className="bg-primary bg-opacity-10 text-primary p-4 mb-4 rounded col-12">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item">
                    <button
                      className="btn btn-link p-0 text-primary text-decoration-none"
                      onClick={() => history.push("/mapping")}
                    >
                      <FaArrowLeft className="me-1" />
                      Materialized IDs
                    </button>
                  </li>
                  <li
                    className="breadcrumb-item active text-primary"
                    aria-current="page"
                  >
                    {name} Detail
                  </li>
                </ol>
              </nav>
              <h1 className="display-6 text-primary fw-bold mb-2">{name}</h1>
            </div>
            <div className="col-lg-4 mt-3 mt-lg-0">
              <div className="d-flex justify-content-end">
                <button className="btn btn-primary" onClick={openAdd}>
                  <FaPlus className="me-2" />
                  Add Mapping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {" "}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <MappingTable
            data={rows}
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
        onSave={onSaveDialog}
        hmisName={name}
        section={""}
        eafyaItems={dialogItems}
        onEafyaItemsLoaded={setDialogItems}
        datasetCode={"HMIS1052_CONDITIONS"}
        searchEndpoint={`/materialized-view-ids/items?category=${searchTable}`}
      />
    </div>
  );
};

export default MaterializedViewIdsDetail;
