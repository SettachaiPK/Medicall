export class AxiosModel {
    constructor(data) {
        this.url = data.url? data.url: null;
        this.param = data.param? data.param: null;
        this.checkRefreshToken = data.checkRefreshToken? data.checkRefreshToken: false;
    }

    changeParam( data = '' ) {
        this.param = data
    }
}