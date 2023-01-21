import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import firebase from "firebase/app";
import "firebase/database";
import Column from "./Column";
import "./Panel.css";
import CustomDialog from "./Dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Growl } from "primereact/growl";
import moment from "moment";
import "moment/locale/es";

let initialData = {
  tasks: {},
  columns: {
    "column-1": {
      id: "column-1",
      title: "Inbox",
      taskIds: [],
    },
    "column-2": {
      id: "column-2",
      title: "Próximas acciones",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Proyectos",
      taskIds: [],
    },
    "column-4": {
      id: "column-4",
      title: "Algún día",
      taskIds: [],
    },
    "column-5": {
      id: "column-5",
      title: "Eventos",
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2", "column-3", "column-4", "column-5"],
  visible: false,
  loading: true,
};

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialData;
    this.showInfo = this.showInfo.bind(this);
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
          let newState = {
            ...panel,
            loading: false,
          };
          firebase
            .database()
            .ref("/users/" + this.props.user.uid)
            .update(panel);
          this.setState(newState);
        } else {
          let tasks = {};
          let columns = panel.columns;
          let columnOrder = panel.columnOrder;

          this.state.columnOrder.forEach((columnId) => {
            const column = columns[columnId];
            if (column.taskIds === undefined) {
              columns[columnId].taskIds = [];
            }
          });

          if (panel.tasks !== undefined) {
            tasks = panel.tasks;
          }

          let datas = {
            tasks: tasks,
            columns: columns,
            columnOrder: columnOrder,
            loading: false,
          };
          //console.log(datas);

          this.setState(datas);
        }
        //solo se muestra el recordatorio los lunes
        if (moment().weekday() === 0) {
          this.showInfo();
        }
      });
  }

  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      console.log(newTaskIds);
      newTaskIds.splice(destination.index, 0, draggableId);
      console.log(newTaskIds);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);
      firebase
        .database()
        .ref("users/" + this.props.user.uid)
        .update(newState);
      return;
    }
    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    this.setState(newState);
    firebase
      .database()
      .ref("users/" + this.props.user.uid)
      .update(newState);
  };

  onClickClose(newState) {
    this.setState(newState);
  }

  handleClick(newState) {
    console.log(newState);
    console.log(this.state);
    this.setState(newState);
  }
  showInfo() {
    this.growl.show({
      sticky: true,
      severity: "info",
      summary: "Revisar los proyectos",
      detail: "Organice las tareas asociadas a los proyectos",
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
          <Growl ref={(el) => (this.growl = el)} />
          {this.state.visible === true && this.state.task !== undefined && (
            <CustomDialog
              visible={this.state.visible}
              task={this.state.tasks[this.state.task.id]}
              tasks={this.state.tasks}
              handleClick={(newState) => this.handleClick(newState)}
              user={this.props.user}
            ></CustomDialog>
          )}

          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="containerPanel">
              {this.state.columnOrder.map((columnId) => {
                const column = this.state.columns[columnId];

                let tasks;
                if (column.taskIds !== undefined) {
                  tasks = column.taskIds.map(
                    (taskId) => this.state.tasks[taskId]
                  );
                } else {
                  tasks = [];
                }

                return (
                  <div key={column.id} className="containerColumn">
                    <Column
                      user={this.props.user}
                      key={column.id}
                      column={column}
                      columns={this.state.columns}
                      tasks={tasks}
                      stateTasks={this.state.tasks}
                      onClickClose={(newState) => this.onClickClose(newState)}
                      handleClick={(newState) => this.handleClick(newState)}
                    />
                    <button
                      className="addButton"
                      type="button"
                      onClick={() => {
                        var newTaskKey = firebase
                          .database()
                          .ref()
                          .child("/users/" + this.props.user.uid)
                          .push().key;

                        const newState = {
                          tasks: {
                            ...this.state.tasks,
                            [newTaskKey]: {
                              id: newTaskKey,
                              content: "Sin content",
                              input: true,
                            },
                          },
                          columns: {
                            ...this.state.columns,
                            [column.id]: {
                              ...column,
                              taskIds: column.taskIds.concat(newTaskKey),
                            },
                          },
                        };

                        this.setState(newState);
                      }}
                    >
                      +
                    </button>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </React.Fragment>
      );
    }
  }
}

export default Panel;
