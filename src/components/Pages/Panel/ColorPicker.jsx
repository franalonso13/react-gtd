import React from "react";
import firebase from "firebase/app";
import "firebase/database";
import { CirclePicker } from "react-color";

export default class CustomPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      background: this.props.task.colorTask,
    };
  }

  handleChangeComplete = (color, event) => {
    this.setState({ background: color.hex });
    const newState = {
      tasks: {
        ...this.props.tasks,
        [this.props.task.id]: {
          ...this.props.task,
          colorTask: color.hex,
        },
      },
    };
    this.props.handleClick(newState);
    const newStateDialog = {
      tasks: {
        ...this.props.tasks,
        [this.props.task.id]: {
          ...this.props.task,
          colorTask: color.hex,
        },
      },
      task: {
        ...this.props.task,
        colorTask: color.hex,
      },
    };
    this.props.handleStateDialog(newStateDialog);
    firebase
      .database()
      .ref("users/" + this.props.user.uid)
      .update(newState);
  };

  handleResetColor = (color, event) => {
    this.setState({ background: color });
    const newState = {
      tasks: {
        ...this.props.tasks,
        [this.props.task.id]: {
          ...this.props.task,
          colorTask: color,
        },
      },
    };
    this.props.handleClick(newState);
    const newStateDialog = {
      tasks: {
        ...this.props.tasks,
        [this.props.task.id]: {
          ...this.props.task,
          colorTask: color,
        },
      },
      task: {
        ...this.props.task,
        colorTask: color,
      },
    };
    this.props.handleStateDialog(newStateDialog);
    firebase
      .database()
      .ref("users/" + this.props.user.uid)
      .update(newState);
  };

  render() {
    //console.log(this.props.task.colorTask);
    return (
      <div className="d-flex align-items-center">
        <CirclePicker
          colors={[
            "#f44336",
            "#e91e63",
            "#9c27b0",
            "#3f51b5",
            "#2196f3",
            "#03a9f4",
            "#00bcd4",
            "#009688",
            "#4caf50",
            "#8bc34a",
            "#cddc39",
            "#ff9800",
          ]}
          color={this.state.background}
          onChangeComplete={this.handleChangeComplete}
        />
        <button
          className="button-color ml-3"
          onClick={(e) => this.handleResetColor("#fff", e)}
        >
          Quitar color
        </button>
      </div>
    );
  }
}
