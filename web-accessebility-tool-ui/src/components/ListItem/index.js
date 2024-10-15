import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

export default function SelectedListItem(props) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedImage, setSelectedImage] = useState();
  const [selectedImageStyle, setSelectedImageStyle] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setSelectedImageStyle({
        border: selectedImage.style.border,
        boxShadow: selectedImage.style.boxShadow,
        transform: selectedImage.style.transform,
        filter: selectedImage.style.filter,
        transition: selectedImage.style.transition,
        perspective: selectedImage.style.perspective
      });
    }
  }, [selectedImage]);

  const resetSelectedImageStyle = () => {
    if (selectedImageStyle && selectedImage) {
      selectedImage.style.border = "";
      selectedImage.style.boxShadow = "";
      selectedImage.style.transform = "";
      selectedImage.style.filter = "";
      selectedImage.style.transition = "";
      selectedImage.style.perspective = "";
    }
  };

  const handleListItemClick = (item, index) => {
    setSelectedIndex(index);
    setSelectedItem(item);

    console.log(item);

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
    const obj = document
      .querySelector("#inlineFrameExample")
      .contentWindow.document.querySelector(`${item.selector}`);
    setSelectedImage(image);

    if (image) {
      image.style.border = "3px solid yellow"; // Sarı kenarlık
      image.style.boxShadow = "0 0 20px rgba(255, 255, 0, 0.8), 0 0 30px rgba(255, 255, 0, 0.5)"; 
      image.style.transform = "scale(1.2) rotateY(10deg)"; // Büyütme ve 3D döndürme efekti
      image.style.transition = "all 0.4s ease"; // Geçiş animasyonu
      image.style.filter = "brightness(1.3) contrast(1.2)"; // Parlaklık ve kontrast artırma
      image.style.perspective = "1000px";

      // Use scrollIntoView to bring the image into the viewport
      image.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
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
          <ListItemButton
            key={index}
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(item, index)}
          >
            {
              <ListItemAvatar>
                <Avatar alt="Error" src={`images/${props.title}.png`} />
              </ListItemAvatar>
            }
            <ListItemText primary={item.code} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
    </Box>
  );
}
