export class ConsultantDetailModel {
  constructor() {
    this.userID = null;
    this.firstName = "";
    this.lastName = "";
    this.sex = "";
    this.detail = "";
    this.messagePrice = 0;
    this.voiceCallPrice = 0;
    this.videoCallPrice = 0;
    this.onlineStatus = "online";
    this.avatar = "";
    this.ocupation = "";
    this.department = "";
    this.infirmary = "";
    this.academy = "";
    this.tags = [];
    this.rating = 5;
    this.reviews = [
      { rating: 5, createDate: "2022-03-14T10:52:34.685Z", reason: "" },
    ];
  }
}
