import * as React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import Paper from "@mui/material/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import { grey } from "@mui/material/colors";
import {
  Scheduler,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  ViewSwitcher,
  DayView,
  WeekView,
  MonthView,
  DateNavigator,
  TodayButton,
  Toolbar,
  EditRecurrenceMenu,
  AllDayPanel,
  ConfirmationDialog,
  Resources,
} from "@devexpress/dx-react-scheduler-material-ui";
import { actionFetchBookedSchedule } from "../actions/consultant.action";

class CalendarDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentDate: moment().format("YYYY-MM-DD"),
      resources: [
        {
          fieldName: "status",
          title: "Status",
          instances: [
            { id: "booked", text: "Booked", color: "#ec407a" },
            { id: "bookable", text: "Bookable", color: "#64b5f6" },
          ],
        },
      ],
      addedAppointment: {},
      appointmentChanges: {},
      editingAppointment: undefined,
      currentViewName: "work-week",
    };

    this.currentViewNameChange = (currentViewName) => {
      this.setState({ currentViewName });
    };
    this.currentDateChange = (currentDate) => {
      this.setState({ currentDate });
    };

    this.commitChanges = this.commitChanges.bind(this);
    this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
    this.changeEditingAppointment = this.changeEditingAppointment.bind(this);
  }

  changeAddedAppointment(addedAppointment) {
    this.setState({ addedAppointment });
  }

  changeAppointmentChanges(appointmentChanges) {
    this.setState({ appointmentChanges });
  }

  changeEditingAppointment(editingAppointment) {
    this.setState({ editingAppointment });
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
      }
      if (deleted !== undefined) {
        data = data.filter((appointment) => appointment.id !== deleted);
      }
      return { data };
    });
  }

  render() {
    const {
      currentDate,
      addedAppointment,
      appointmentChanges,
      editingAppointment,
      currentViewName,
      resources,
    } = this.state;
    const data = this.props.appointments.booked;

    return (
      <Paper>
        <Scheduler data={data} height={600}>
          <ViewState
            currentDate={currentDate}
            currentViewName={currentViewName}
            onCurrentDateChange={this.currentDateChange}
            onCurrentViewNameChange={this.currentViewNameChange}
          />
          <EditingState
            onCommitChanges={this.commitChanges}
            addedAppointment={addedAppointment}
            onAddedAppointmentChange={this.changeAddedAppointment}
            appointmentChanges={appointmentChanges}
            onAppointmentChangesChange={this.changeAppointmentChanges}
            editingAppointment={editingAppointment}
            onEditingAppointmentChange={this.changeEditingAppointment}
          />
          <WeekView startDayHour={0} endDayHour={24} />
          <WeekView
            name="work-week"
            displayName="Work Week"
            excludedDays={[0, 6]}
            startDayHour={9}
            endDayHour={19}
          />
          <MonthView />
          <DayView />

          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <ViewSwitcher />
          <AllDayPanel />
          <EditRecurrenceMenu />
          <ConfirmationDialog />
          <Appointments />
          <AppointmentTooltip showDeleteButton />
          <AppointmentForm />
          <Resources data={resources} mainResourceName="status" />
        </Scheduler>
      </Paper>
    );
  }
}

CalendarDashboard.defaultProps = {};
CalendarDashboard.propTypes = {
  appointments: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ appointments: state.appointments });

export default connect(mapStateToProps, {})(CalendarDashboard);
