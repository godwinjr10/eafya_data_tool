import React, { useEffect, useMemo, useState } from "react";
import API from "../../helpers/api";

const defaultFilters = {
	search: "",
	gender: "",
	clinic_id: "",
	visit_type: "",
	theater_id: "",
	major_theater_id: "",
	major_theater_room_id: "",
	from_date: "",
	to_date: "",
	date_field: "date_created",
};

function Theatre() {
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
			const { data: resp } = await API.get("/theatre", { params });
			setData(resp.data || []);
			setTotal(resp.pagination?.total || 0);
		} catch (e) {
			console.error("Failed to load theatre data", e);
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
		const url = `${API.defaults.baseURL}/theatre/export?${params.toString()}`;
		const a = document.createElement("a"); a.href = url; a.target = "_blank"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
	};

	const toggleSort = (field) => { if (orderBy === field) setOrderDir((d) => (d === "asc" ? "desc" : "asc")); else { setOrderBy(field); setOrderDir("asc"); } };
	const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "");
	const formatDateTime = (d) => (d ? new Date(d).toLocaleString() : "");

	return (
		<div className="container-fluid">
			<div className="card mb-3">
				<div className="card-header d-flex justify-content-between align-items-center">
					<h5 className="mb-0">Theatre</h5>
					<div>
						<button className="btn btn-sm btn-info me-2" onClick={() => download("csv")}>Export CSV</button>
						<button className="btn btn-sm btn-success" onClick={() => download("xlsx")}>Export Excel</button>
					</div>
				</div>
				<div className="card-body">
					<div className="row g-2">
						<div className="col-md-3">
							<label className="form-label">Search</label>
							<input name="search" value={filters.search} onChange={onFilterChange} className="form-control" placeholder="Name, theatre, category, room, notes..." />
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
							<label className="form-label">Visit Type</label>
							<input name="visit_type" value={filters.visit_type} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Theater ID</label>
							<input name="theater_id" value={filters.theater_id} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Major Theatre ID</label>
							<input name="major_theater_id" value={filters.major_theater_id} onChange={onFilterChange} className="form-control" />
						</div>
						<div className="col-md-2">
							<label className="form-label">Room ID</label>
							<input name="major_theater_room_id" value={filters.major_theater_room_id} onChange={onFilterChange} className="form-control" />
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
								<option value="scheduled_date">Scheduled date</option>
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
								<th>Scheduled Date</th>
								<th>Scheduled Time</th>
								<th>Patient ID</th>
								<th>Visit No</th>
								<th>First Name</th>
								<th>Last Name</th>
								<th>Birth Date</th>
								<th>Gender</th>
								<th>Clinic ID</th>
								<th>Visit Type</th>
								<th>Theater ID</th>
								<th>Major Theatre</th>
								<th>Category</th>
								<th>Room</th>
								<th>Patient Major Theatre ID</th>
								<th>Major Theatre ID</th>
								<th>Major Theatre Room ID</th>
								<th>Encounter ID</th>
								<th>Origin</th>
								<th>Clinic Session ID</th>
								<th>Administered By</th>
								<th>Created By</th>
								<th>Encounter Notes</th>
								<th>Illness History</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr><td colSpan="28">Loading...</td></tr>
							) : data.length === 0 ? (
								<tr><td colSpan="28">No records found</td></tr>
							) : (
								data.map((row, idx) => (
									<tr key={idx}>
										<td>{formatDateTime(row.date_created)}</td>
										<td>{formatDate(row.registered_date)}</td>
										<td>{formatDate(row.scheduled_date)}</td>
										<td>{row.scheduled_time}</td>
										<td>{row.patient_id}</td>
										<td>{row.visit_no}</td>
										<td>{row.first_name}</td>
										<td>{row.last_name}</td>
										<td>{formatDate(row.birth_date)}</td>
										<td>{row.gender}</td>
										<td>{row.clinic_id}</td>
										<td>{row.visit_type}</td>
										<td>{row.theater_id}</td>
										<td>{row.major_theater_name}</td>
										<td>{row.category}</td>
										<td>{row.room}</td>
										<td>{row.patient_major_theatre_id}</td>
										<td>{row.major_theater_id}</td>
										<td>{row.major_theater_room_id}</td>
										<td>{row.enounter_id}</td>
										<td>{row.origin}</td>
										<td>{row.clinic_session_id}</td>
										<td>{row.administered_by_id}</td>
										<td>{row.created_by_id}</td>
										<td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.encounter_notes}</td>
										<td style={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.illness_history}</td>
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

export default Theatre; 