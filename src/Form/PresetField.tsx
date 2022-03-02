import React from "react";
import { Field, FieldProps, useFormikContext } from "formik";
import CustomDatePicker from "./CustomDatePicker";
import { Box, FormControl, FormLabel, InputAdornment, TextField, Typography } from "@mui/material";
import MultipleSelectChip from "./MultipleSelectChip";
// import { CustomUpload } from "../containers/page/storehouse/CustomUpload";
import BaseResumableUpload from "./BaseResumableUpload";
// import DateTimePicker from "./DateTimePicker";
import { makeStyles } from "@mui/styles";
import { isEqual } from "lodash";
import CheckBoxGroup from "./CheckBoxGroup";
import CustomRadio from "./CustomRadio";
import {FieldType, PresetFieldProps} from "./type";
import CustomSelected from "./CustomSelected";
import {DateTimePicker} from "@mui/lab";

export const useStylesReddit = makeStyles(() => ({
  root: {
    "& p.Mui-error": {
      // background: `url(${ErrorIcon}) 0 0 no-repeat`,
      height: "20px",
      lineHeight: "18px"
    },
    "& .MuiFormLabel-root": {
      color: "#8E98B4"
    },
    "& .MuiFormLabel-asterisk": {
      display: "none"
    },
    "& .MuiInputAdornment-root": {
      color: "#8E98B4"
    },
    "& .MuiInput-underline:before": {
      borderColor: "rgba(142, 152, 180, 0.25)"
    },
    "& .MuiSelect-icon": {
      color: "#8E98B4"
    }
  },
  formLabel: {
    "&.MuiFormLabel-root": {
      color: "#1D2341"
    },
    "& .MuiFormLabel-asterisk": {
      display: "none"
    }
  }
}));

