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
      style={{ height: "800px" }}
    >
      {value === index && (
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
  value: PropTypes.number.isRequired,
};

export default function TabComponent(props) {
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
    if (props.value === 0) {
      createImage(errList, "images/alt_missing.ico");
    }
  }, [props.result]);

  const handleChange = (event, newValue) => {
    props.setValue(newValue);

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
    props.setValue(1);
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
      dialog.style.top = "20px"; // Adjust if the top is out of view
    }
    if (rect.top > iframe.height) {
      dialog.style.top = iframe.height - 20; // Adjust if the top is out of view
    }
    if (rect.left < 0) {
      dialog.style.left = "20px"; // Adjust if the left is out of view
    }
    if (rect.bottom > iframe.height) {
      dialog.style.bottom = "10px"; // Move the dialog up if bottom is out of view
    }
    if (rect.right > iframe.width) {
      dialog.style.left = `${-rect.width + rect.width / 2 + 15}px`; // Move the dialog left if right is out of view
    }
  };

  const createImage = async (newList, src) => {
    // Tüm açık dialogları saklamak için bir dizi oluştur
    const openDialogs = [];
    const iframeDocument = document.querySelector("#inlineFrameExample").contentWindow.document;

      newList.forEach((item) => {
      try {
        const newDiv = document.createElement("div");
        const newImage = document.createElement("img");
        let selectorResult = iframeDocument.querySelector(item.selector);

        // Apply styles to the new div
        newDiv.classList.add("image-container");
        newDiv.style.display = "inline-block";
        newDiv.style.padding = "5px";
        newDiv.style.position = "relative";
        newDiv.style.zIndex = 1500; 

        newImage.style.width = "30px";
        newImage.style.height = "30px";
        newImage.style.minHeight = "30px";
        newImage.src = src;
        newImage.alt = item.selector;
        newImage.style.zIndex = 800;

        // Append the image to the div
        newDiv.appendChild(newImage); // append ???

        const dialog = document.createElement("div");
        dialog.textContent = item.message;
        dialog.style.display = "none"; // Başlangıçta görünmez
        
        // Fade-in ve Slide-in için başlangıç değerleri
        dialog.style.opacity = 0;
        dialog.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
        
        // Stil ayarları
        dialog.style.color = "#333";  // Koyu yazı rengi
        dialog.style.backgroundColor = "#ffffff";  // Beyaz arka plan
        dialog.style.fontSize = "14px";
        dialog.style.lineHeight = "1.5";
        dialog.style.textTransform = "none";
        dialog.style.width = "275px";
        dialog.style.padding = "15px";
        dialog.style.marginTop = "10px";
        dialog.style.borderRadius = "12px";

        // 3 boyutlu etki için renkli kenarlık ve gölgeler
        dialog.style.border = "2px solid #0077cc"; // Mavi kenarlık
        dialog.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3)"; // Güçlü siyah gölge
        
        // İç gölge ve derinlik etkisi
        dialog.style.borderTopColor = "#66b3ff";  // Daha açık bir üst kenar rengi (ışık etkisi)
        dialog.style.borderLeftColor = "#66b3ff";  // Sol kenar için açık ton
        dialog.style.borderBottomColor = "#004080";  // Alt kenar daha koyu (derinlik)
        dialog.style.borderRightColor = "#004080";  // Sağ kenar daha koyu ton

        dialog.style.position = "absolute";
        dialog.style.zIndex = 9999;

        // Başlangıç konumu (translateX ile kaydır)
        dialog.style.transform = "translateX(-20px)";

        if (item.context.includes("<img")) dialog.style.position = "static";
        else dialog.style.position = "absolute";

        // Append the dialog to the body or another appropriate container
        newDiv.appendChild(dialog);

        // Event listener to toggle dialog visibility on click
        newDiv.addEventListener("click", (event) => {
          // Eğer dialog zaten açıksa, kapat
          if (dialog.style.display === "block") {
            closeDialog(dialog);
          } else {
            openDialog(dialog);
          }

          event.preventDefault();
        });

        newDiv.addEventListener("mouseenter", () => {
          newDiv.style.transform = "scale(1.05)";
          newDiv.style.transition = "transform 0.2s ease";
        });
        
        newDiv.addEventListener("mouseleave", () => {
          newDiv.style.transform = "scale(1)";
        });

        // Document seviyesinde bir tıklama olayını dinle
        document.addEventListener("click", (event) => {
          openDialogs.forEach((dialog) => closeDialog(dialog));
        });

        // Document seviyesinde bir kaydırma olayını dinle
        document.addEventListener("scroll", () => {
          openDialogs.forEach((dialog) => closeDialog(dialog));
        });


        // Fonksiyonlar açık/kapalı dialogları kontrol etmek için
        function openDialog(dialog) {
          closeAllDialogs();
          dialog.style.display = "block";  // Görünür yap
          setTimeout(() => { 
            dialog.style.opacity = 1;  // Yavaş yavaş görünürlük
            dialog.style.transform = "translateX(0)";  // Yerine kaydır
          }, 10);
          dialog.parentNode.parentNode.style.border = "2px solid yellow";
          openDialogs.push(dialog);
          ensureDialogIsInViewport(dialog);
        }

        function closeDialog(dialog) {
          if (dialog) {
            dialog.style.opacity = 0;
            dialog.style.transform = "translateX(-20px)";
            setTimeout(() => {
              dialog.style.display = "none";
            }, 300);
            const index = openDialogs.indexOf(dialog);
            if (index !== -1) {
              openDialogs.splice(index, 1);
            }

            // Check if the dialog has the expected parent nodes
            if (dialog.parentNode && dialog.parentNode.parentNode) {
              dialog.parentNode.parentNode.style.border = "";
            }
          }
        }

        function closeAllDialogs() {
          openDialogs.forEach((dialog) => closeDialog(dialog));
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
    <div style={{ height: "800px" }}>
      {/* Tabs component */}
      <Tabs value={props.value} onChange={handleChange}>
        <Tab label="Summary" />
        <Tab label="Error List" />
        <Tab label="Warning List" />
        <Tab label="Notice List" />
      </Tabs>

      <TabPanel value={props.value} index={0}>
        <SummaryList
          error={props.errors.length}
          warning={props.warnings.length}
          notice={props.notices.length}
          setTab={props.setValue}
        ></SummaryList>
        <ButtonComponent
          btnName={"View Details"}
          handleSubmit={handleViewDetails}
        ></ButtonComponent>
      </TabPanel>

      <TabPanel value={props.value} index={1}>
        <Item>
          <SelectedListItem
            result={props.errors}
            title={"error"}
            iframe={props.iframe}
            url={props.url}
          ></SelectedListItem>
        </Item>
      </TabPanel>

      <TabPanel value={props.value} index={2}>
        <Item>
          <SelectedListItem
            result={props.warnings}
            title={"warning"}
            iframe={props.iframe}
            url={props.url}
          ></SelectedListItem>
        </Item>
      </TabPanel>

      <TabPanel value={props.value} index={3}>
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
