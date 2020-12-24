import {
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import html2canvas from "html2canvas";
import React, { useState } from "react";

import config from "../config";

const useStyles = makeStyles({
  toolBtn: {
    marginBottom: 25,
    width: 175,
  },
});

function Snapshot({ closeModal, open, sendData, src }) {
  const classes = useStyles();
  const snapShotEle = document.getElementById("snapShotEdited");
  const [sketch] = useState(null);
  const [tool, setTool] = useState("Pencil");
  const [textAnnotation, setTextAnnotation] = useState(null);

  const handleText = () => {
    if (sketch && textAnnotation) {
      sketch.addText(textAnnotation);
      setTool("Select");
      setTextAnnotation(null);
    }
  };

  const handleSnapshot = async () => {
    const snapShotCanvas = await html2canvas(snapShotEle);
    await sendData({
      type: "SnapshotToClient",
      data: snapShotCanvas.toDataURL(),
    });
    closeModal();
  };

  return (
    <Dialog open={open || false}>
      <DialogTitle>Format Snapshot</DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={6} md={6} align="center">
            <Card style={{ width: 262, height: 512 }}>
              <Grid container justify="center" style={{ marginTop: 50 }}>
                {config.annotations.map((annotation) => (
                  <Button
                    className={classes.toolBtn}
                    color={tool === annotation.tool ? "primary" : "secondary"}
                    key={annotation.tool}
                    onClick={() => setTool(annotation.tool)}
                    size="small"
                    variant="contained"
                  >
                    {annotation.tool}
                  </Button>
                ))}
                <TextField
                  className={classes.toolBtn}
                  label="Text"
                  onChange={({ target: { value } }) => setTextAnnotation(value)}
                  value={textAnnotation || ""}
                  variant="outlined"
                />
                <Button
                  className={classes.toolBtn}
                  color="secondary"
                  key="Add Text"
                  onClick={handleText}
                  size="small"
                  variant="contained"
                  disabled={!sketch || !textAnnotation}
                >
                  Add Text
                </Button>
                <Button
                  color="secondary"
                  className={classes.toolBtn}
                  disabled={!sketch}
                  size="small"
                  variant="outlined"
                  onClick={() => sketch.clear()}
                >
                  Clear
                </Button>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={6} md={6}>
            <span id="snapShotEdited">
              <Card>
                <CardMedia
                  className={classes.canvas}
                  image={src}
                  title="Screen Cast"
                ></CardMedia>
              </Card>
            </span>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button size="small" variant="contained" onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleSnapshot}
        >
          Send to Customer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Snapshot;
