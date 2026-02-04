import * as React from "react";
import Dashboard from "./Dashboard/Dashboard";
import configuration from "../config/dashboardConfigExample.json";
const MainComponent = ({ spfxContext }: any) => {
  return <Dashboard context={spfxContext} config={configuration}/>;
};

export default MainComponent;