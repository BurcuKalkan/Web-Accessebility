import React, { useState, useRef, useEffect } from "react";
import CardComponent from "../../components/Card";
import { Grid, Paper, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import TabComponent from "../../components/Tab";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,

  padding: "0px", // Adjust as needed
}));

const HomePage = () => {
  const [isVisible, setVisible] = useState(false);
  const [url, setUrl] = useState("");
  const [iframeLoaded, setIFrameLoaded] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [accessibilityReport, setAccessibilityReport] = useState(null);
  const title = "Website Accessibility Tool";

  const [selectedTab, setSelectedTab] = useState(0);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [notices, setNotices] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [selectedItem, setSelectedItem] = useState(-1);

  const iframeRef = useRef(null);

  const [iframeHeight, setIframeHeight] = useState(700);

  const calculateIframeHeight = () => {
    const cardHeight = 150; // Card bileşeninin yüksekliği
    const margin = 40; // Margin toplamı (üst ve alt)
    const windowHeight = window.innerHeight;

    const remainingHeight = windowHeight - (cardHeight + margin);
    setIframeHeight(remainingHeight);
  };

  const fetchData = async () => {
    if (!url) return;

    try {
      const response = fetch(`http://localhost:3001/proxy?url=${url}`);
      const accessibilityResult = fetch(`http://localhost:3001/pa11y?url=${url}`);
      const results = await Promise.all([response, accessibilityResult]);
      const result = await results[0].text(); 
      setHtmlContent(result);
      setIFrameLoaded(false);
      setAccessibilityReport(await results[1].json());
    } catch (error) {
      console.error("Error fetching data:", error);
      setHtmlContent("<p>Failed to load content.</p>");
    } 
  };

  useEffect(() => {
    calculateIframeHeight();
    window.addEventListener("resize", calculateIframeHeight);

    return () => {
      window.removeEventListener("resize", calculateIframeHeight);
    };
  }, []);

  useEffect(() =>{
     if (iframeRef.current) {
        const doc =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow.document;

        doc.open();
        doc.write(htmlContent);
        doc.close();

            // iframe tamamen yüklendi olarak işaretlenmeden önce onLoad'u bekleyin
    const iframeWindow = iframeRef.current.contentWindow;
    iframeWindow.onload = () => {
      setIFrameLoaded(true);
    };
     
      }
    
  },[htmlContent])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Iframe'i yukarı kaydır
    const iframeElement = document.querySelector("#inlineFrameExample");
    if (iframeElement?.contentWindow) {
      iframeElement.contentWindow.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  const handleSubmit = () => {
    setSelectedTab(0);

    setErrors([]);
    setWarnings([]);
    setNotices([]);
    setSelectedItemIndex(-1);
    setSelectedItem(-1);

    setVisible(true);
    
    fetchData();
  };

  const onLoad = () => {
    setIFrameLoaded(true);
    scrollToTop();
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
                selectedItemIndex={selectedItemIndex}
                setSelectedItemIndex={setSelectedItemIndex}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                result={accessibilityReport}
              ></TabComponent>
            }
          </Grid>
          <Grid item xs={10}>
            <Item sx={{ paddingLeft: "0px" }}>
              {!iframeLoaded  && (
                <div
                  style={{
                    display: iframeLoaded ? "none" : "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: `${iframeHeight}px`,
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
                height={`${iframeHeight}px`}
                onLoad={onLoad}
                style={{
                  display: iframeLoaded ? "block" : "none", // Yüklenmeden önce gizle
                }}
              />
            </Item>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default HomePage;
