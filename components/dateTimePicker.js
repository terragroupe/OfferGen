import React, { useState } from "react";
import "react-datetime/css/react-datetime.css";
import DateTime from "react-datetime";
import moment from "moment";

const DateTimePicker = ({ value, onChange, needTime }) => {
  const [internalValue, setInternalValue] = useState(
    value ? moment(value).toDate() : null
  );

  const handleChange = (newDate) => {
    setInternalValue(newDate);
    onChange(newDate);
  };

  return (
    <DateTime
      value={internalValue}
      onChange={handleChange}
      dateFormat="DD/MM/YYYY"
      timeFormat={needTime}
    />
  );
};

export default DateTimePicker;
