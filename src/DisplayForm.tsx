import React from "react";
import {Box} from "@mui/material";
import map from "lodash/map";
import {createStyles, makeStyles} from "@mui/styles";

/**
 Created by IntelliJ IDEA.
 User: visionary
 Date: 2021/6/18
 Time: 5:34 PM

 描述：
 **/

interface Props {
    content: Record<string, 'label'>[];
}

const useStyles = makeStyles(() =>
    createStyles({
        DisplayForm: {},
        item: {
            margin: '10px 0',
        },
    })
);
export const FlexRowContainer: React.FC<{ className?: string; style?: Record<string, unknown> }> =
    ({className, children, style = {}}) => {
        return (
            <div className={className} style={{...style}}>
                {children}
            </div>
        );
    };
export const FlexColumnContainer: React.FC<{
    className?: string;
    style?: Record<string, unknown>;
}> = ({className, children, style = {}}) => {
    return (
        <div className={className} style={{...style}}>
            {children}
        </div>
    );
};
const DisplayForm: React.FC<Props> = ({content}) => {
    const classes = useStyles();

    return (
        <Box className={classes.DisplayForm}>
            {map(content, ({label, value}) => (
                <FlexRowContainer className={classes.item} key={label + value}>
                    <Box color="text.secondary" fontSize={{xs: 'h6.fontSize'}}>
                        {label}
                    </Box>
                    <Box sx={{flex: 1}}/>
                    <Box color="text.primary" fontSize={{xs: 'h6.fontSize'}}>
                        {value}
                    </Box>
                </FlexRowContainer>
            ))}
        </Box>
    );
};
export default DisplayForm;
