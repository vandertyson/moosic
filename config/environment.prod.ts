export const environment = {
  production: false,

  endPoint: "",

  domain: "",

  avatarUrl: "",

  serverUrl: "",

  apiUrls: {
    'loginUrl': "/login",
  },

  //For Moosic
  hotTrendUrl:"",
  youLikeUrl:"",
  recentlyUrl:"",
  recommendNextUrl:"",
  search1Url: "mock/p2.json",
  search2Url: "mock/p1.json",
  feedBackUrl:"",

  getUrl: function (apiName: string) {
    return this.endPoint + this.apiUrls[apiName];

  },

  localStorageVariablesName: {

  }
}
