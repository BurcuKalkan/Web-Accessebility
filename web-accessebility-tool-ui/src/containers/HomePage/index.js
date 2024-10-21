import React, { useState, useRef } from "react";
import CardComponent from "../../components/Card";
import { Grid, Paper, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import TabComponent from "../../components/Tab";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  
    padding: '0px', // Adjust as needed
  
}));

const HomePage = () => {
  const [isVisible, setVisible] = useState(false);
  const [result, setResult] = useState();
  const [url, setUrl] = useState("https://gsu.edu.tr/tr");
  const [iframeLoaded, setIFrameLoaded] = useState(false);
  const title = "Website Accessibility Tool";
  const [selectedTab, setSelectedTab] = useState(0); 
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [notices, setNotices] = useState([]);

  const iframeRef = useRef(null);

  const fetchData = async () => {
    if (!url) return;
    try {
      const response = await fetch(`http://localhost:3001/api?url=${url}`);
      const result = await response.json();
      setResult(result.results);
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
        doc.open();
        doc.write(result.page);
        doc.close();
      }
      setIFrameLoaded(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResult(null);
    }
  };

  const handleSubmit = () => {
    setSelectedTab(0);

    setErrors([]);
    setWarnings([]);
    setNotices([]);

    setVisible(true);
    setResult(null);
    setIFrameLoaded(false);

    fetchData();
  };

  const onLoad = () => {
    setIFrameLoaded(true);
  };

  return (
    <>
      <CardComponent
        title={title}
        handleSubmit={handleSubmit}
        setUrl={setUrl}
      ></CardComponent>

      {isVisible && (
        <Grid container spacing={1}>
          <Grid item xs={2}>
            {
              <TabComponent
                result={iframeLoaded ? result : undefined}
                iframe={iframeRef}
                url={url}
                errors={errors} 
                warnings={warnings} 
                notices={notices} 
                setErrors={setErrors} 
                setWarnings={setWarnings}
                setNotices={setNotices}
                selectedTab={selectedTab}          
                setSelectedTab={setSelectedTab} 
              ></TabComponent>
            }
          </Grid>
          <Grid item xs={10} >
            <Item sx={{ paddingLeft: '0px' }}>
              {!iframeLoaded && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "800px",
                  }}
                >
                  <CircularProgress />
                  <Typography variant="h6" style={{ marginLeft: "0px" }}>
                    Loading...
                  </Typography>
                </div>
              )}
              <iframe
                ref={iframeRef}
                id="inlineFrameExample"
                title="Inline Frame Example"
                width="100%"
                height="868px"
                onLoad={onLoad}
              />
            </Item>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default HomePage;
