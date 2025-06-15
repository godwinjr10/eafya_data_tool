import React from 'react';
import { Switch, Route } from 'react-router-dom';

import MCH from '../pages/MCH';
import HMIS from '../pages/HMIS';
import LabTest from '../pages/LabTests';
import Inpatient from '../pages/Inpatient';
import Outpatient from '../pages/Outpatient';
import Supplychain from '../pages/Supplychain';
import MainLayout from '../components/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';

const AppRoutes = () => {
  return (
    <MainLayout>
      <Switch>
        <Route path="/hmis" component={HMIS} />
        <Route path="/lab" component={LabTest} />
        <Route path="/mch" component={MCH} />
        <Route path="/outpatient" component={Outpatient} />
        <Route path="/inpatient" component={Inpatient} />
        <Route path="/supplychain" component={Supplychain} />
        <Route path="/" exact component={Dashboard} />
      </Switch>
    </MainLayout>
  );
};

export default AppRoutes;