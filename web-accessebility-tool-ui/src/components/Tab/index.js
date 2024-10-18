import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SelectedListItem from "../../components/ListItem";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import SummaryList from "../SummaryList";
import ButtonComponent from "../Button";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function TabPanel(props) {
  const { children, selectedTab, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={selectedTab !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{ height: "800px" }}
    >
      {selectedTab === index && (
        <Box sx={{ p: 3, height: "100%" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  selectedTab: PropTypes.number.isRequired,
};

export default function TabComponent(props) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [selectedItem, setSelectedItem] = useState(-1);

  const createDialog = () => {
    let existing = document.querySelector("#openDialog");
    if(existing) return existing;
    const dialog = document.createElement("div");

    dialog.id = 'openDialog'
    dialog.style.display = "none";
    dialog.style.opacity = 0;
    dialog.style.transition =
      "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
    dialog.style.color = "#333";
    dialog.style.backgroundColor = "#ffffff";
    dialog.style.fontSize = "14px";
    dialog.style.lineHeight = "1.5";
    dialog.style.textTransform = "none";
    dialog.style.width = "275px";
    dialog.style.padding = "15px";
    dialog.style.marginTop = "10px";
    dialog.style.borderRadius = "12px";
    dialog.style.border = "2px solid #0077cc";
    dialog.style.boxShadow =
      "0 4px 8px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3)";
    dialog.style.position = "absolute";
    dialog.style.zIndex = 9999;
    dialog.style.transform = "translateX(-20px)";
    document.body.appendChild(dialog);
    return dialog;
  };

  const openDialog = createDialog();


  useEffect(() => {
    if (!props.result) return;
    const newList = props.result.issues;
    const errList = errorList(newList);
    const warnList = warningList(newList);
    const notList = noticeList(newList);

    props.setErrors(errList);
    props.setWarnings(warnList);
    props.setNotices(notList);

    // Show error images by default
    if (props.selectedTab === 0) {
      createImage(errList, "images/alt_missing.ico");
    }
    
  }, [props.result]);


  useEffect(() => {
    if (selectedItemIndex !== -1) {
      // ID ile newDiv'i iframeDocument içinde bulmalıyız
      const iframeDocument = document.querySelector("#inlineFrameExample")
        .contentWindow.document;
      const newDiv = iframeDocument.getElementById(
        `image-container-${selectedItemIndex}`
      );

      if (newDiv) {
        openDialogHandler(selectedItem, newDiv);
      } else {
        console.error(
          `newDiv with id image-container-${selectedItemIndex} not found`
        );
      }
    }
  }, [selectedItemIndex, selectedItem]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if(openDialog.style.display !== 'none' && openDialog.targetElementId === event.currentTarget.id){
        closeDialogHandler(openDialog);
      }
    };

    // Ana belgeye event listener ekle
    document.addEventListener('click', handleClickOutside);
    const iframeElement = document.querySelector("#inlineFrameExample");

    const addIframeListeners = () => {
      const iframeDocument = iframeElement?.contentWindow?.document;

      if (iframeDocument) {
        // Iframe içindeki click eventini dinle
        iframeDocument.addEventListener('click', (event) => {
          if (openDialog.style.display !== 'none' && event.selectedImg !=="selectedImg") {
            closeDialogHandler(openDialog);
          }
        });
      }
    };

    // Iframe yüklendiğinde event listener ekle
    iframeElement.addEventListener('load', addIframeListeners);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  const handleChange = (event, newValue) => {
    props.setSelectedTab(newValue);

    clearImages();

    // Create images based on the selected tab
    if (newValue === 1) {
      // Error List tab
      createImage(props.errors, "images/alt_missing.ico");
    } else if (newValue === 2) {
      // Warning List tab
      createImage(props.warnings, "images/alt_suspicious.ico");
    } else if (newValue === 3) {
      // Notice List tab
      createImage(props.notices, "images/alt.ico");
    }
  };


  const handleViewDetails = () => {
    props.setSelectedTab(1);
  };


  const errorList = (newList) =>
    newList.filter((issue) => issue.type === "error");
  const noticeList = (newList) =>
    newList.filter((issue) => issue.type === "notice");
  const warningList = (newList) =>
    newList.filter((issue) => issue.type === "warning");


  const openDialogHandler  = (item, targetElement) => {
  
    openDialog.targetElementId = targetElement.id;

    // Dialog'un iframe'deki elementin üzerine gelmesi için pozisyonunu hesaplayın
    const iframe = document.querySelector("#inlineFrameExample");
    const iframeRect = iframe.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const dialogRect = openDialog.getBoundingClientRect();
  
    // Sayfa kaydırma miktarlarını al
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;
  
    // Dialog'un iframe'deki elementin üzerine gelmesi için pozisyonunu hesaplayın
    let dialogLeft = iframeRect.left + targetRect.left + scrollLeft - 200;
    let dialogTop = iframeRect.top + targetRect.top + scrollTop + 30;
  
    // Eğer dialog sayfanın altına taşarsa, yukarıya kaydır
    const viewportHeight = window.innerHeight;
    if (dialogTop + dialogRect.height > viewportHeight + scrollTop) {
      dialogTop = viewportHeight + scrollTop - dialogRect.height - 70; // 20px boşluk bırak
    }

    openDialog.textContent = item.message;
    openDialog.style.left = `${dialogLeft}px`;
    openDialog.style.top = `${dialogTop}px`;

    openDialog.style.display = "block";
    setTimeout(() => {
      openDialog.style.opacity = 1;
      openDialog.style.transform = "translateX(0)";
    }, 10);
  };


  const closeDialogHandler = () => {
    openDialog.targetElementId = undefined;
    openDialog.style.opacity = 0;
    openDialog.style.transform = "translateX(-20px)";
    setTimeout(() => {
      openDialog.style.display = "none";
    }, 300);
    if (openDialog.parentNode?.parentNode)
      openDialog.parentNode.parentNode.style.border = "";
  };


  const createImage = async (newList, src) => {
    const iframeDocument = document.querySelector("#inlineFrameExample")
      .contentWindow.document;

    newList.forEach((item, index) => {
      try {
        const newDiv = document.createElement("div");
        const newImage = document.createElement("img");
        const selectorResult = iframeDocument.querySelector(item.selector);

        newDiv.id = `image-container-${index}`;
        newDiv.classList.add("image-container");
        newDiv.style.display = "inline-block";
        newDiv.style.padding = "5px";
        newDiv.style.position = "relative";
        newDiv.style.zIndex = 1500;

        newImage.style.width = "30px";
        newImage.style.height = "30px";
        newImage.src = src;
        newImage.alt = item.selector;
        newImage.style.zIndex = 800;

        newDiv.appendChild(newImage);

        newDiv.addEventListener("click", (event) => {
          newDivClickHandler(event, item);
        });

        newDiv.addEventListener("mouseenter", () => {
          newDiv.style.transform = "scale(1.05)";
          newDiv.style.transition = "transform 0.2s ease";
        });

        newDiv.addEventListener("mouseleave", () => {
          newDiv.style.transform = "scale(1)";
        });

        if (selectorResult) selectorResult.parentNode.appendChild(newDiv);
      } catch (error) {
        console.error("Error creating image:", error);
      }
    });
  };


  const newDivClickHandler = (event, item) => {
    event.preventDefault(); 
  
    const targetElement = event.currentTarget;
    event.selectedImg = "selectedImg";
    if(openDialog.style.display !== 'none' && openDialog.targetElementId === event.currentTarget.id)
      closeDialogHandler();
    else
      openDialogHandler(item, targetElement);
  };


  const clearImages = () => {
    const iframeDocument = document.querySelector("#inlineFrameExample")
      .contentWindow.document;
    const existingImages = iframeDocument.querySelectorAll(".image-container");
    existingImages.forEach((div) => div.remove());
  };


  return (
    <div style={{ height: "800px" }}>
      {/* Tabs component */}
      <Tabs selectedTab={props.selectedTab} onChange={handleChange}>
        <Tab label="Summary" />
        <Tab label="Error List" />
        <Tab label="Warning List" />
        <Tab label="Notice List" />
      </Tabs>

      <TabPanel selectedTab={props.selectedTab} index={0}>
        <SummaryList
          error={props.errors.length}
          warning={props.warnings.length}
          notice={props.notices.length}
          setTab={props.setSelectedTab}
        ></SummaryList>
        <ButtonComponent
          btnName={"View Details"}
          handleSubmit={handleViewDetails}
        ></ButtonComponent>
      </TabPanel>

      <TabPanel selectedTab={props.selectedTab} index={1}>
        <Item>
          <SelectedListItem
            result={props.errors}
            title={"error"}
            iframe={props.iframe}
            url={props.url}
            selectedItemIndex={selectedItemIndex}
            setSelectedItemIndex={setSelectedItemIndex}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          ></SelectedListItem>
        </Item>
      </TabPanel>

      <TabPanel selectedTab={props.selectedTab} index={2}>
        <Item>
          <SelectedListItem
            result={props.warnings}
            title={"warning"}
            iframe={props.iframe}
            url={props.url}
            selectedItemIndex={selectedItemIndex}
            setSelectedItemIndex={setSelectedItemIndex}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          ></SelectedListItem>
        </Item>
      </TabPanel>

      <TabPanel selectedTab={props.selectedTab} index={3}>
        <Item>
          <SelectedListItem
            result={props.notices}
            title={"notice"}
            frame={props.iframe}
            url={props.url}
            selectedItemIndex={selectedItemIndex}
            setSelectedItemIndex={setSelectedItemIndex}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          ></SelectedListItem>
        </Item>
      </TabPanel>
    </div>
  );
}
