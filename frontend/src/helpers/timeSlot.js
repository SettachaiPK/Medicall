import moment from "moment";
var slotConfig = {
  configSlotHours: "00",
  configSlotMinutes: "15",
  configSlotPreparation: "00",
  timeArr: [{ startTime: "00:00", endTime: "24:00" }],
};

export function createSlots(scheduleArr, date) {
  // Getting values from slotConfig using destructuring
  const { configSlotHours, configSlotMinutes, configSlotPreparation, timeArr } =
    slotConfig;
  let _intersectionScheduleArr = scheduleArr.filter(
    ({ startDate, endDate }) => {
      return moment(date).isBetween(
        moment(startDate),
        moment(endDate),
        "day",
        "[]"
      );
    }
  );
  let defaultDate = new Date().toISOString().substring(0, 10);
  let slotsArray = [];
  let _timeArrStartTime;
  let _timeArrEndTime;
  let _tempSlotStartTime;
  let _endSlot;
  let _startSlot;
  // Loop over timeArr
  for (var i = 0; i < timeArr.length; i++) {
    // Creating time stamp using time from timeArr and default date
    _timeArrStartTime = new Date(
      defaultDate + " " + timeArr[i].startTime
    ).getTime();
    _timeArrEndTime = new Date(
      defaultDate + " " + timeArr[i].endTime
    ).getTime();
    _tempSlotStartTime = _timeArrStartTime;

    // Loop around till _tempSlotStartTime is less end time from timeArr
    while (
      new Date(_tempSlotStartTime).getTime() <
      new Date(_timeArrEndTime).getTime()
    ) {
      _endSlot = new Date(_tempSlotStartTime);
      _startSlot = new Date(_tempSlotStartTime);

      //Adding minutes and hours from config to create slot and overiding the value of _tempSlotStartTime
      _tempSlotStartTime = _endSlot.setHours(
        parseInt(_endSlot.getHours()) + parseInt(configSlotHours)
      );
      _tempSlotStartTime = _endSlot.setMinutes(
        parseInt(_endSlot.getMinutes()) + parseInt(configSlotMinutes)
      );

      // Check _tempSlotStartTime is less than end time after adding minutes and hours, if true push into slotsArr
      if (
        new Date(_tempSlotStartTime).getTime() <=
        new Date(_timeArrEndTime).getTime()
      ) {
        // Check for time slot status compare to _intersectionScheduleArr
        var momentStartSlot = moment(
          `${moment(date).format("YYYY-MM-DD")}-${moment(_startSlot).format(
            "HH-mm"
          )}`,
          "YYYY-MM-DD-hh-mm"
        );
        var slotStatus = "unbookable";
        _intersectionScheduleArr.forEach(
          ({ startDate, endDate, scheduleStatus }) => {
            if (
              momentStartSlot.isBetween(
                moment(startDate),
                moment(endDate),
                null,
                "[)"
              )
            ) {
              slotStatus = scheduleStatus;
            }
          }
        );

        // DateTime object is converted to time with the help of javascript functions
        // If you want 24 hour format you can pass hour12 false
        slotsArray.push({
          timeSlotStart: moment(_startSlot).format("HH:mm"),
          timeSlotEnd: moment(_endSlot).format("HH:mm"),
          dateSlotStart: moment(
            `${moment(date).format("YYYY-MM-DD")}-${moment(_startSlot).format(
              "HH-mm"
            )}`,
            "YYYY-MM-DD-hh-mm"
          ).format(),
          /*timeSlotStart: new Date(_startSlot).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
          timeSlotEnd: _endSlot.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),*/
          status: slotStatus,
        });
      }

      //preparation time is added in last to maintain the break period
      _tempSlotStartTime = _endSlot.setMinutes(
        _endSlot.getMinutes() + parseInt(configSlotPreparation)
      );
    }
  }
  return slotsArray;
}
