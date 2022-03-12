export class ConsultingModel {
  constructor(jobDetail) {
    this.destination = jobDetail ? jobDetail.destination : "";
    this.type = jobDetail ? jobDetail.type : "voice";
    this.jobID = jobDetail ? jobDetail.jobID : "";
    this.role = jobDetail ? jobDetail.role : "customer";
    this.isReceivingCall = jobDetail ? true : false;
    this.isCalling = false;
    this.isSelfReady = false;
    this.isDestinationReady = false;
    this.step = 0;
    this.StartTime = "00.00";
    this.EndTime = "00.00";
    this.TotalTime = "15 min";
  }
}
