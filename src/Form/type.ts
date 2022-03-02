
export interface PresetFormProps {
    // eslint-disable-next-line
    initialValues?: Record<string, any>;
    // eslint-disable-next-line
    validationSchema?: Record<string, any>;
    fields: PresetFieldProps[];
    submitText?: string;
    resetText?: string;
    isSubmitting?: boolean;
    //TODO 改一下...
    submitPending?: <valuesPayload>(values: valuesPayload) => Promise<void>;
    // eslint-disable-next-line
    formRef?: any;
    // eslint-disable-next-line
    validate?: any;
    validateOnChange?: boolean,
    onCancel?: (values: any) => void
}


export type depend = {
    id: string;
    value: string[];
};

export type option = {
    label: string;
    value: string | number;
    exclude?: depend[];
    depend?: depend[];
};

export interface PresetFieldProps {
    label: string;
    id: string;
    fieldType: FieldType;
    max?: number;
    canEdit?: boolean;
    depend?: depend;
    original?: Record<string, unknown>;
    staticOptions?: option[];
    required?: boolean;
    multiple?: boolean;
    // eslint-disable-next-line
    classes?: any;
    disabled?: boolean;
    accept?: string;
    exclude?: string;
}

export enum FieldType {
    text = "text",
    search = "search",
    select = "select",
    multipleSelect = "multipleSelect",
    checkbox = "checkbox",
    datePickers = "datePickers",
    timePickers = "timePickers",
    dataTimePickers = "dataTimePickers",
    radioGroup = "radioGroup",
    slider = "slider",
    switch = "switch",
    divider = "divider",
    textArea = "textArea",
    number = "number",
    upload = "upload",
    resumableUpload = "resumableUpload",
    textNumber = "textNumber"
}
