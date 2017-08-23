import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux';
import { makeArrOfDaysInMonthSunToSat } from './dateFunctions'
import MonthDumbComp from './MonthDumbComp';
import {  fetchFutureTasks, fetchFutureTasksRange } from '../store'
import { makeArrMonthsInYear } from './dateFunctions'
import { gotNextYear, gotPreviousYear, updatedYear , postNewFutureTask, fetchCategories} from '../store'
import TaskWords from './TaskWords'
import MigrateForm from './MigrateForm';

class FutureTasks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: "",
            monthInput: "",
            categoryId: 1

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.selectedCategory = this.selectedCategory.bind(this);
       // this.migrateLogic = this.migrateLogic.bind(this);
    }

    componentDidMount() {

        this.props.loadDataFuture(this.props.user.id, this.props.year, moment(this.props.year).endOf("year").format("YYYYMMDD"));
        this.props.loadCategories(this.props.user.id);
    }

    
    componentWillReceiveProps(nextProps) {
    
    if (this.props.tasks !== nextProps.tasks) {
      
      //recreate X scale with domain min and max as the new start and end dates
      this.props.loadDataFuture(this.props.user.id, this.props.year, moment(this.props.year).endOf("year").format("YYYYMMDD"));
    }
  }


    
    handleChange(event){
       this.setState({value: event.target.value});
    }
    handleMonthChange(event){
        this.setState({monthInput: event.target.value})
    }
    handleSubmit(event){
         event.preventDefault();
         var month = moment(this.props.year.slice(0,4) + " " + this.state.monthInput + " 01").format("YYYYMMDD").toString();

        var obj = {FutureMonth: month, name: this.state.value, userId: this.props.user.id, status: 'incomplete', date: 'notYetAssigned', assigned: 'unassigned', categoryId: this.state.categoryId/1}

        this.props.addFutureTask(obj);
    }
    selectedCategory(event) {
        event.preventDefault();
        this.setState({ categoryId: event.target.id })

    }
    render() {

        const {user, future, month, year, previousYear, nextYear, updateYear, addFutureTask} = this.props;
        const monthsInYear = makeArrMonthsInYear(year);

        var filterF = [];
        for(let i = 0; i<12; i++){
            filterF.push([]);
        }

    for (let i = 0; i < future.length; i++){
        var taskDate = future[i].FutureMonth;
        let index = monthsInYear.indexOf(taskDate);

            if (index !== -1){
                filterF[index].push(future[i]);
            }
    }


        return (
            <div>
            <button onClick={previousYear}>Previous Year</button>
            <h1>{moment(year).format("YYYY")}</h1>
            <button onClick={nextYear}>Next Year</button>
                <form onSubmit={this.handleSubmit}>
                 New Future Task:
                <input className="input" type="text" value={this.state.value} onChange={this.handleChange} />

                Month:
                <input className="input" type="text" value={this.state.monthInput} onChange={this.handleMonthChange} />

                <input type="submit" value="Add Future Task" />
                  {this.props.categories.map((cat, idx) => (
                    (
                        <label key={idx} className='color'>
                            <button className="button" id={cat.id} onClick={this.selectedCategory} value={cat.name} > {cat.name} <span style={{ color: `${cat.color.hex}` }}> &#x25CF;</span></button>
                            {/* <button className="button" onClick={this.migrateLogic} >Migrate!</button> */}
                            {/*
                            <button id={cat.id} onClick={this.handleClick}>delete</button>
                            */}
                        </label>
                    )))}
                </form>
            <div>
            {monthsInYear.map((monthInArr, ind)=>{

                return (<div key={Math.random()}><h3>{moment(monthInArr).format("MMMM")}</h3>
                    <TaskWords tasks={filterF[ind]} />

                    </div>
                )
            })}
            </div>
            <MigrateForm />
          
            </div>

        )
    }
}

const mapState = (state) => ({
    user: state.user,
    future: state.future,
    month: state.month,
    categories: state.categories,
    year: state.year,
    tasks: state.tasks
});

const mapDispatch = (dispatch) => {
    return {
        loadDataFuture(userId, start, end) {
            //dispatch(fetchFutureTasks(userId));
            dispatch(fetchFutureTasksRange(userId, start, end));
        },
        nextYear() {
            dispatch(gotNextYear())  // to be used in on click
        },
        previousYear() {
            dispatch(gotPreviousYear()) // to be used in on click
        },
        updateYear(year){
            dispatch(updatedYear(year))
        },
         addFutureTask(newTask){
            dispatch(postNewFutureTask(newTask));

    },
         loadCategories(userId) {
            dispatch(fetchCategories(userId));


        },
    };
}


export default connect(mapState, mapDispatch)(FutureTasks);
