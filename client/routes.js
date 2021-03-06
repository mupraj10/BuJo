import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Router } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import history from './history'
import { Main, Login, Signup, UserHome, Insights, SingleDay, MonthByDay, AddTask, AddNote, AddEvent, FutureTasks, Categories, Reflections, Help, HabitTracker, UpdateTask, HabitTrackerMonth, AddFutureTask } from './components';
import { me, fetchTasks, fetchEvents, fetchNotes, fetchCategories} from './store'



/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadUser();
  }

  componentWillReceiveProps(nextProps){
     if(this.props.user.id !== nextProps.user.id){
        this.props.loadData(nextProps.user.id);
    }
  }
  render() {
    const { isLoggedIn } = this.props

    return (
      <Router history={history}>
        <Main>
          <Switch>
            {/* Routes placed here are available to all visitors */}
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/help' component={Help} />
            {
              isLoggedIn &&
              <Switch>
                {/* Routes placed here are only available after logging in */}
                <Route exact path='/' component={UserHome} />
                <Route path='/home' component={UserHome} />
                <Route path='/categories' component={Categories} />
                <Route path='/insights' component={Insights} />
                <Route path='/day' component={SingleDay} />
                <Route exact path='/calendar' component={MonthByDay} />
                <Route path='/addtask' component={AddTask} />
                <Route path='/addnote' component={AddNote} />
                <Route path='/addevent' component={AddEvent} />
                <Route path='/futurelog' component={FutureTasks} />
                <Route path='/reflections' component={Reflections} />
                <Route path='/habittracker' component={HabitTrackerMonth} />
                <Route path='/updatetask' component={UpdateTask} />
                 <Route path='/addfuturetask' component={AddFutureTask} />
              </Switch>
            }
            {/* Displays our Login component as a fallback */}
            <Route component={Login} />
          </Switch>
        </Main>
      </Router>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
    user: state.user
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadUser() {
      dispatch(me())
    },
     loadData(userId) {
      dispatch(fetchTasks(userId));
      dispatch(fetchEvents(userId));
      dispatch(fetchNotes(userId));
      dispatch(fetchCategories(userId));
    }
  }
}

export default connect(mapState, mapDispatch)(Routes)

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadUser: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
