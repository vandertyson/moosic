export const environment = {
  production: false,

  endPoint: "",

  domain: "",

  avatarUrl: "",

  serverUrl: "",

  apiUrls: {
    'loginUrl': "/login",
  },

  getUrl: function (apiName: string) {
    return this.endPoint + this.apiUrls[apiName];

  },

  localStorageVariablesName: {

  }
}
