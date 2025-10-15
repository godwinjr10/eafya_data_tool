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
// import Mapping from "../pages/Mapping";
// import EafyaMapping from "../pages/Mapping";
// import MappingDetail from "../pages/Mapping/dhis2/Conditions";
// import CustomizationSetDetails from "../pages/Mapping/customizationsets/CustomizationSetDetails";
import Imaging from "../pages/Imaging";
import Theatre from "../pages/Theatre";
import FamilyPlanning from "../pages/FamilyPlanning";

import MappingTest from "../pages/MappingTest";
import MappingDetail from "../pages/MappingTest/dhis2/Conditions/MappingDetail";
import CommoditiesDetail from "../pages/MappingTest/dhis2/Commodities/CommoditiesDetail";
import LabTestsDetail from "../pages/MappingTest/dhis2/LabTests/LabTestsDetail";
import FamilyPlanningDetail from "../pages/MappingTest/dhis2/FamilyPlanning/FamilyPlanningDetail";
import VaccinesDetail from "../pages/MappingTest/dhis2/Vaccines/VaccinesDetail";
import ProceduresDetail from "../pages/MappingTest/dhis2/Procedures/ProceduresDetail";
import ImagingDetail from "../pages/MappingTest/dhis2/Imaging/ImagingDetail";

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
          {/* <ProtectedRoute path="/mapping" exact component={EafyaMapping} /> */}
          {/* <ProtectedRoute path="/mapping/details" component={MappingDetail} /> */}
          {/* <ProtectedRoute path="/materialized-ids/:name" component={CustomizationSetDetails} /> */}
          {/* <ProtectedRoute path="/mappingtest" exact component={Mapping} /> */}
          <ProtectedRoute path="/imaging" exact component={Imaging} />
          <ProtectedRoute path="/theatre" exact component={Theatre} />
          <ProtectedRoute path="/familyplanning" exact component={FamilyPlanning} />
          <ProtectedRoute path="/mapping" exact component={MappingTest} />
          <ProtectedRoute path="/mapping/:id" exact component={MappingDetail} />
          <ProtectedRoute path="/mapping/commodities/:id" exact component={CommoditiesDetail} />
          <ProtectedRoute path="/mapping/labtests/:id" exact component={LabTestsDetail} />
          <ProtectedRoute path="/mapping/familyplanning/:id" exact component={FamilyPlanningDetail} />
          <ProtectedRoute path="/mapping/vaccines/:id" exact component={VaccinesDetail} />
          <ProtectedRoute path="/mapping/procedures/:id" exact component={ProceduresDetail} />
          <ProtectedRoute path="/mapping/imaging/:id" exact component={ImagingDetail} />
        </MainLayout>
      </Switch>
    </Fragment>
  );
};

export default AppRoutes;
