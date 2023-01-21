import React from "react";
import { Chart } from "primereact/chart";
import { ScrollPanel } from "primereact/scrollpanel";
import { ProgressSpinner } from "primereact/progressspinner";
import moment from "moment";
import "moment/locale/es";
import firebase from "firebase/app";
import "firebase/database";
export default class Visualizar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: [],
      data: [],
      labels: [],
      proximasAcciones: [],
      eventos: [],
      loading: true,
    };
  }

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
        let data = [];
        let labels = [];
        let colors = [];
        let proximasAcciones = [];
        let eventos = [];
        if (panel.tasks !== undefined) {
          let tasks = panel.tasks;

          //Extraemos task de la columna de próximas acciones
          const column = panel.columns["column-2"];
          if (column.taskIds !== undefined) {
            proximasAcciones = column.taskIds.map((taskId) => tasks[taskId]);
          }

          Object.values(tasks).forEach((task) => {
            moment.locale("es");
            if (task.fechaVencimiento !== undefined) {
              let fecha1 = moment(new Date());
              let fecha2 = moment(new Date(task.fechaVencimiento));
              let diff = fecha2.diff(fecha1, "days");
              if (diff > 0) {
                data.push(fecha2.diff(fecha1, "days"));
                labels.push(task.content);
                colors.push(
                  task.colorTask !== "#fff"
                    ? task.colorTask
                    : this.getRandomColor()
                );
                //console.log(fecha2.diff(fecha1, "days"), " dias de diferencia");
              } else if (diff === 0) {
                data.push(0.5);
                labels.push(task.content + "(Finaliza hoy)");
                colors.push(
                  task.colorTask !== "#fff"
                    ? task.colorTask
                    : this.getRandomColor()
                );
              }
            }
            if (task.taskType !== undefined && task.taskType === "Evento") {
              if (
                task.fechaInicio !== undefined &&
                task.fechaFin !== undefined
              ) {
                let diff1 =
                  moment(new Date(task.fechaFin)).diff(new Date(), "days") >= 0;
                let diff2 =
                  moment(new Date(task.fechaInicio)).diff(new Date(), "days") <=
                  7;
                if (diff1 && diff2) {
                  eventos.push(task);
                }
              }
            }
          });
        }
        let newState = {
          data: data,
          labels: labels,
          colors: colors,
          proximasAcciones: proximasAcciones,
          eventos: eventos,
          loading: false,
        };

        this.setState(newState);
      });
  }
  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  render() {
    const data = {
      labels: this.state.labels,
      datasets: [
        {
          data: this.state.data,
          backgroundColor: this.state.colors,
        },
      ],
    };

    let auxColors = [];

    Object.values(this.state.proximasAcciones).forEach((task) => {
      if (!auxColors.includes(task.colorTask)) {
        auxColors.push(task.colorTask);
      }
    });
    if (this.state.loading) {
      return (
        <div className="text-center mt-5">
          <ProgressSpinner />
        </div>
      );
    } else {
      return (
        <>
          <div className="d-flex justify-content-center align-items-center">
            <div className="h-50 d-flex flex-column align-items-center justify-content-center mr-5">
              <p className="h3 mb-3">Tareas con fecha de vencimiento</p>
              {data.labels.length === 0 ? (
                <p className="font-weight-bold" style={{ height: "200px" }}>
                  No existen tareas con fecha de vencimiento.
                </p>
              ) : (
                <Chart
                  type="doughnut"
                  data={data}
                  // options={options}
                  style={{ width: "600px" }}
                />
              )}
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column align-items-center justify-content-center mr-5">
              <p className="h3 mb-3">Próximos Eventos</p>
              <ScrollPanel
                style={{
                  height: "400px",
                  width: "500px",
                  backgroundColor: "white",
                }}
                className="align-self-end shadow rounded p-2 mb-3"
              >
                {this.state.eventos.length === 0 ? (
                  <p
                    className="font-weight-bold m-2"
                    style={{ height: "200px" }}
                  >
                    No tienen ningún evento en los próximos 7 días.
                  </p>
                ) : (
                  this.state.eventos.map((task) => {
                    moment.locale("es");
                    return (
                      <div
                        key={task.id}
                        className="p-2 m-2 rounded shadow"
                        style={{
                          backgroundColor: task.colorTask,
                          color: task.colorTask === "#fff" ? "black" : "white",
                        }}
                      >
                        {task.content + ": "}
                        <span className="font-weight-bold">
                          {moment(new Date(task.fechaInicio)).format(
                            "DD-MMMM HH:mm"
                          )}
                        </span>
                        {moment(new Date(task.fechaInicio)).format(
                          "DD-MMMM"
                        ) ===
                        moment(new Date(task.fechaFin)).format("DD-MMMM") ? (
                          <span className="font-weight-bold">
                            {"-" +
                              moment(new Date(task.fechaFin)).format("HH:mm")}
                          </span>
                        ) : (
                          <span className="font-weight-bold">
                            {" - " +
                              moment(new Date(task.fechaFin)).format(
                                "DD-MMMM  HH:mm"
                              )}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </ScrollPanel>
            </div>

            <div className="d-flex flex-column align-items-center justify-content-center ml-5">
              <p className="h3 mb-3">Próximas Acciones</p>
              <ScrollPanel
                style={{
                  height: "400px",
                  width: "600px",
                  backgroundColor: "white",
                }}
                className="align-self-end shadow rounded p-2 mb-3"
              >
                {this.state.proximasAcciones.length === 0 ? (
                  <p
                    className="font-weight-bold m-2"
                    style={{ height: "200px" }}
                  >
                    No existen tareas en la columna de próximas acciones.
                  </p>
                ) : (
                  auxColors.map((color) => {
                    return (
                      <div
                        key={color}
                        className="p-3 d-flex  flex-wrap rounded m-1 "
                        style={{ backgroundColor: color }}
                      >
                        {this.state.proximasAcciones
                          .filter((task) => task.colorTask === color)
                          .map((task) => {
                            return (
                              <div
                                key={task.id}
                                className="p-2 m-2 rounded shadow"
                                style={{
                                  backgroundColor: "white",
                                  color: "black",
                                  width: "150px",
                                  fontSize: "13px",
                                }}
                              >
                                {task.content}
                              </div>
                            );
                          })}
                      </div>
                    );
                  })
                )}
              </ScrollPanel>
            </div>
          </div>
        </>
      );
    }
  }
}
