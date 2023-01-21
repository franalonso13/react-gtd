import React from "react";
import Avatar from "@material-ui/core/Avatar";

export default class CustomAvatar extends React.Component {
  state = {
    logout: false,
  };

  render() {
    let button;
    if (this.state.logout === true) {
      button = (
        <button
          className="button-logout mt-2"
          onClick={this.props.handleLogout}
        >
          Cerrar sesión
        </button>
      );
    }
    return (
      <div className="avatar d-flex flex-column align-items-end">
        <Avatar
          alt={this.props.displayName}
          src={this.props.photoURL}
          onClick={() => this.setState({ logout: !this.state.logout })}
        />
        {button}
      </div>
    );
  }
}
