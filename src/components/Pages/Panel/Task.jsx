import React from "react";
import { Draggable } from "react-beautiful-dnd";
import firebase from "firebase/app";
import "firebase/database";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import "moment/locale/es";

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: {
        id: this.props.task.id,
      },
    };
    this.handleStateTask = this.handleStateTask.bind(this);
  }
  handleRemove() {
    let column = this.props.column;
    let taskId = this.props.task.id;
    let taskIds = column.taskIds;
    taskIds.splice(this.props.index, 1);

    let updates = {};
    updates["/users/" + this.props.user.uid + "/tasks/" + taskId] = null;
    updates["/users/" + this.props.user.uid + "/columns/" + column.id] = {
      ...column,
      taskIds: taskIds,
    };
    firebase.database().ref().update(updates);

    delete this.props.stateTasks[this.props.task.id];
    const newState = {
      tasks: this.props.stateTasks,
      columns: {
        ...this.props.columns,
        [this.props.column.id]: {
          ...this.props.column,
          taskIds: this.props.column.taskIds.filter(
            (taskId) => taskId !== this.props.task.id
          ),
        },
      },
    };
    console.log(newState);
    this.props.onClickClose(newState);
  }

  handleStateTask(newState) {
    this.setState(newState);
  }

  render() {
    let fechaVencimiento = null;
    if (
      this.props.task.fechaVencimiento !== undefined &&
      this.props.task.fechaVencimiento !== null
    ) {
      moment.locale("es");
      fechaVencimiento = moment(
        new Date(this.props.task.fechaVencimiento)
      ).format("DD-MMMM  HH:mm");
    }

    return (
      <Draggable
        draggableId={this.props.task.id}
        index={this.props.index}
        //isDragDisabled={isDragDisabled}
      >
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`card mb-2 shadow border-0

               ${snapshot.isDragging && "shadow"}`}
          >
            <div
              className="card-body p-2 rounded"
              style={{
                backgroundColor:
                  this.props.task.colorTask !== undefined &&
                  this.props.task.taskColorType !== undefined &&
                  this.props.task.taskColorType === "Proyecto"
                    ? this.props.task.colorTask
                    : "white",
                color:
                  this.props.task.colorTask === "#fff" ||
                  this.props.task.taskColorType === undefined ||
                  (this.props.task.taskColorType !== undefined &&
                    this.props.task.taskColorType === "Tarea")
                    ? "black"
                    : "white",
                border:
                  this.props.task.taskColorType !== undefined
                    ? "2px solid " + this.props.task.colorTask
                    : "none",
              }}
            >
              <IconButton
                aria-label="delete"
                className="p-1 close"
                onClick={() => this.handleRemove()}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>

              <div
                onClick={() => {
                  console.log(this.state.task);
                  this.props.handleClick({
                    visible: true,
                    task: this.state.task,
                  });
                }}
              >
                <p className="m-0">{this.props.task.content}</p>
                <p className="font-weight-bold mb-0 mt-1">{fechaVencimiento}</p>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}

export default Task;
