import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

import MCH from '../pages/MCH';
import HMIS from '../pages/HMIS';
import Users from '../pages/Users';
import LabTest from '../pages/LabTests';
import Facility from '../pages/Facility';
import Login from '../pages/Auth/Login';
import Inpatient from '../pages/Inpatient';
import Outpatient from '../pages/Outpatient';
import Supplychain from '../pages/Supplychain';
import MainLayout from '../components/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import ProtectedRoute from '../helpers/Protected';
import MappingPage from '../pages/mapping';


const AppRoutes = () => {
  return (
    <Fragment>
      <Switch>
        <Route exact path="/" component={Login} />
        <MainLayout>
          <ProtectedRoute path="/hmis" component={HMIS} />
          <ProtectedRoute path="/lab" component={LabTest} />
          <ProtectedRoute path="/mch" component={MCH} />
          <ProtectedRoute path="/facility" component={Facility} />
          <ProtectedRoute path="/outpatient" component={Outpatient} />
          <ProtectedRoute path="/inpatient" component={Inpatient} />
          <ProtectedRoute path="/users" component={Users} />
          <ProtectedRoute path="/supplychain" component={Supplychain} />
          <ProtectedRoute path="/dashboard" exact component={Dashboard} />
          <ProtectedRoute path="/mapping" exact component={MappingPage} />
        </MainLayout>
      </Switch>
    </Fragment>
  );
};

export default AppRoutes;