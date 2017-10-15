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
  feedBackUrl: "",
  artistUrl: "mock/artist.json",
  genrUrl: "mock/genre.json",
  tagsUrl:"mock/tags.json",

  getUrl: function (apiName: string) {
    return this.endPoint + this.apiUrls[apiName];

  },

  localStorageVariablesName: {

  }
}
