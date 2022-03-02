import { useField } from "formik";
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Select from "@mui/material/Select";
import { isEmpty } from "lodash";

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
const CustomSelected = ({ id, required, label, disabled, classes, disabledRadio, staticOptions, ...props }: any) => {
  const [field, meta, helpers] = useField(props);
  const { value, touched, error, initialValue } = meta;


  const { setValue, setError, setTouched } = helpers;

  //---TODO start 非法选中重置value
  useEffect(() => {
    const valid = !!staticOptions.filter((item: any) => item.value === value)[0];
    if (!valid) {
      setValue("");
    }
    if (!isEmpty(staticOptions)) {
      // setTouched(true);
    }
  }, [staticOptions]);
  //---end

  const handleChange = (event: any) => {
    const {
      target: { value }
    } = event;
    setValue(value);
  };
  return <Box sx={{ position: "relative", minWidth: 100, marginTop: 4 }}>
    <FormControl fullWidth>
      <Typography color="error" component="span" sx={{
        marginRight: 2, position: "absolute", left: -10
      }}>{required ? "*" : null}</Typography>
      <InputLabel id={`demo-${id}`}
                  sx={{ left: -14, top: value ? 8 : 4 }}
      >{label}</InputLabel>
      <Select
        id={`demo-${id}`}
        // fullWidth
        variant={"standard"}
        disabled={disabled}
        value={value}
        onChange={handleChange}
      >
        {!required && <MenuItem value={""}>{label}</MenuItem>}
        {staticOptions && staticOptions.map(({ label, value }: any) => (
          <MenuItem
            key={value}
            value={value}
          >
            {label}
          </MenuItem>
        ))}
      </Select>
      {(error) && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  </Box>;
};

export default CustomSelected;