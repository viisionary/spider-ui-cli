import * as React from "react";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";

/**
 Created by IntelliJ IDEA.
 User: visionary
 Date: 2021/12/14
 Time: 2:54 PM
 */

export default function BaseLoading({ size }: { size?: number }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
}
