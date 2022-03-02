import * as React from "react";
import { useEffect } from "react";
import { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useField } from "formik";
import { isEmpty, keyBy } from "lodash";
import { FormHelperText, InputLabel } from "@mui/material";
import {option} from "./type";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

export default function MultipleSelectChip({
                                             staticOptions,
                                             label,
                                             disabled,
                                             ...props
                                           }: { staticOptions: option[], label: string, disabled?: boolean }) {

  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  // @ts-ignore
  const { value = [], error, touched } = meta;

  const { setValue, setError, setTouched } = helpers;

  //---TODO start 非法选中重置value
  useEffect(() => {
    const valid = !!staticOptions.filter(item => item.value === value[0])[0];
    if (touched && !valid) {
      setValue([]);
    }
    if (!isEmpty(staticOptions)) {
      setTouched(true);
    }
  }, [staticOptions]);
  //---end

  const handleChange = (event: any) => {
    const {
      target: { value }
    } = event;
    setValue(typeof value === "string" ? value.split(",") : value);
  };

  const handleDelete = (event: any) => {
    console.log(event);
  };
  const keyBy1 = keyBy(staticOptions, "value");

  return (
    <Box>
      <InputLabel id="demo-multiple-chip" sx={{ left: -13 }}>{label}</InputLabel>
      <Select
        id="demo-multiple-chip"
        multiple
        fullWidth
        variant={"standard"}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        renderValue={(selected: option[]) => {
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap" , marginLeft:'-8px'}}>
              {selected.map((value: any) => (
                <Box marginX={2} key={value}>
                  {keyBy1[value]?.label}
                </Box>
              ))}
            </Box>
          );
        }}
        MenuProps={MenuProps}
      >
        {staticOptions && staticOptions.map(({ label, value }) => (
          <MenuItem
            key={value}
            value={value}
          >
            {label}
          </MenuItem>
        ))}
      </Select>
      {(error) && <FormHelperText>{error}</FormHelperText>}

    </Box>

  );
}
