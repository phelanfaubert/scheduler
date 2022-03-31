import { useState, useEffect } from 'react'; 
import axios from 'axios';

export default function useApplicationData () {
const [state, setState] = useState({
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
});

const setDay = day => setState({ ...state, day }); 

useEffect(() => {
  Promise.all([
    axios.get("/api/days"),
    axios.get("/api/appointments"),
    axios.get("/api/interviewers"),
  ]).then((all) => {

    setState((prev) => ({
      ...prev,
      days: all[0].data,
      appointments: all[1].data,
      interviewers: all[2].data,
    }))
  })
}, []);

const updateSpots = function (state, appointments) {

  const dayObj = state.days.find(d => d.name = state.day);
  let spots = 0;
  for (const id of dayObj.appointments) {
    const appointment = appointments[id];
    if (appointment.interview === null) {
      spots++;
    } 

  }
//const newDays = {...state.days}

  const day = { ...dayObj, spots }
  const days = state.days.map(d => d.name === state.day ? day : d)
  return days;
}

function bookInterview(id, interview) {

  const appointment = {
    ...state.appointments[id],
    interview: { ...interview }
  };
  const appointments = {
    ...state.appointments,
    [id]: appointment
  };

  return axios.put(`/api/appointments/${id}`, {interview})
  .then(()=>setState({
    ...state,
    appointments,
    days: updateSpots(state, appointments, id) }));
}

function cancelInterview(id) {

  const appointment = {
    ...state.appointments[id],
    interview: null
  };
  const appointments = {
    ...state.appointments,
    [id]: appointment
  }
  return axios.delete(`/api/appointments/${id}`)
  .then(()=>setState({
    ...state,
   appointments,
   days: updateSpots(state, appointments, id) }));
}
return ({state, setDay, bookInterview, cancelInterview});
}

