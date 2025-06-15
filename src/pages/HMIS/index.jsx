import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import DataEntryForm from '../../components/DataEntryForm';

const HMIS = () => {
    const [selectedSection, setSelectedSection] = useState('1.1');
    const [selectedDataSet, setSelectedDataSet] = useState('HMIS_105_01');

    const handleDataSetChange = (dataSetId) => {
        setSelectedDataSet(dataSetId);
        setSelectedSection('1.1');
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar
                selected={selectedSection}
                onSelect={setSelectedSection}
                dataSetId={selectedDataSet}
            />
            <div style={{ flex: 1, background: "#f9f9f9", padding: 20 }}>
                <DataEntryForm
                    section={selectedSection}
                    dataSetId={selectedDataSet}
                    onDataSetChange={handleDataSetChange}
                />
            </div>
        </div>
    );
};

export default HMIS;