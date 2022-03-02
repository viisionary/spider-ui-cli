import { useField } from "formik";
import { Box, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { styled } from "@mui/styles";

const CustomizedRadio = styled(Radio)({
                                        "&.MuiRadio-root": {
                                          color: "#8E98B4"
                                        },
                                        "&.Mui-checked": {
                                          "& .MuiSvgIcon-root": {
                                            color: "#4881f3"
                                          }
                                        },
                                        "&.MuiRadio-colorPrimary.Mui-disabled": {
                                          "& .MuiSvgIcon-root": {
                                            color: "#8E98B4"
                                          }
                                        }
                                      });

/**
 * FormControl 是让label找到控制元素的
 * @param id
 * @param required
 * @param label
 * @param disabled
 * @param classes
 * @param disabledRadio
 * @param staticOptions
 * @param props
 * @constructor
 */
const CustomRadio = ({
                       form,
                       depend,
                       id,
                       required,
                       label,
                       disabled,
                       classes,
                       disabledRadio,
                       staticOptions,
                       ...props
                     }: any) => {
  const [field, meta, helpers] = useField(props);
  const { value, touched, error, initialValue } = meta;


  const { setValue, setError, setTouched } = helpers;


  return <Box sx={{ position: "relative", minWidth: 100, marginTop: 4 }}>
    <FormControl
      margin="normal"
      required={required}
      error={(touched || value !== initialValue) && Boolean(error)}
    >
      <FormLabel className={classes.formLabel}>{label}</FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => {
          if (e.target.value === "false") {
            setValue(false);
          }
          if (e.target.value === "true") {
            setValue(true);
          }
        }}
        style={{ flexDirection: "row" }}
      >
        {staticOptions?.map(({ value, label: radioLabel, exclude }: any) => {
          let disabled = false;
          exclude?.forEach(({ id, value }: any) => {
            if (value.includes(form.values[id])) {
              disabled = true;
            }
          });

          if (depend) {
            const dependValue = form.values[depend.id];
            disabled = !depend?.value.includes(dependValue);
          }
          // const disabledDepend = depend?.value.includes(form.values[depend.id]) && form.values[id] === form?.values[exclude];

          // depend.value.includes(form.values[depend.id])
          return (
            <FormControlLabel
              key={id + value}
              value={value}
              disabled={disabled}
              control={<CustomizedRadio disabled={disabled} />}
              label={radioLabel}
            />
          );
        })}
      </RadioGroup>
      <FormHelperText>{touched || value !== initialValue ? error : ""}</FormHelperText>
    </FormControl>
  </Box>;
};

export default CustomRadio;