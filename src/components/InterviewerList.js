import React from "react";
import PropTypes from "prop-types";
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";



export default function InterviewerList(props) {

  
  const { value, onChange, interviewers } = props;

  const interviewerList = interviewers.map((interviewerItem) => {
    return (
      <InterviewerListItem
        key={interviewerItem.id}
        name={interviewerItem.name}
        avatar={interviewerItem.avatar}
        selected={interviewerItem.id === value}
        setInterviewer={() => onChange(interviewerItem.id)}
      />
    );
  });


  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerList}</ul>
    </section>
  );

  
}

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
}