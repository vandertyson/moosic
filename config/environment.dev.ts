export const environment = {
  production: false,

  endPoint: "http://localhost:8000/recommended_system/",

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
  hotTrendUrl: 'hot-trends',
  youLikeUrl: "mock/p1.json",
  recentlyUrl: "mock/p2.json",
  recommendNextUrl: "mock/p2.json",
  search1Url: "tracks",
  search2Url: "mock/p1.json",
  feedBackUrl: "",
  artistUrl: "mock/artist.json",
  genrUrl: "mock/genre.json",
  tagsUrl:"mock/category.json",

  getUrl: function (apiName: string) {
    return this.endPoint + this.apiUrls[apiName];
  },

  localStorageVariablesName: {

  }
}
