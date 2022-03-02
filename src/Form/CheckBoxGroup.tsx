import * as React from "react";
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import { useField, useFormikContext } from "formik";
import {option} from "./type";

/**
 Created by IntelliJ IDEA.
 User: visionary
 Date: 2021/12/27
 Time: 2:52 PM
 */

export default function CheckBoxGroup({
  id,
  staticOptions,
  required,
  label,
  exclude,
  depend,
  ...props
}: { id: string, staticOptions?: option[], exclude?: any, depend?: any, required?: boolean, label: string, name: string }) {
  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const form = useFormikContext();
  const { value = [], error, initialValue, touched } = meta;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setValue([...value, event.target.value]);
    } else {
      setValue(value.filter((item: any) => item !== event.target.value));
    }
  };

  const { setValue, setError, setTouched } = helpers;
  return (
    <React.Fragment>
      <FormControl
        margin="normal"
        required={required}
        error={(touched || value !== initialValue) && Boolean(error)}
      >
        <FormLabel>{label}</FormLabel>
        <FormGroup style={{ display: "flex", flexDirection: "row" }}>
          {staticOptions?.map(({ value: checkBoxValue, label: CheckboxLabel }) => {
            // @ts-ignore
            const disabled = depend?.value.includes(form.values[depend.id]) && checkBoxValue === form?.values[exclude];
            return (
              <FormControlLabel
                key={id + checkBoxValue}
                value={checkBoxValue}
                control={<Checkbox disabled={disabled} onChange={handleChange} checked={value.includes(checkBoxValue)} />}
                label={CheckboxLabel}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    </React.Fragment>
  );
}
