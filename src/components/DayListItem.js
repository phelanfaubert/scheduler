import React from "react";

import "components/DayListItem.scss";
import classNames from "classnames";

export default function DayListItem(props) {

  const { setDay } = props;

  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  return (
    <li onClick={setDay} className={dayClass}>
      <h2>{props.name}</h2>
      <h3>{props.spots === 0 ? "no spots remaining" :
        props.spots === 1 ? "1 spot remaining" :
          "2 spots remaining"}</h3>
    </li>
  );
}

