import {Form, Formik} from "formik";
import {Button, Container} from "@mui/material";
import React from "react";
import {PresetField} from "./PresetField";
import Box from "@mui/material/Box";
import BaseLoading from "../Loading/BaseLoading";
import {PresetFormProps} from "./type";


const PresetForm: React.FC<PresetFormProps> = ({
                                                   submitPending,
                                                   submitText,
                                                   resetText,
                                                   fields,
                                                   initialValues,
                                                   validationSchema,
                                                   validate,
                                                   formRef,
                                                   isSubmitting,
                                                   validateOnChange,
                                                   onCancel
                                               }) => {
    return (
        <Formik
            initialValues={initialValues || {}}
            validate={validate}
            validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting}) => {
                if (!submitPending) {
                    return;
                }
                // setSubmitting(true);
                // await delay(500);
                submitPending(values);
            }}
            validateOnChange={validateOnChange}
        >
            {({isValid, isSubmitting: isFormSubmitting, values, errors}) => {
                return (
                    <Box sx={{
                        flex: 1, overflowY: "hidden"
                    }}>
                        <Form>
                            <Box sx={{paddingBottom: 20, overflowY: "auto"}}>
                                {fields.map((filed) => (
                                    <Container key={filed.id}>
                                        <PresetField {...filed} />
                                    </Container>
                                ))}
                            </Box>
                            <Box sx={{
                                display: "flex",
                                bottom: 0,
                                justifyContent: "center"
                            }}>
                                <Button
                                    style={resetText ? {marginRight: 8} : {display: "none"}}
                                    variant="outlined"
                                    color="primary"
                                    type="reset"
                                    onClick={() => onCancel && onCancel(values)}
                                >
                                    {resetText || "取消"}
                                </Button>
                                <Button
                                    style={formRef ? {display: "none"} : {}}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    ref={formRef}
                                    data-test="signin-submit"
                                    disabled={!isValid || isFormSubmitting || isSubmitting}
                                >
                                    {isSubmitting && <Box mx={2}>
                                        <BaseLoading size={16}/>
                                    </Box>}
                                    {submitText || "提交"}
                                </Button>
                            </Box>
                        </Form>
                    </Box>
                );
            }}
        </Formik>
    );
};

export default PresetForm;
