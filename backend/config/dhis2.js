import axios from "axios";

const dhis2Api = axios.create({
    baseURL: 'https://customization.health.go.ug/hmis/api',
    auth: {
      username: 'eafya_integration',
      password: 'Inte4fy@d',
    },
    headers: {
      "Content-Type": "application/json",
    },
  });


  export default dhis2Api;