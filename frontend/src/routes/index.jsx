import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";

import MCH from "../pages/MCH";
import HMIS from "../pages/HMIS";
import Users from "../pages/Users";
import LabTest from "../pages/LabTests";
import Facility from "../pages/Facility";
import Login from "../pages/Auth/Login";
import Inpatient from "../pages/Inpatient";
import Outpatient from "../pages/Outpatient";
import Supplychain from "../pages/Supplychain";
import MainLayout from "../components/MainLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "../helpers/Protected";
import Mapping from "../pages/Mapping";
import EafyaMapping from "../pages/Mapping";
import MappingDetail from "../pages/Mapping/dhis2/MappingDetail";
import CustomizationSetDetails from "../pages/Mapping/customizationsets/CustomizationSetDetails";
import Imaging from "../pages/Imaging";
import Theatre from "../pages/Theatre";
import FamilyPlanning from "../pages/FamilyPlanning";

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
          <ProtectedRoute path="/mapping" exact component={EafyaMapping} />
          <ProtectedRoute path="/mapping/:mappingType/:id" component={MappingDetail} />
          <ProtectedRoute path="/materialized-ids/:name" component={CustomizationSetDetails} />
          <ProtectedRoute path="/mappingtest" exact component={Mapping} />
          <ProtectedRoute path="/imaging" exact component={Imaging} />
          <ProtectedRoute path="/theatre" exact component={Theatre} />
          <ProtectedRoute path="/familyplanning" exact component={FamilyPlanning} />
        </MainLayout>
      </Switch>
    </Fragment>
  );
};

export default AppRoutes;
