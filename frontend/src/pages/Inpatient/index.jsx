import React, { useEffect, useMemo, useState } from "react";
import API from "../../helpers/api";

const defaultFilters = {
	search: "",
	gender: "",
	clinic_id: "",
	admission_ward_id: "",
	ward_id: "",
	admitting_doctor_id: "",
	assigned_doctor_id: "",
	is_closed: "",
	from_date: "",
	to_date: "",
	date_field: "admission_date",
};

const Inpatient = () => {
	const [filters, setFilters] = useState(defaultFilters);
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(25);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [orderBy, setOrderBy] = useState("admission_date");
	const [orderDir, setOrderDir] = useState("desc");
	const [sortChanged, setSortChanged] = useState(false);

	const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

	const buildParams = () => {
		const params = { page, limit };
		// Include filters only when they have values
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				params[key] = value;
			}
		});
		// Only include date_field if a date filter is applied
		if (!filters.from_date && !filters.to_date) {
			delete params.date_field;
		}
		// Include sorting only after user changes it
		if (sortChanged) {
			params.order_by = orderBy;
			params.order_dir = orderDir;
		}
		return params;
	};

	const fetchData = async () => {
		try {
			setLoading(true);
			const params = buildParams();
			const { data: resp } = await API.get("/inpatient", { params });
			setData(resp.data || []);
			setTotal(resp.pagination?.total || 0);
		} catch (e) {
			console.error("Failed to load inpatient data", e);
			setData([]);
			setTotal(0);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [page, limit, orderBy, orderDir]);

	const onFilterChange = (e) => { const { name, value } = e.target; setFilters((p) => ({ ...p, [name]: value })); };
	const applyFilters = () => { setPage(1); fetchData(); };
	const resetFilters = () => { setFilters(defaultFilters); setPage(1); setSortChanged(false); setOrderBy("admission_date"); setOrderDir("desc"); fetchData(); };

	const download = (fmt) => {
		const params = new URLSearchParams({ ...buildParams(), format: fmt });
		const url = `${API.defaults.baseURL}/inpatient/export?${params.toString()}`;
		const a = document.createElement("a"); a.href = url; a.target = "_blank"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
	};

	const toggleSort = (field) => {
		setSortChanged(true);
		if (orderBy === field) setOrderDir((d) => (d === "asc" ? "desc" : "asc"));
		else { setOrderBy(field); setOrderDir("asc"); }
	};

	const formatDate = (d, withTime = false) => { if (!d) return ""; const dt = new Date(d); return withTime ? dt.toLocaleString() : dt.toLocaleDateString(); };

	return (
		<div className="container-fluid">
			<div className="card mb-3">
				<div className="card-header d-flex justify-content-between align-items-center">
					<h5 className="mb-0">Inpatient Admissions</h5>
					<div>
						<button className="btn btn-sm btn-info me-2" onClick={() => download("csv")}>Export CSV</button>
						<button className="btn btn-sm btn-success" onClick={() => download("xlsx")}>Export Excel</button>
					</div>
				</div>
				<div className="card-body">
					<div className="row g-2">
						<div className="col-md-3">
							<label className="form-label">Search</label>
							<input name="search" value={filters.search} onChange={onFilterChange} className="form-control" placeholder="Name, ward, clinic, notes..." />
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
							<label className="form-label">Clinic ID</label>
							<input name="clinic_id" value={filters.clinic_id} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Admission Ward ID</label>
							<input name="admission_ward_id" value={filters.admission_ward_id} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Ward ID</label>
							<input name="ward_id" value={filters.ward_id} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Admitting Doctor ID</label>
							<input name="admitting_doctor_id" value={filters.admitting_doctor_id} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Assigned Doctor ID</label>
							<input name="assigned_doctor_id" value={filters.assigned_doctor_id} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Closed</label>
							<select name="is_closed" value={filters.is_closed} onChange={onFilterChange} className="form-select">
								<option value="">All</option>
								<option value="true">Yes</option>
								<option value="false">No</option>
							</select>
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
								<option value="admission_date">Admission date</option>
								<option value="date_created">Date created</option>
								<option value="discharge_date">Discharge date</option>
								<option value="last_updated">Last updated</option>
								<option value="medical_discharge_date">Medical discharge date</option>
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
								<th onClick={() => toggleSort('admission_date')} role="button">Admission Date</th>
								<th>Patient</th>
								<th>Gender</th>
								<th>DOB</th>
								<th>Clinic</th>
								<th>Ward</th>
								<th>Admitting Doctor</th>
								<th>Assigned Doctor</th>
								<th>Closed</th>
								<th>Discharge Date</th>
								<th>Notes</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr><td colSpan="11">Loading...</td></tr>
							) : data.length === 0 ? (
								<tr><td colSpan="11">No records found</td></tr>
							) : (
								data.map((row, idx) => (
									<tr key={idx}>
										<td>{formatDate(row.admission_date, true)}</td>
										<td>{row.first_name} {row.last_name}</td>
										<td>{row.gender}</td>
										<td>{formatDate(row.birth_date)}</td>
										<td>{row.clinic_name}</td>
										<td>{row.admission_ward_name}</td>
										<td>{row.admitting_doctor_id}</td>
										<td>{row.assigned_doctor_id}</td>
										<td>{String(row.is_closed)}</td>
										<td>{formatDate(row.discharge_date)}</td>
										<td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.encounter_notes}</td>
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
};

export default Inpatient;
