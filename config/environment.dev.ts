export const environment = {
  production: false,

  endPoint: "http://localhost:5375/api",

  domain: "",

  avatarUrl: "",

  serverUrl: "",

  apiUrls: {
    'loginUrl': "/login",
    "bangluong": "/employeePayroll",
    "profile":"/employeeInfo",
    "chamcong":"/employeeAttendance"
  },

  getUrl: function (apiName: string) {
    return this.endPoint + this.apiUrls[apiName];
  },

  localStorageVariablesName: {

  } 
}
