import axios from 'axios';

//ACTION TYPES

const GOT_TASKS = 'GOT_TASKS';
const ADD_TASK = 'ADD_TASK';
const DELETE_TASK = 'DELETE_TASK';

//ACTION CREATORS

const gotTasks = (tasks) => ({type: GOT_TASKS, tasks});
const addTask = (task) => ({ type: ADD_TASK, task});
const deleteTask = (id) => ({ type: DELETE_TASK, id: id });


//THUNK CREATORS

export function fetchTasks (userId) {
    return function thunk (dispatch){
        return axios.get(`/api/tasks/${userId}`)
        .then(res => dispatch(gotTasks(res.data)))
        .catch(error => { console.log(error) });
    };
}

export function changeTask (taskId, task, userId) {
    return function thunk (dispatch){
        return axios.put(`/api/tasks/${taskId}`, task)
        .then(res => dispatch(fetchTasks(userId)))
        .catch(error => { console.log(error) });
    }
}

export function fetchTasksByDate (userId, startDate, endDate) {
    return function thunk (dispatch){
        return axios.get(`/api/tasks/${userId}?startdate=${startDate}&enddate=${endDate}&`)
        .then(res => dispatch(gotTasks(res.data)))
        .catch(error => { console.log(error) });
    };
}


export function createTask (newTask) {
    return function thunk (dispatch){
        return axios.post('/api/tasks', newTask)
        .then(res => {
            dispatch(addTask(res.data))})
        .catch(error => { console.log(error) });
    };
}

export const removeTask = taskId => dispatch => {
  dispatch(deleteTask(taskId));
  axios.delete(`/api/tasks/${taskId}`)
       .catch(err => console.error(`Removing task unsuccessful`, err));
};


// REDUCER
export default function (state = [], action) {
  switch (action.type) {

    case GOT_TASKS:
      return action.tasks;

    case ADD_TASK:
      return [...state, action.task];

    case DELETE_TASK:
      return [...state.filter(task => task.id !== action.id)];


    default:
      return state;
  }
}


// export function fetchSingleTask (taskId) {
//     return function thunk (dispatch){
//         return axios.get(`/api/tasks/${taskId}`)
//         .then(res => {
//           dispatch(getSingleTask(res.data));
//         })
//         .catch(error => { console.log(error) });
//     };
// }

// export const updateTask = (id, task) => dispatch => {
//   axios.put(`/api/tasks`, task)
//        .then(res => dispatch(gotTasks(res.data)))
//        .catch(err => console.error(`Updating task unsuccessful`, err));
// };