export const PresetField: React.FC<PresetFieldProps> = ({
                                                          required,
                                                          // original = {},
                                                          fieldType,
                                                          label,
                                                          id,
                                                          max,
                                                          staticOptions,
                                                          multiple,
                                                          disabled: disabledRadio,
                                                          accept,
                                                          depend,
                                                          exclude
                                                        }) => {
  const classes = useStylesReddit();
  switch (fieldType) {
    case FieldType.datePickers:
      return <Field name={id} key={id}>
        {({ field, meta, meta: { error, value, touched } }: FieldProps) => (
          //@ts-ignore
          <CustomDatePicker label={label} {...field} />)}</Field>;
    case FieldType.multipleSelect:
      // @ts-ignore
      // console.log(value,depend.id,value[depend.id])
      // @ts-ignore
      // const disabled = depend.value.includes(values[depend.id])
      // console.log(depend.value.includes(value[depend.id]))

      return <Field name={id} key={id}>
        {({ field, meta, meta: { error, value, initialValue, touched } }: FieldProps) => {
          const form = useFormikContext();

          // console.log(value);
          // @ts-ignore
          // console.log(value, depend.id, value[depend.id]);
          // @ts-ignore
          // const disabled = depend.value.includes(values[depend.id]);
          // @ts-ignore
          // console.log(depend.value.includes(form.values[depend.id]));
          // if (!staticOptions){
          //   return null
          // }
          return (
            <FormControl
              margin="normal"
              fullWidth={true}
              sx={{ minWidth: "100px" }}
              required={required}
              error={(touched || value !== initialValue) && Boolean(error)}>
              {staticOptions && <MultipleSelectChip staticOptions={staticOptions} disabled={
                // @ts-ignore
                !depend.value.includes(form.values[depend.id])} {...field} label={label} />}
            </FormControl>);
        }}</Field>;
    case FieldType.upload:
      return <Field name={id} key={id}>
        {({ field, meta, meta: { error, value, initialValue, touched } }: FieldProps) => (
          <FormControl
            margin="normal"
            sx={{ width: "100%" }}
            required={required}
            error={(touched || !isEqual(value, initialValue)) && Boolean(error)}
          >
            <FormLabel className={classes.formLabel}>{label}</FormLabel>
            {/*{accept && <CustomUpload accept={accept} max={max}  {...field} />}*/}
          </FormControl>
        )}
      </Field>;
    case FieldType.resumableUpload:
      return <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
        <Typography color="error" component="span" sx={{
          marginRight: 2,
          position: "absolute",
          left: -10,
          top: 55
        }}>{required ? "*" : null}</Typography>
        <Field name={id} key={id}>
          {({ field, meta, meta: { error, value, initialValue, touched } }: FieldProps) => (
            <FormControl
              margin="normal"
              sx={{ width: "100%" }}
              required={required}
              // value is array
              error={(touched || !isEqual(value, initialValue)) && Boolean(error)}
            >
              <FormLabel className={classes.formLabel}>
                {label}
              </FormLabel>
              <BaseResumableUpload max={max} accept={accept} {...field} />
            </FormControl>
          )}
        </Field></Box>;
    case FieldType.dataTimePickers:
      return (
        <Field name={id} key={id}>
          {({ field, meta, meta: { error, value, initialValue, touched } }: FieldProps) => (
            <       // @ts-ignore
                DateTimePicker label={label} {...field} />
          )}
        </Field>
      );
    case FieldType.select:
      return (
        <Field name={id} key={id}>
          {({ field, meta, meta: { error, value, initialValue, touched } }: FieldProps) => (
            <CustomSelected id={id} required={required} label={label} classes={classes} disabled={disabledRadio}
                            staticOptions={staticOptions} {...field} />
          )}
        </Field>
      );
    case FieldType.textArea:
      return (
        <Field name={id} key={id}>
          {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => {
            return (
              <TextField
                fullWidth
                label={label}
                className={classes.root}
                variant="standard"
                multiline
                margin="normal"
                required={required}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography color={error ? "error" : "text"} component={"span"}>
                        {value?.length || 0}
                      </Typography>
                      <Typography component={"span"}>/{max}</Typography>
                    </InputAdornment>
                  )
                }}
                error={(touched || value !== initialValue) && Boolean(error)}
                helperText={touched || value !== initialValue ? error : ""}
                {...field}
              />
            );
          }}
        </Field>
      );
    case FieldType.search:
      return (
        <Field name={id} key={id}>
          {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => {
            // @ts-ignore
            const endAdornment = <SearchIcon style={{ marginBottom: "4px" }} />;
            return (
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                width: "100%",
                minWidth: 100,
                position: "relative"
              }}>
                <Typography color="error" component="span" sx={{
                  marginRight: 2, position: "absolute", left: -10
                }}>{required ? "*" : null}</Typography>
                <TextField
                  fullWidth
                  className={classes.root}
                  label={label}
                  variant="standard"
                  margin="normal"
                  required={required}
                  InputProps={{
                    endAdornment: endAdornment
                  }}

                  error={(touched || value !== initialValue) && Boolean(error)}
                  helperText={touched || value !== initialValue ? error : ""}
                  {...field}
                />
              </Box>
            );
          }}
        </Field>
      );

    case FieldType.text:
      return (
        <Field name={id} key={id}>
          {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => {
            // console.log(value, "value");
            const endAdornment = max ? <InputAdornment position="end">
              <Typography color={error ? "error" : "text"} component={"span"}>
                {value?.length || 0}
              </Typography>
              <Typography component={"span"}>/{max}</Typography>
            </InputAdornment> : null;
            return (
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                width: "100%",
                minWidth: 100,
                position: "relative"
              }}>
                <Typography color="error" component="span" sx={{
                  marginRight: 2, position: "absolute", left: -10
                }}>{required ? "*" : null}</Typography>
                <TextField
                  fullWidth
                  className={classes.root}
                  label={label}
                  variant="standard"
                  margin="normal"
                  required={required}
                  InputProps={{
                    endAdornment: endAdornment
                  }}
                  error={(touched || value !== initialValue) && Boolean(error)}
                  helperText={touched || value !== initialValue ? error : ""}
                  {...field}
                />
              </Box>
            );
          }}
        </Field>
      );
    case FieldType.textNumber:
      return (
        <Field name={id} key={id}>
          {({ field, meta: { error, value, initialValue, touched }, form }: FieldProps) => {
            const endAdornment = max ? <InputAdornment position="end">
              <Typography color={error ? "error" : "text"} component={"span"}>
                {value.replace(/[^\d]/g, "")?.length || 0}
              </Typography>
              <Typography component={"span"}>/{max}</Typography>
            </InputAdornment> : null;
            return (
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                width: "100%",
                minWidth: 100,
                position: "relative"
              }}>
                <Typography color="error" component="span" sx={{
                  marginRight: 2, position: "absolute", left: -10
                }}>{required ? "*" : null}</Typography>
                <TextField
                  fullWidth
                  className={classes.root}
                  label={label}
                  variant="standard"
                  margin="normal"
                  required={required}
                  InputProps={{
                    endAdornment: endAdornment
                  }}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: max }}
                  error={(touched || value !== initialValue) && Boolean(error)}
                  helperText={touched || value !== initialValue ? error : ""}
                  {...field}
                  value={field.value.replace(/[^\d]/g, "")}
                  disabled={disabledRadio}
                  onChange={(e) => form.setFieldValue(id, e.target.value.replace(/[^\d]/g, ""))}
                />
              </Box>
            );
          }}
        </Field>
      );
    case FieldType.checkbox:
      // TODO 未完成
      return (
        <Field key={id} name={id}>
          {({ form, meta: { error, value, initialValue, touched } }: FieldProps) => {
            return (
              <CheckBoxGroup name={id} label={label} required={required} id={id} exclude={exclude} depend={depend}
                             staticOptions={staticOptions} />
            );
          }}
        </Field>
      );
    case FieldType.radioGroup:
      return (
        <Field name={id} key={id}>
          {({ field, form, meta: { error, value, initialValue, touched },  }: any) => (
            <CustomRadio id={id} required={required} label={label} classes={classes} disabled={disabledRadio}
                         staticOptions={staticOptions} depend={depend} form={form} {...field} />
          )}
        </Field>
      );
    case FieldType.number:
      return (
        <Field name={id} key={id}>
          {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => (
            <Box sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              width: "100%",
              minWidth: 100,
              position: "relative"
            }}>
              <Typography color="error" component="span" sx={{
                marginRight: 2, position: "absolute", left: -10
              }}>{required ? "*" : null}</Typography>
              <TextField
                variant="standard"
                label={label}
                type="number"
                fullWidth
                required={required}
                margin="normal"
                error={(touched || value !== initialValue) && Boolean(error)}
                helperText={touched || value !== initialValue ? error : ""}
                {...field}
              />
            </Box>
          )}
        </Field>
      );
    default:
      return null;
  }
};