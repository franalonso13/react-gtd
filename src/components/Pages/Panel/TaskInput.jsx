import React from "react";
import firebase from "firebase/app";
import "firebase/database";

class TaskInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    const taskId = this.props.task.id;
    const column = this.props.column;
    let updates = {};
    //console.log(this.state.value);
    if (this.state.value.trim() !== "") {
      updates["/users/" + this.props.user.uid + "/tasks/" + taskId] = {
        id: taskId,
        content: this.state.value,
        input: false,
        colorTask: "#fff",
      };

      updates["/users/" + this.props.user.uid + "/columns/" + column.id] = {
        ...column,
        taskIds: column.taskIds,
      };
      firebase.database().ref().update(updates);

      const newState = {
        tasks: {
          ...this.props.stateTasks,
          [taskId]: {
            id: taskId,
            content: this.state.value,
            input: false,
            colorTask: "#fff",
          },
        },
        columns: {
          ...this.props.columns,
          [column.id]: {
            ...column,
            taskIds: column.taskIds,
          },
        },
      };
      this.props.onClickClose(newState);
    } else {
      this.onClose();
    }
  }

  onClose() {
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

  render() {
    return (
      <div>
        <form>
          <div className="form-group">
            <textarea
              className="form-control"
              id="newTask"
              rows="3"
              value={this.state.value}
              placeholder="Escribe una nueva tarea..."
              onChange={this.handleChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  this.handleSubmit(event);
                }
              }}
              autoFocus
            ></textarea>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={this.handleSubmit}
          >
            Añadir
          </button>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={this.onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </form>
      </div>
    );
  }
}

export default TaskInput;
