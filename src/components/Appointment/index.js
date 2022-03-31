import React, { Fragment } from 'react';

import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form"
import Status from "./Status";
import Confirm from './Confirm';
import Error from './Error';
import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_SAVE = "ERROR_SAVE";


  const { time, interviewers, id, interview, bookInterview, cancelInterview } = props;


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    bookInterview(id, interview).then(() => {
      transition(SHOW);
    })
      .catch((error) => {
        transition(ERROR_SAVE, true)
      })
  }
  const onEdit = () => transition(EDIT);
  const promptDelete = () => transition(CONFIRM);

  function deleteInterview() {
    transition(DELETING, true);
    cancelInterview(id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((error) => {
        transition(ERROR_DELETE, true)
      })
  };

  return (
    <Fragment>
      <Header time={time} />
      <article className="appointment">

        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            id={id}
            onDelete={promptDelete}
            onEdit={onEdit}
          />
        )}
        {mode === CONFIRM && (
          <Confirm
            message='Are you sure you would like to delete?'
            onConfirm={deleteInterview}
            onCancel={back} />
        )}
        {mode === CREATE && (
          <Form
            interviewers={interviewers}
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === EDIT && (
          <Form
            student={interview.student}
            interviewers={interviewers}
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === ERROR_SAVE && (
          <Error
            onClose={() => back()}
            message="Error, cannot save appointment. Please try again."
          />
        )}
        {mode === ERROR_DELETE && (
          <Error
            onClose={() => back()}
            message="Error, cannot delete appointment. Please try again."
          />
        )}
        {mode === SAVING && (
          <Status message='Saving' />
        )}
        {mode === DELETING && (
          <Status message='Deleting' />
        )}
      </article>
    </Fragment>
  )
};