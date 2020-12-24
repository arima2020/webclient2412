import {
  Avatar,
  Button,
  Card,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import html2canvas from "html2canvas";
import React, { useState } from "react";

import config from "../config";

import Snapshot from "../components/Snapshot";
import VideoCall from "../components/VideoCall";

const sendData = (payload) => {
  console.log(payload);
};

const useStyles = makeStyles({
  root: {
    marginTop: 50,
  },
  canvas: {
    height: 700,
    width: 350,
  },
  grid: {
    height: 700,
    width: 300,
  },
  toolBtn: {
    marginBottom: 25,
    width: 175,
  },
  thumbnail: {
    marginBottom: 25,
    width: 50,
    height: 75,
  },
  snapShot: {
    maxWidth: "100%",
    maxHeight: "100%",
    cursor: "pointer",
  },
});

function Main() {
  const classes = useStyles();
  const snapShotEle = document.getElementById("snapShot");
  const [sketch] = useState(null);
  const [tool, setTool] = useState("Pencil");
  const [snapshot, setSnapshot] = useState(null);
  const [open, setOpen] = useState(false);
  const [isLaserBeam, setLaserBeam] = useState(false);
  const [textAnnotation, setTextAnnotation] = useState(null);

  // const handleAnnotations = () => {
  //   if (sketch) {
  //     const {
  //       objects: [properties],
  //     } = sketch.toJSON();
  //     if (properties) {
  //       let data = { tool };
  //       if (tool === "Select") {
  //         data.tool = "Text";
  //         ["height", "width", "left", "top", "text"].forEach(
  //           (field) => (data[field] = properties[field])
  //         );
  //       } else {
  //         const [{ fields }] = config.ANNOTATIONS.filter(
  //           (annotation) => annotation.tool === tool
  //         );
  //         fields.forEach((field) => (data[field] = properties[field]));
  //         sketch._fc._objects = []; //  Clear Previous Annotation
  //       }
  //       return sendData({ ...data });
  //     }
  //   }
  // };

  const handleLaserBeam = ({ screenX, screenY }) => {
    if (sketch && isLaserBeam) {
      return sendData({
        tool: "Laser",
        x: screenX,
        y: screenY,
      });
    }
  };

  const handleClear = () => {
    if (sketch) {
      sketch.clear(); //  Clear All Annotations
      return sendData({ tool: "Clear" });
    }
  };

  const handleText = () => {
    if (sketch && textAnnotation) {
      sketch.addText(textAnnotation);
      setTool("Select");
      setTextAnnotation(null);
    }
  };

  const handleSnapshot = async () => {
    if (sketch) {
      const snapShotCanvas = await html2canvas(snapShotEle);
      setSnapshot(snapShotCanvas.toDataURL());
    }
  };

  return (
    <Grid className={classes.root} container justify="center">
      <Grid item>
        <Card>
          <Grid
            alignItems="center"
            className={classes.grid}
            container
            direction="column"
            justify="center"
            spacing={2}
          >
            <Grid item align="center">
              {config.ANNOTATIONS.map((annotation) => (
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
              <Button
                className={classes.toolBtn}
                color={isLaserBeam ? "primary" : "secondary"}
                key="Laser Beam"
                onClick={() => setLaserBeam(!isLaserBeam)}
                size="small"
                variant="contained"
              >
                {!isLaserBeam ? "Laser Beam" : "Stop Laser Beam"}
              </Button>
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
              {snapshot && (
                <Avatar
                  className={classes.thumbnail}
                  onClick={() => setOpen(true)}
                  variant="square"
                >
                  <img
                    alt="snapshot"
                    src={snapshot}
                    className={classes.snapShot}
                  />
                </Avatar>
              )}
              <Button
                className={classes.toolBtn}
                color="secondary"
                disabled={!sketch}
                key="Take Snapshot"
                onClick={handleSnapshot}
                size="small"
                variant="contained"
              >
                Take Snapshot
              </Button>
              <Button
                className={classes.toolBtn}
                color="secondary"
                disabled={!sketch}
                onClick={handleClear}
                size="small"
                variant="outlined"
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item>
        <Card>
          <Grid
            container
            className={classes.canvas}
            justify="center"
            spacing={2}
            style={{ backgroundColor: "#000000d1" }}
          >
            <span
              id="snapShot"
              onMouseMoveCapture={handleLaserBeam}
              disabled={isLaserBeam}
            >
              <VideoCall />
            </span>
          </Grid>
        </Card>
      </Grid>
      {snapshot && (
        <Snapshot
          src={snapshot}
          open={open}
          closeModal={() => setOpen(false)}
          sendData={sendData}
        />
      )}
    </Grid>
  );
}

export default Main;
