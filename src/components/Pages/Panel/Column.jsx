import React from "react";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";
import TaskInput from "./TaskInput";
class Column extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="p-2 text-center bgColorTitleColumn">
          <h5>{this.props.column.title}</h5>
        </div>
        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              // className={`taskList
              // ${snapshot.isDraggingOver && "taskList--drop"}`}
              className="taskList"
            >
              {this.props.tasks.map((task, index) => {
                if (
                  task !== undefined &&
                  task.input !== undefined &&
                  task.input === true
                ) {
                  return (
                    <TaskInput
                      user={this.props.user}
                      key={task.id}
                      stateTasks={this.props.stateTasks}
                      task={task}
                      column={this.props.column}
                      columns={this.props.columns}
                      onClickClose={this.props.onClickClose}
                    />
                  );
                } else if (task !== undefined) {
                  return (
                    <Task
                      user={this.props.user}
                      column={this.props.column}
                      columns={this.props.columns}
                      key={task.id}
                      task={task}
                      stateTasks={this.props.stateTasks}
                      index={index}
                      onClickClose={this.props.onClickClose}
                      handleClick={this.props.handleClick}
                    />
                  );
                }
                return "";
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </React.Fragment>
    );
  }
}

export default Column;
