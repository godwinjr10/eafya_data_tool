import React, { useState, useEffect } from "react";
import API from "../../../helpers/api";

const RadiologyImaging = ({ section, selectedMonth, selectedYear }) => {
  const [imagingData, setImagingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImagingData = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/hmis108/patient-imaging`);
      setImagingData(response.data);
    } catch (error) {
      console.error("Error fetching patient imaging data:", error);
      setImagingData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImagingData();
  }, []);

  if (loading) {
    return (
      <div className="card mb-4">
      
         
        
        <div className="card-body">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-3">Loading imaging data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
    
    
      
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th rowSpan="2">Category</th>
                <th rowSpan="2">Imaging Type</th>
                <th colSpan="2">0-4 Years</th>
                <th colSpan="2">5+ Years</th>
              </tr>
              <tr>
                <th>Male</th>
                <th>Female</th>
                <th>Male</th>
                <th>Female</th>
              </tr>
            </thead>
            <tbody>
              {imagingData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <strong>{item.category_name}</strong>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item.imaging_name || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item.male_0_4 || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item.female_0_4 || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item.male_5_plus || 0}
                    </span>
                  </td>
                  <td>
                    <span className="form-control-plaintext">
                      {item.female_5_plus || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RadiologyImaging;
