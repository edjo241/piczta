import React from 'react'
import Page from './components/Page'
import Profile from './components/Profile'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'

function App(){
    return(
        <div className='app'>

    <Router>
        <Switch>
            <Route exact path="/">
                <Page/>
            </Route>
          <Route  path="/user">
            <Profile/>
          </Route>
        </Switch>
    </Router>

        </div>
    )
}
export default App