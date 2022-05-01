export class AppointmentsModel {
  constructor() {
    this.booked = [];
  }
}
export class AppointmentItemModel {
  constructor(
    id = 0,
    title = "test appointment",
    startDate = new Date(2018, 5, 25, 9, 35),
    endDate = new Date(2018, 5, 25, 11, 30)
  ) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.id = id;
  }
}
