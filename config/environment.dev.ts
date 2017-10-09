export const environment = {
  production: false,

  endPoint: "http://localhost:5375/api",

  domain: "",

  avatarUrl: "",

  serverUrl: "",

  apiUrls: {
    'loginUrl': "/login",
    "bangluong": "/employeePayroll",
    "profile": "/employeeInfo",
    "chamcong": "/employeeAttendance"
  },

  //For Moosic
  hotTrendUrl: 'mock/new-playlist.json',
  youLikeUrl: "mock/p1.json",
  recentlyUrl: "mock/p2.json",
  recommendNextUrl: "mock/p2.json",
  search1Url: "mock/p2.json",
  search2Url: "mock/p1.json",

  getUrl: function (apiName: string) {
    return this.endPoint + this.apiUrls[apiName];
  },

  localStorageVariablesName: {

  }
}
