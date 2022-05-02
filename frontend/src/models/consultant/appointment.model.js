export class AppointmentsModel {
  constructor() {
    this.booked = [];
    this.schedule = [];
  }
}
export class AppointmentItemModel {
  constructor(
    id = 0,
    title = "test appointment",
    startDate = new Date(2018, 5, 25, 9, 35),
    endDate = new Date(2018, 5, 25, 11, 30),
    status = "bookable"
  ) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.id = id;
    this.status = status;
  }
}
