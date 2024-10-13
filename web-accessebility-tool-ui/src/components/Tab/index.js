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
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function TabComponent(props) {
  const [value, setValue] = useState(0);

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
    if (value === 0) {
      createImage(errList, "images/alt_missing.ico");
    }
  }, [props.result]);

  const handleChange = (event, newValue) => {
    setValue(newValue);

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

  const filterByIframeDocument = (issues) => {
    const iframeDocument = document.querySelector("#inlineFrameExample")
      .contentWindow.document;

    if (iframeDocument) {
      return issues.filter((val) => {
        try {
          const res = iframeDocument.querySelector(val.selector);
          return res !== null && res.tagName.toLowerCase() !== "iframe";
        } catch (error) {
          return false;
        }
      });
    }
    return [];
  };

  const handleViewDetails = () => {
    setValue(1);
  };

  const errorList = (newList) => {
    let errors = newList.filter((issue) => issue.type === "error");
    return errors;
  };

  const noticeList = (newList) => {
    let notice = newList.filter((issue) => issue.type === "notice");
    return notice;
  };

  const warningList = (newList) => {
    let warning = newList.filter((issue) => issue.type === "warning");
    return warning;
  };

  const ensureDialogIsInViewport = (dialog) => {
    const rect = dialog.getBoundingClientRect();
    const iframe = document
      .querySelector("#inlineFrameExample")
      .getBoundingClientRect();

    // Check if dialog is out of the viewport and adjust its position if necessary
    if (rect.top < 0) {
      dialog.style.top = "30px"; // Adjust if the top is out of view
    }
    if (rect.left < 0) {
      dialog.style.left = "10px"; // Adjust if the left is out of view
    }
    if (rect.bottom > iframe.height) {
      dialog.style.top = `${-rect.height - 50}px`; // Move the dialog up if bottom is out of view
    }
    if (rect.right > iframe.width) {
      dialog.style.left = `${-rect.width + (rect.width/2) + 15}px`; // Move the dialog left if right is out of view
    }
  };

  const createImage = async (newList, src) => {
    let changes = [];
    // Tüm açık dialogları saklamak için bir dizi oluştur
    const openDialogs = [];
    const iframeDocument = document.querySelector("#inlineFrameExample")
      .contentWindow.document;

    newList.map((item) => {
      try {
        const newDiv = document.createElement("div");
        const newImage = document.createElement("img");
        //html > body > header > div:nth-child(1) > div > div > div > div > ul:nth-child(2) > li:nth-child(2) > span > input
        let selectorResult = iframeDocument.querySelector(item.selector);

        // Apply styles to the new div
        newDiv.classList.add("image-container");
        newDiv.style.display = "inline-block"; // Ensures the div doesn't break onto a new line
        newDiv.style.padding = "5px"; // Adjust padding as needed
        newDiv.style.position = "relative";
        newDiv.style.zIndex = "1000"; // 
        newImage.style.width = "30px"; // Adjust the width as needed
        newImage.style.height = "30px"; // Maintain aspect ratio
        newImage.style.minHeight = "30px"; // Maintain aspect ratio
        newImage.src = src; // Replace with the actual path to your image
        newImage.alt = item.selector;

        // Append the image to the div
        newDiv.append(newImage);

        // Event listener to toggle dialog visibility on click
        newDiv.addEventListener("click", (event) => {
          const dialog = document.createElement("div");
          dialog.textContent = item.message;
          dialog.style.display = "none";
          dialog.style.color = "#000"; // Siyah yazı
          dialog.style.position = "static";
          dialog.style.fontSize="initial";
          dialog.style.lineHeight="initial";
          dialog.style.textTransform="initial";
          dialog.style.width = "250px";
          dialog.style.padding = "5px";
          dialog.style.marginTop = "15px";
          dialog.style.backgroundColor = "#f5f5f5"; // Açılınca arka plan rengini değiştir
          dialog.style.borderRadius = "10px"; // Yuvarlak kenarlar
          dialog.style.border = "2px solid #000"; // Siyah kenarlık
          dialog.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
          dialog.style.left = "100%";
          dialog.style.zIndex = 1500; 

          // Append the dialog to the body or another appropriate container
          newDiv.appendChild(dialog);

          dialog.addEventListener("click", (event) => {
            closeDialog(dialog);
        });

          // Eğer dialog zaten açıksa, kapat
          if (dialog.style.display === "block") {
            closeDialog(dialog);
          } else {
            openDialog(dialog);
          }

          event.preventDefault();

        });

        // Document seviyesinde bir tıklama olayını dinle
        document.addEventListener("click", (event) => {
          openDialogs.forEach((dialog) => closeDialog(dialog));
        });

        // Document seviyesinde bir kaydırma olayını dinle
        document.addEventListener("scroll", () => {
          // Eğer sayfa kaydırıldıysa, tüm dialogları kapat
          openDialogs.forEach((dialog) => closeDialog(dialog));
        });

        // Document seviyesinde bir kaydırma olayını dinle
        iframeDocument.addEventListener("scroll", () => {
          // Eğer sayfa kaydırıldıysa, tüm dialogları kapat
          openDialogs.forEach((dialog) => closeDialog(dialog));
        });

        // Fonksiyonlar açık/kapalı dialogları kontrol etmek için
        function openDialog(dialog) {
          openDialogs.forEach((dia) => closeDialog(dia));
          dialog.style.display = "block";
          dialog.parentNode.parentNode.style.border = "2px solid yellow";
          openDialogs.push(dialog);
          ensureDialogIsInViewport(dialog);
        }

        function closeDialog(dialog) {
          if (dialog) {
            dialog.style.display = "none";

            // Check if the dialog has the expected parent nodes
            if (dialog.parentNode && dialog.parentNode.parentNode) {
              dialog.parentNode.parentNode.style.border = "";
            }

            // Remove the dialog from the list of open dialogs
            const index = openDialogs.indexOf(dialog);
            if (index !== -1) {
              openDialogs.splice(index, 1);
            }
          }
        }

        if (selectorResult) {
          selectorResult.parentNode.appendChild(newDiv);
          // ensureDialogIsInViewport(newDiv)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });
  };

  const clearImages = () => {
    const iframeDocument = document.querySelector("#inlineFrameExample")
      .contentWindow.document;
    const existingImages = iframeDocument.querySelectorAll(".image-container"); // Clear only divs with the specific class

    existingImages.forEach((div) => {
      div.remove(); // Remove only image containers
    });
  };

  return (
    <div>
      {/* Tabs component */}
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Summary" />
        <Tab label="Error List" />
        <Tab label="Warning List" />
        <Tab label="Notice List" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <SummaryList
          error={props.errors.length}
          warning={props.warnings.length}
          notice={props.notices.length}
          setTab={setValue}
        ></SummaryList>
        <ButtonComponent
          btnName={"View Details"}
          handleSubmit={handleViewDetails}
        ></ButtonComponent>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Item>
          <SelectedListItem
            result={props.errors}
            title={"error"}
            iframe={props.iframe}
            url={props.url}
          ></SelectedListItem>
        </Item>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Item>
          <SelectedListItem
            result={props.warnings}
            title={"warning"}
            iframe={props.iframe}
            url={props.url}
          ></SelectedListItem>
        </Item>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Item>
          <SelectedListItem
            result={props.notices}
            title={"notice"}
            frame={props.iframe}
            url={props.url}
          ></SelectedListItem>
        </Item>
      </TabPanel>
    </div>
  );
}
