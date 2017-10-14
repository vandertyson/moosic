export const environment = {
  production: false,

  endPoint: "",

  apiUrls: {

  },

  avatarUrl: "",

  //For Moosic
  hotTrendUrl: "",
  youLikeUrl: "",
  recentlyUrl: "",
  recommendNextUrl: "",
  search1Url: "",
  search2Url: "",
  feedBackUrl:"",

  getUrl: function (apiName: string) {
    return this.endPoint + this.apiUrls[apiName]
  },

  localStorageVariablesName: {}

}
