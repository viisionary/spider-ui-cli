import React from "react";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { Theme } from "@mui/material";

/**
 Created by IntelliJ IDEA.
 User: visionary
 Date: 2021/7/8
 Time: 1:30 PM

 描述：
 **/
interface Props {
  ex?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  NavigatorLoading: {
    background: theme.palette.text.secondary,
    height: 3,
    transition: 'all 500ms',
    width: 0,
    transitionTimingFunction: 'cubic-bezier(.29, 1.01, 0.68,)',
  },
  loading: {
    background: theme.palette.primary.main,
    width: '98%',
  },
}));
const NavigatorLoading: React.FC<Props> = () => {
  const [open, setOpen] = React.useState(false);

  setTimeout(() => {
    setOpen(true);
  });

  const classes = useStyles();
  return <div className={clsx(classes.NavigatorLoading, { [classes.loading]: open })} />;
};
export default NavigatorLoading;
