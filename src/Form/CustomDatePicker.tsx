import React from "react";
import moment from "moment";
import { DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { useField } from "formik";

export default ({ label, ...props }:any) => {
  const now = moment().format("yyyy-MM-DD");
  const [field, meta, helpers] = useField(props);
  const { value, error, initialValue } = meta;

  const { setValue, setError, setTouched } = helpers;

  // eslint-disable-next-line
  const handleChange = (chooseDate: any) => {

    setValue(chooseDate);
  };

  return (
    <>
      <DatePicker
        showTodayButton={true}
        todayText="今天"
        mask="____/__/__"
        onChange={async (date: any) => handleChange(date)}
        minDate={moment()}
        inputFormat={"yyyy/MM/DD"}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="standard"
            style={{ margin: "16px 0" }}
            helperText={error}
            error={!!error}
          />
        )}
        label={label}
        value={value}
      />
    </>
  );
};
