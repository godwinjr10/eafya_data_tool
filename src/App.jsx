import React from 'react';
import MainLayout from './components/MainLayout';
import DataEntryForm from './components/DataEntryForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <MainLayout>
      <DataEntryForm />
    </MainLayout>
  );
}

export default App; 