export class ConsultantScheduleModel {
  constructor() {
    this.consultantSchedule = [];
  }
}
export class ConsultantScheduleItemModel {
  constructor(
    startDate = new Date(2018, 5, 25, 9, 35),
    endDate = new Date(2018, 5, 25, 11, 30),
    status = "bookable"
  ) {
    this.timeSlotStart = startDate;
    this.timeSlotEnd = endDate;
    this.status = status;
  }
}
