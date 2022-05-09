import * as React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
import {
  actionDeleteSchedule,
  actionFetchSchedule,
} from "../actions/consultant.action";

export const appointments = [
  {
    title: "Website Re-Design Plan",
    startDate: new Date(2018, 5, 25, 9, 35),
    endDate: new Date(2018, 5, 25, 11, 30),
    id: 0,
    location: "Room 1",
    status: "booked",
  },
];

class ManageSchedule extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: appointments,
      currentDate: "2018-06-27",
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
      data: appointments,
      currentViewName: "Week",
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
  componentDidMount() {
    this.props.actionFetchSchedule();
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
    console.log("commit change");
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
        console.log("delete", deleted);
        this.props.actionDeleteSchedule(deleted);
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
    const data = this.props.appointments.schedule;

    return (
      <Paper sx={{ width: "70rem", m: "auto", mt: 3 }}>
        <Scheduler data={data} height={660}>
          <ViewState
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
          <WeekView />
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
          <AppointmentTooltip showOpenButton showDeleteButton />
          <AppointmentForm />
          <Resources data={resources} mainResourceName="status" />
        </Scheduler>
      </Paper>
    );
  }
}

ManageSchedule.defaultProps = {};
ManageSchedule.propTypes = {
  appointments: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ appointments: state.appointments });

export default connect(mapStateToProps, {
  actionFetchSchedule: actionFetchSchedule,
  actionDeleteSchedule: actionDeleteSchedule,
})(ManageSchedule);
