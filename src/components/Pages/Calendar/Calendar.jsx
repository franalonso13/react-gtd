import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import esLocale from "@fullcalendar/core/locales/es";
import { ProgressSpinner } from "primereact/progressspinner";
import firebase from "firebase/app";
import "firebase/database";

import "./Calendar.scss";

export default class Calendar extends React.Component {
  calendarComponentRef = React.createRef();

  state = {
    calendarWeekends: true,
    calendarEvents: [],
    loading: true,
  };

  componentDidMount() {
    firebase
      .database()
      .ref("users/" + this.props.user.uid)
      .once("value")
      .then((snapshot) => {
        let panel = snapshot.val();
        if (panel === null) {
          panel = this.props.initialData;
          firebase
            .database()
            .ref("/users/" + this.props.user.uid)
            .update(panel);
        }
        let events = [];
        if (panel.tasks !== undefined) {
          let tasks = panel.tasks;
          console.log(tasks);
          Object.values(tasks).forEach((task) => {
            if (task.taskType !== undefined) {
              if (
                task.fechaFin !== undefined &&
                task.fechaInicio !== undefined
              ) {
                if (task.taskType === "Evento") {
                  events.push({
                    title: task.content,
                    start: new Date(task.fechaInicio),
                    end: new Date(task.fechaFin),
                    color: "#fb8c00",
                  });
                } else {
                  events.push({
                    title: task.content,
                    start: new Date(task.fechaInicio),
                    end: new Date(task.fechaFin),
                    color: "#7cb342",
                  });
                }
              }
            }
            if (task.fechaVencimiento) {
              events.push({
                title: task.content,
                start: task.fechaVencimiento,
                color: "#ffd600",
              });
            }
          });
        }
        let datas = {
          calendarEvents: events,
          loading: false,
        };

        this.setState(datas);
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="text-center mt-5">
          <ProgressSpinner />
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <div className="legend-container mb-2 rounded">
            <ul className="legend p-2">
              <li>
                <span className="evento"></span> Eventos
              </li>
              <li>
                <span className="fechaVencimiento"></span> Tareas con fecha de
                vencimiento
              </li>
              <li>
                <span className="tareaPlanificada"></span> Tareas planificadas
              </li>
            </ul>
          </div>
          <div className="app-calendar shadow p-4 rounded mb-3">
            <FullCalendar
              locale={esLocale}
              header={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              ref={this.calendarComponentRef}
              weekends={this.state.calendarWeekends}
              events={this.state.calendarEvents}
            />
          </div>
        </React.Fragment>
      );
    }
  }

  toggleWeekends = () => {
    this.setState({
      // update a property
      calendarWeekends: !this.state.calendarWeekends,
    });
  };

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
  };
}
