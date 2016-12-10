export const environment ={
  production: false,

  endPoint: "",

  apiUrls: {

  },

  getUrl: function (apiName:string) {
    return this.endPoint + this.apiUrls[apiName]
  },

  localStorageVariablesName: {}

}
