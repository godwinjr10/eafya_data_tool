import React, { useEffect, useMemo, useState } from "react";
import API from "../../helpers/api";

const defaultFilters = {
	search: "",
	gender: "",
	clinic_id: "",
	status: "",
	result: "",
	imaging_id: "",
	category_id: "",
	from_date: "",
	to_date: "",
	date_field: "date_created",
};

function Imaging() {
	const [filters, setFilters] = useState(defaultFilters);
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(25);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [orderBy, setOrderBy] = useState("date_created");
	const [orderDir, setOrderDir] = useState("desc");

	const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

	const fetchData = async () => {
		try {
			setLoading(true);
			const params = { ...filters, page, limit, order_by: orderBy, order_dir: orderDir };
			const { data: resp } = await API.get("/imaging", { params });
			setData(resp.data || []);
			setTotal(resp.pagination?.total || 0);
		} catch (e) {
			console.error("Failed to load imaging data", e);
			setData([]);
			setTotal(0);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [page, limit, orderBy, orderDir]);

	const onFilterChange = (e) => { const { name, value } = e.target; setFilters((p) => ({ ...p, [name]: value })); };
	const applyFilters = () => { setPage(1); fetchData(); };
	const resetFilters = () => { setFilters(defaultFilters); setPage(1); fetchData(); };

	const download = (fmt) => {
		const params = new URLSearchParams({ ...filters, format: fmt });
		const url = `${API.defaults.baseURL}/imaging/export?${params.toString()}`;
		const a = document.createElement("a"); a.href = url; a.target = "_blank"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
	};

	const toggleSort = (field) => { if (orderBy === field) setOrderDir((d) => (d === "asc" ? "desc" : "asc")); else { setOrderBy(field); setOrderDir("asc"); } };

	const formatDate = (d, withTime = false) => {
		if (!d) return "";
		const dt = new Date(d);
		return withTime ? dt.toLocaleString() : dt.toLocaleDateString();
	};

	return (
		<div className="container-fluid">
			<div className="card mb-3">
				<div className="card-header d-flex justify-content-between align-items-center">
					<h5 className="mb-0">Imaging</h5>
					<div>
						<button className="btn btn-sm btn-info me-2" onClick={() => download("csv")}>Export CSV</button>
						<button className="btn btn-sm btn-success" onClick={() => download("xlsx")}>Export Excel</button>
					</div>
				</div>
				<div className="card-body">
					<div className="row g-2">
						<div className="col-md-3">
							<label className="form-label">Search</label>
							<input name="search" value={filters.search} onChange={onFilterChange} className="form-control" placeholder="Imaging name, clinic, notes..." />
						</div>
						<div className="col-md-2">
							<label className="form-label">Gender</label>
							<select name="gender" value={filters.gender} onChange={onFilterChange} className="form-select">
								<option value="">All</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
						</div>
						<div className="col-md-2">
							<label className="form-label">Status</label>
							<input name="status" value={filters.status} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Imaging ID</label>
							<input name="imaging_id" value={filters.imaging_id} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Category ID</label>
							<input name="category_id" value={filters.category_id} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">From date</label>
							<input type="date" name="from_date" value={filters.from_date} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">To date</label>
							<input type="date" name="to_date" value={filters.to_date} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Date field</label>
							<select name="date_field" value={filters.date_field} onChange={onFilterChange} className="form-select">
								<option value="date_created">Date created</option>
								<option value="registered_date">Registered date</option>
								<option value="visit_date">Visit date</option>
								<option value="last_updated">Last updated</option>
							</select>
						</div>
						<div className="col-md-2 d-flex align-items-end">
							<button className="btn btn-primary me-2" onClick={applyFilters} disabled={loading}>Apply</button>
							<button className="btn btn-warning" onClick={resetFilters} disabled={loading}>Clear Filters</button>
						</div>
					</div>
				</div>
			</div>

			<div className="card">
				<div className="card-body table-responsive">
					<table className="table table-striped table-hover">
						<thead>
							<tr>
								<th onClick={() => toggleSort('date_created')} role="button">Date Created</th>
								<th onClick={() => toggleSort('registered_date')} role="button">Registered Date</th>
								<th onClick={() => toggleSort('visit_date')} role="button">Visit Date</th>
								<th>Last Updated</th>
								<th>Patient ID</th>
								<th>Birth Date</th>
								<th>Gender</th>
								<th>Clinic ID</th>
								<th>Clinic</th>
								<th>Visit No</th>
								<th>Visit Type</th>
								<th onClick={() => toggleSort('imaging_name')} role="button">Imaging</th>
								<th>Imaging ID</th>
								<th>Category</th>
								<th>Category ID</th>
								<th>Patient Imaging ID</th>
								<th>Encounter ID</th>
								<th>Origin</th>
								<th>Clinic Session ID</th>
								<th>Created By</th>
								<th>Encounter Notes</th>
								<th>Illness History</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr><td colSpan="23">Loading...</td></tr>
							) : data.length === 0 ? (
								<tr><td colSpan="23">No records found</td></tr>
							) : (
								data.map((row, idx) => (
									<tr key={idx}>
										<td>{formatDate(row.date_created, true)}</td>
										<td>{formatDate(row.registered_date)}</td>
										<td>{formatDate(row.visit_date)}</td>
										<td>{formatDate(row.last_updated, true)}</td>
										<td>{row.patient_id}</td>
										<td>{formatDate(row.birth_date)}</td>
										<td>{row.gender}</td>
										<td>{row.clinic_id}</td>
										<td>{row.clinic_name}</td>
										<td>{row.visit_no}</td>
										<td>{row.visit_type}</td>
										<td>{row.imaging_name}</td>
										<td>{row.imaging_id}</td>
										<td>{row.category}</td>
										<td>{row.category_id}</td>
										<td>{row.patient_imaging_id}</td>
										<td>{row.encounter_id}</td>
										<td>{row.origin}</td>
										<td>{row.clinic_session_id}</td>
										<td>{row.created_by_id}</td>
										<td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.encounter_notes}</td>
										<td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.illness_history}</td>
										<td>{row.status}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
					<div className="d-flex justify-content-between align-items-center">
						<div>
							<button className="btn btn-sm btn-outline-secondary me-2" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
							<span>Page {page} of {totalPages}</span>
							<button className="btn btn-sm btn-outline-secondary ms-2" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
						</div>
						<div className="d-flex align-items-center">
							<label className="me-2">Rows per page</label>
							<select className="form-select form-select-sm" style={{ width: 90 }} value={limit} onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}>
								<option value={10}>10</option>
								<option value={25}>25</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Imaging; 