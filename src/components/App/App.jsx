import React from "react";
import "./App.scss";
import firebase from "firebase/app";
import "firebase/auth";
import Panel from "../Pages/Panel/Panel";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Calendar from "../Pages/Calendar/Calendar";
import Visualizar from "../Pages/Visualizar/Visualizar";
import CustomAvatar from "./CustomAvatar";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

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

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      logout: false,
    };
    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user !== undefined) {
        this.setState({
          user: user,
        });
      }
    });
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => console.log(`${result.user.email} ha iniciado sesión`))
      .catch((error) => console.log(`Error ${error.code}: ${error.message}`));
  }
  handleLogout() {
    firebase
      .auth()
      .signOut()
      .then((result) => console.log(`${result.user.email} ha salido`))
      .catch((error) => console.log(`Error ${error.code}: ${error.message}`));
    this.setState({ logout: false });
  }
  renderLoginButton() {
    //si el usuario está logueado
    let button;
    if (this.state.user) {
      return (
        <>
          <Router basename="react-gtd">
            <div className="d-flex justify-content-center">
              <nav
                style={{ minWidth: "600px" }}
                className="d-flex mt-4 mb-5 justify-content-around navContainer rounded shadow "
              >
                <div className="p-2">
                  <NavLink exact={true} to="/" activeClassName="activeNavItem">
                    Visualizar
                  </NavLink>
                </div>
                <div className="p-2">
                  <NavLink to="/tablero" activeClassName="activeNavItem">
                    Tablero
                  </NavLink>
                </div>
                <div className="p-2">
                  <NavLink to="/calendario" activeClassName="activeNavItem">
                    Calendario
                  </NavLink>
                </div>
              </nav>
              <CustomAvatar
                displayName={this.state.user.displayName}
                photoURL={this.state.user.photoURL}
                handleLogout={() => this.handleLogout()}
              />
            </div>

            <Switch>
              <Route exact path="/">
                {
                  <div>
                    <Visualizar
                      user={this.state.user}
                      initialData={initialData}
                    />
                  </div>
                }
              </Route>
              <Route exact path="/tablero">
                {
                  <div>
                    <Panel user={this.state.user} initialData={initialData} />
                  </div>
                }
              </Route>
              <Route exact path="/calendario">
                {
                  <div>
                    <Calendar
                      user={this.state.user}
                      initialData={initialData}
                    />
                  </div>
                }
              </Route>
              <Route exact path="*">
                {
                  <div>
                    <p class="h1">Oops!</p>
                    <p class="h2">No se encuentra la ruta especificada</p>
                  </div>
                }
              </Route>
            </Switch>
          </Router>
        </>
      );
      //si el usuario no está logueado
    } else {
      return (
        <div className=" loginBackground divComplete d-flex login align-items-center justify-content-center text-center">
          <div className="loginContainer d-flex flex-column align-items-center justify-content-center">
            <div>
              <h1 className="loginHeader">Getting Things Done</h1>
              <button onClick={this.handleAuth} className="buttonLogin">
                <span className="fa fa-google p-2"></span>
                Entra con google
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
  render() {
    return <div className="divComplete">{this.renderLoginButton()}</div>;
  }
}

export default App;
