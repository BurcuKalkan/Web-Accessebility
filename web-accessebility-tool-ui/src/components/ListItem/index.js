import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { styled, Collapse } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const CustomListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  transition: "all 0.3s ease",
  ...(selected && {
    backgroundColor: "#ffeb3b", // Highlight the selected item with a yellow background
    border: "2px solid #fbc02d", // Border similar to the image highlighting
    boxShadow: "0 0 10px rgba(255, 193, 7, 0.7)",
    transform: "scale(1.05)",
  }),
}));

export default function SelectedListItem(props) {
  const [selectedImage, setSelectedImage] = useState();
  const listItemRefs = useRef([]);

  const resetSelectedImageStyle = () => {
    if (selectedImage) {
      Object.assign(selectedImage.style, {
        border: "",
        boxShadow: "",
        transform: "",
        filter: "",
        transition: "",
        perspective: "",
      });
    }
  };

  const handleListItemClick = (item, index) => {
    props.setSelectedItem(item);
    props.setSelectedItemIndex(index);
    handleListItemImage(item);
  };

  const handleListItemImage = (item) => {
    if (selectedImage) {
      resetSelectedImageStyle();
    }
    // Find image elements with the corresponding alt attribute
    const image = document
      .querySelector("#inlineFrameExample")
      .contentWindow.document.querySelector(`img[alt="${item.selector}"]`);

    setSelectedImage(image);

    if (image) {
      Object.assign(image.style, {
        border: "3px solid yellow",
        boxShadow:
          "0 0 20px rgba(255, 255, 0, 0.8), 0 0 30px rgba(255, 255, 0, 0.5)",
        transform: "scale(1.2) rotateY(10deg)",
        transition: "all 0.4s ease",
        filter: "brightness(1.3) contrast(1.2)",
        //  perspective: "1000px",
      });
    }

    image.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1980,
        height: "100%",
        maxHeight: 807,
        bgcolor: "background.paper",
        overflow: "auto",
      }}
    >
      <List component="nav">
        {props.result.map((item, index) => (
          <Box key={index}>
            {/* CustomListItemButton to select an item */}
            <CustomListItemButton
              ref={(el) => (listItemRefs.current[index] = el)}
              selected={props.selectedItemIndex === index}
              onClick={() => handleListItemClick(item, index)}
              sx={{
                display: "flex",
                justifyContent: "space-between", // Space between avatar and text
                overflow: "hidden", // Hide overflow
              }}
            >
              <ListItemAvatar>
                <Avatar alt="Error" src={`images/${props.title}.png`} />
              </ListItemAvatar>
              <Tooltip title={item.code} arrow>
                {" "}
                {/* Tooltip to show full code on hover */}
                <ListItemText
                  primary={item.code}
                  sx={{
                    maxWidth: "200px", // Set a max width for the text
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap", // Prevent wrapping
                    marginLeft: 1, // Add some space between the avatar and the text
                  }}
                />
              </Tooltip>
            </CustomListItemButton>

            <Collapse
              in={props.selectedItemIndex === index}
              timeout="auto"
              unmountOnExit
            >
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#f5f5f5",
                  borderLeft: "3px solid #ffeb3b",
                }}
              >
                <Tooltip title={item.context} arrow>
                  {" "}
                  {/* Tooltip for h4 text */}
                  <h4
                    style={{
                      maxWidth: "300px", // Set a max width
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap", // Prevent wrapping
                    }}
                  >
                    {item.context}
                  </h4>
                </Tooltip>
                <p>{item.message}</p>
              </Box>
            </Collapse>

            <Divider />
          </Box>
        ))}
      </List>
      <Divider />
    </Box>
  );
}
