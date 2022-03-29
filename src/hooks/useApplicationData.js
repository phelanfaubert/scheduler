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

const newSpots = (state, appointments) => {
  const stateDay = state.days.find(day => 
    day.name === state.day); 
  const appointmentsDay = stateDay.appointments.map(id => 
    appointments[id]);
  const availSpots = appointmentsDay.filter(apt => 
    !apt.interview).length;
  const updatedDay = {
    ...stateDay,
    spots: availSpots
  };
  const days = [...state.days];
  days[stateDay.id - 1] = updatedDay;
  return days;
};

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
  .then(()=>setState({...state, appointments, days: newSpots(state, appointments) }));
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
  .then(()=>setState({...state, appointments, days: newSpots(state, appointments) }));
}
return ({state, setDay, bookInterview, cancelInterview});
}

