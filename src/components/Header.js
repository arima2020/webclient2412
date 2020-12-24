import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit">
          Screen Cast
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
