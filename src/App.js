import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink,
  Link,
  useParams,
  useRouteMatch,
  useHistory
} from "react-router-dom";
import './App.css';
import facade from "./apiFacade";


function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  const logout = () => {
    facade.logout()
    setLoggedIn(false)
  }

  const login = (user, pass) => {
    facade.login(user, pass)
      .then(res => setLoggedIn(facade.loggedIn()));
  }

  return (
    <Router>
      <Header />
      <div className="container bg-light">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/recipes">
            <Recipes />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/user">
          </Route>
          <Route path="/admin">
          </Route>
          <Route path="/login">
            <div>
              {!loggedIn ? (<LogIn login={login} />) :
                (<div>
                  <LoggedIn />
                  <button onClick={logout}>Logout</button>
                </div>)}
            </div>
          </Route>
          <Route>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
  }

  return (
    <div>
      <div className="row justify-content-center">
        <h1>Login</h1>
      </div>
      <div className="row">
        <div className="col-4">
        </div>
        <div className="col-4 text-center">
          <form onChange={onChange}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Username</label>
              <input type="text" className="form-control" placeholder="Enter username" id="username" />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input type="password" className="form-control" placeholder="Password" id="password" />
            </div>
            <button type="submit" className="btn btn-success" onClick={performLogin}>Login</button>
          </form>
        </div>
        <div className="col-4">
        </div>
      </div>
    </div>
  )

}



const mapper = (array) => {
  return array.map((f, index) => {
    return <tr key={f.id}>
      <th><div className="form-check">
        <input className="form-check-input" type="checkbox" value="" id={"recipe"+ f.id} onChange={() => CheckStorage(f.id)}/>
          </div>
</th>
        <th scope="row" id="table_content">{f.id}</th>
        <td className="table_content_class">{f.preperationTime}</td>
        <td className="table_content_class">{f.directions}</td>
        <td className="table_content_class">{f.ingredients.map(i => i.amount + " " + i.item.name).join(", ")}</td>
    </tr>
      })
    }
    
const Recipes = () => {
  const [recipes, setRecipes] = useState('Loading')
    
  useEffect(() => {
        fetch("https://drop.ulrik.me/datEksamen-1/api/recipe/all")
          .then(res => res.json())
          .then(data => {
            setRecipes(mapper(data))
          });
  }, [])

  return (
    <div>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th scope="col">Ch</th>
              <th scope="col">#</th>
              <th scope="col">Duration</th>
              <th scope="col">Description</th>
              <th scope="col">Ingredients</th>
            </tr>
          </thead>
          <tbody>
            {recipes}
          </tbody>
        </table>
      </div>
      )
    
    }

    const CheckStorage = (urlend) => {
            fetch('https://drop.ulrik.me/datEksamen-1/api/recipe/stor/' + urlend)
              .then(res => res.json())
              .then((data) => {
                if (data.status == "ok"){
                  console.log("OK")
                } else {
                alert("Der er ikke nok på lager!")
                }
              })
        }   
    
const Search = () => {
  const [recipe,setRecipe] = useState("");

  const SearchRecipe = (urlend) =>{
        fetch('https://drop.ulrik.me/datEksamen-1/api/recipe/' + urlend)
          .then(res => res.json())
          .then((data) => {
            console.log(data)
            setRecipe(data)
          })
      }

      const [input,setInput] = useState("");
      return (
    <div>
        <div class="form-row">
          <div className="col">
            <input type="text" className="form-control" placeholder="Input" id="personPhoneNumber" onChange={(event) => setInput(event.target.value)} />
          </div>
        </div>
        <div class="col text-center">
          <input class="btn btn-primary" type="button" id="personPostBtn" value="Search" onClick={() => SearchRecipe(input)} />
        </div>
        {recipe.id + " " + recipe.preperationTime + " " + recipe.directions}
      </div>
      )
    }
    
function LoggedIn() {
  // const [dataFromServer, setDataFromServer] = useState("Loading...")

  // useEffect(() => {
  //  facade.fetchData().then(data=> setDataFromServer(data.msg));
  // }, [])

  return (
    <div>
        <div className="row justify-content-center">
          <h1>User page</h1>
        </div>
        <div className="row">
          <div className="col-3">
          </div>
          <div className="col-6">
            <b>Username:</b> {facade.getTokenVal("username")}
            <br />
            <b>Role:</b> {facade.getTokenVal("roles")}
          </div>
          <div className="col-3">
          </div>
        </div>
      </div>
      )
    
    }
    
const Header = () => {
  return (
    <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark static-top"
        id="nav"
      >
        <div className="container">
          <a className="navbar-brand text-white">
            Recipe
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact className="nav-link" exact to="/recipes">Recipes</NavLink>
              </li>
              <li className="nav-item">
                <NavLink exact className="nav-link" exact to="/search">Search</NavLink>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink className="nav-link" exact to="/login">Login</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      );
    }
    
const Home = () => {
  return (
    <div className="row">
        <div className="col-lg-12 text-center">
          <h1 className="mt-5">Recipe</h1>
          <p className="lead">By: Ulrik</p>

        </div>
      </div>
      );
    }
    
    export default App;
