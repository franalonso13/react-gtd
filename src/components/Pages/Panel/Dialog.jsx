import React from "react";
import firebase from "firebase/app";
import "firebase/database";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import CustomPicker from "./ColorPicker";

export default class CustomDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: {
        ...this.props.task,
        description: this.props.task.description
          ? this.props.task.description
          : "",
        fechaInicio: this.props.task.fechaInicio
          ? new Date(this.props.task.fechaInicio)
          : null,
        fechaFin: this.props.task.fechaFin
          ? new Date(this.props.task.fechaFin)
          : null,
        fechaVencimiento: this.props.task.fechaVencimiento
          ? new Date(this.props.task.fechaVencimiento)
          : null,
      },
      tasks: this.props.tasks,
    };
    this.handleEditTask = this.handleEditTask.bind(this);
    this.handleEditDescription = this.handleEditDescription.bind(this);
    this.handleStateDialog = this.handleStateDialog.bind(this);
    this.onBlurHandleTask = this.onBlurHandleTask.bind(this);
    this.onBlurHandleDes = this.onBlurHandleDes.bind(this);
    this.textTareaTask = React.createRef();
    this.textTareaDescription = React.createRef();
  }

  handleEditTask(event) {
    this.setState({
      task: {
        ...this.state.task,
        content: event.target.value,
      },
    });
  }
  handleEditDescription(event) {
    this.setState({
      task: {
        ...this.state.task,
        description: event.target.value,
      },
    });
  }

  onBlurHandleTask() {
    if (this.state.task.content.trim() !== "") {
      const newState = {
        tasks: {
          ...this.state.tasks,
          [this.state.task.id]: {
            ...this.state.task,
            content: this.state.task.content,
          },
        },
      };
      this.props.handleClick(newState);
      firebase
        .database()
        .ref("users/" + this.props.user.uid)
        .update(newState);
    } else {
      this.focusTextTarea();
    }
  }
  focusTextTarea() {
    this.textTareaTask.current.focus();
  }
  onBlurHandleDes() {
    const newState = {
      tasks: {
        ...this.state.tasks,
        [this.state.task.id]: {
          ...this.state.task,
          description: this.state.task.description,
        },
      },
    };
    this.props.handleClick(newState);
    firebase
      .database()
      .ref("users/" + this.props.user.uid)
      .update(newState);
  }
  handleStateDialog(newState) {
    this.setState(newState);
  }

  render() {
    const header = (
      <textarea
        ref={this.textTareaTask}
        onBlur={this.onBlurHandleTask}
        onChange={this.handleEditTask}
        className="dialog--Task"
        value={this.state.task.content}
      />
    );
    return (
      <Dialog
        header={header}
        visible={this.props.visible}
        style={{ width: "50vw", backgroundColor: "white" }}
        contentStyle={{ overflowY: "visible" }}
        modal={true}
        blockScroll={true}
        maskClassName="overflow-auto"
        onHide={() => {
          if (this.state.task.content.trim() === "") {
            this.props.handleClick({
              visible: false,
            });
            this.setState({
              task: {
                ...this.state.task,
                content: this.props.task.content,
              },
            });
          } else {
            this.props.handleClick({ visible: false });
          }
        }}
      >
        <div>
          <p className="h5 font-weight-bold">Descripción:</p>
        </div>

        <div className="d-block">
          <textarea
            ref={this.textTareaDescription}
            onBlur={this.onBlurHandleDes}
            className="dialog--Description"
            onChange={this.handleEditDescription}
            value={this.state.task.description}
            placeholder="Introduzca una información más completa..."
          />
        </div>
        <div className="d-block">
          <p className="mt-3 mb-3 h6 font-weight-bold">Selecciona un color:</p>
          <div className="d-flex">
            <div className="m-1">
              <RadioButton
                inputId="rbc1"
                name="taskColorType"
                value="Proyecto"
                className="m-1"
                onChange={(e) => {
                  this.setState({
                    task: {
                      ...this.state.task,
                      taskColorType: e.value,
                    },
                    tasks: {
                      ...this.state.tasks,
                      [this.state.task.id]: {
                        ...this.state.task,
                        taskColorType: e.value,
                      },
                    },
                  });

                  const newState = {
                    tasks: {
                      ...this.state.tasks,
                      [this.state.task.id]: {
                        ...this.state.task,
                        taskColorType: e.value,
                      },
                    },
                  };
                  this.props.handleClick(newState);
                  firebase
                    .database()
                    .ref("users/" + this.props.user.uid)
                    .update(newState);
                }}
                checked={this.state.task.taskColorType === "Proyecto"}
              />
              <label htmlFor="rbc1" className="p-radiobutton-label">
                Proyecto
              </label>
            </div>
            <div className="m-1">
              <RadioButton
                inputId="rbc2"
                name="taskColorType"
                value="Tarea"
                className="m-1"
                onChange={(e) => {
                  this.setState({
                    task: {
                      ...this.state.task,
                      taskColorType: e.value,
                    },
                    tasks: {
                      ...this.state.tasks,
                      [this.state.task.id]: {
                        ...this.state.task,
                        taskColorType: e.value,
                      },
                    },
                  });

                  const newState = {
                    tasks: {
                      ...this.state.tasks,
                      [this.state.task.id]: {
                        ...this.state.task,
                        taskColorType: e.value,
                      },
                    },
                  };
                  this.props.handleClick(newState);
                  firebase
                    .database()
                    .ref("users/" + this.props.user.uid)
                    .update(newState);
                }}
                checked={this.state.task.taskColorType === "Tarea"}
              />
              <label htmlFor="rbc2" className="p-radiobutton-label">
                Tarea
              </label>
            </div>
          </div>
          <CustomPicker
            task={this.state.task}
            tasks={this.state.tasks}
            user={this.props.user}
            handleClick={(newState) => this.props.handleClick(newState)}
            handleStateDialog={(newState) => this.handleStateDialog(newState)}
          />
        </div>
        <div>
          <p className=" mt-3 mb-3 h6 font-weight-bold">
            Fechas para un evento o una tarea planificada:
          </p>
          <div className="m-1">
            <RadioButton
              inputId="rb1"
              name="taskType"
              value="Tarea Planificada"
              onChange={(e) => {
                this.setState({
                  task: {
                    ...this.state.task,
                    taskType: e.value,
                  },
                  tasks: {
                    ...this.state.tasks,
                    [this.state.task.id]: {
                      ...this.state.task,
                      taskType: e.value,
                    },
                  },
                });

                const newState = {
                  tasks: {
                    ...this.state.tasks,
                    [this.state.task.id]: {
                      ...this.state.task,
                      taskType: e.value,
                    },
                  },
                };
                this.props.handleClick(newState);
                firebase
                  .database()
                  .ref("users/" + this.props.user.uid)
                  .update(newState);
              }}
              checked={this.state.task.taskType === "Tarea Planificada"}
            />
            <label htmlFor="rb1" className="p-radiobutton-label">
              Tarea Planificada
            </label>
          </div>
          <div className="m-1">
            <RadioButton
              inputId="rb2"
              name="taskType"
              value="Evento"
              onChange={(e) => {
                this.setState({
                  task: {
                    ...this.state.task,
                    taskType: e.value,
                  },
                  tasks: {
                    ...this.state.tasks,
                    [this.state.task.id]: {
                      ...this.state.task,
                      taskType: e.value,
                    },
                  },
                });

                const newState = {
                  tasks: {
                    ...this.state.tasks,
                    [this.state.task.id]: {
                      ...this.state.task,
                      taskType: e.value,
                    },
                  },
                };
                this.props.handleClick(newState);
                firebase
                  .database()
                  .ref("users/" + this.props.user.uid)
                  .update(newState);
              }}
              checked={this.state.task.taskType === "Evento"}
            />
            <label htmlFor="rb2" className="p-radiobutton-label">
              Evento
            </label>
          </div>
          <div className="d-flex flex-wrap m-2">
            <Calendar
              className="m-2"
              minDate={new Date()}
              maxDate={this.state.task.fechaFin}
              showTime={true}
              hourFormat="24"
              value={this.state.task.fechaInicio}
              onChange={(e) => {
                this.setState({
                  task: {
                    ...this.state.task,
                    fechaInicio: e.value,
                  },
                  tasks: {
                    ...this.state.tasks,
                    [this.state.task.id]: {
                      ...this.state.task,
                      fechaInicio: e.value,
                    },
                  },
                });

                const newState = {
                  tasks: {
                    ...this.state.tasks,
                    [this.state.task.id]: {
                      ...this.state.task,
                      fechaInicio: e.value,
                    },
                  },
                };
                this.props.handleClick(newState);
                firebase
                  .database()
                  .ref("users/" + this.props.user.uid)
                  .update(newState);
              }}
            ></Calendar>

            <Calendar
              className="m-2"
              minDate={
                this.state.task.fechaInicio !== null
                  ? new Date(this.state.task.fechaInicio)
                  : new Date()
              }
              showTime={true}
              hourFormat="24"
              value={this.state.task.fechaFin}
              onChange={(e) => {
                this.setState({
                  task: {
                    ...this.state.task,
                    fechaFin: e.value,
                  },
                  tasks: {
                    ...this.state.tasks,
                    [this.state.task.id]: {
                      ...this.state.task,
                      fechaFin: e.value,
                    },
                  },
                });

                const newState = {
                  tasks: {
                    ...this.state.tasks,
                    [this.state.task.id]: {
                      ...this.state.task,
                      fechaFin: e.value,
                    },
                  },
                };
                this.props.handleClick(newState);
                firebase
                  .database()
                  .ref("users/" + this.props.user.uid)
                  .update(newState);
              }}
            ></Calendar>
          </div>
          <p className=" mt-3 mb-3 h6 font-weight-bold">
            Fecha de vencimiento:
          </p>
          <Calendar
            showTime={true}
            minDate={new Date()}
            hourFormat="24"
            value={this.state.task.fechaVencimiento}
            className="m-2"
            onChange={(e) => {
              this.setState({
                task: {
                  ...this.state.task,
                  fechaVencimiento: e.value,
                },
                tasks: {
                  ...this.state.tasks,
                  [this.state.task.id]: {
                    ...this.state.task,
                    fechaVenciemiento: e.value,
                  },
                },
              });

              const newState = {
                tasks: {
                  ...this.state.tasks,
                  [this.state.task.id]: {
                    ...this.state.task,
                    fechaVencimiento: e.value,
                  },
                },
              };
              this.props.handleClick(newState);
              firebase
                .database()
                .ref("users/" + this.props.user.uid)
                .update(newState);
            }}
          ></Calendar>
        </div>
      </Dialog>
    );
  }
}
