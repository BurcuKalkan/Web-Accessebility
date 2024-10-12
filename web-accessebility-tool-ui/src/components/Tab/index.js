import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SelectedListItem from '../../components/ListItem'
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import SummaryList from '../SummaryList';
import ButtonComponent from '../Button';
import ReactDOM from 'react-dom/client';
import CustomizedDialogs from './CustomizeDialog';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
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
    // State to manage the selected tab index
    const [value, setValue] = useState(0);
    const [itemList, setItemList] = useState([]);
    const [errors, setErrors] = useState([]);
    const [warnings, setWarniings] = useState([]);
    const [notices, setNotices] = useState([]);
    const [openedDialog, setOpenedDialog] = useState(false);


    useEffect(() => {
        if (!props.result) return;
        //const newList = filterByIframeDocument(props.result.issues);
        const newList = props.result.issues;

        setItemList(newList);
        const errList = errorList(newList)
        const warnList = warningList(newList)
        const notList = noticeList(newList)
        setErrors(errList);
        setWarniings(warnList);
        setNotices(notList);

        createImage(errList, 'images/alt_missing.ico');
        //createImage(warnList, 'images/alt_suspicious.ico');
        //createImage(notList, 'images/alt.ico');

    }, [props.result]);


    // Event handler for tab change
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const filterByIframeDocument = (issues) => {
        const iframeDocument = document.querySelector('#inlineFrameExample').contentWindow.document;

        if (iframeDocument) {
            return issues.filter(val => {
                try {
                    const res = iframeDocument.querySelector(val.selector);
                    return (res !== null && res.tagName.toLowerCase() !== 'iframe');
                } catch (error) {
                    return false;
                }
            });
        }
        return [];
    };

    const handleViewDetails = () => {
        setValue(1);
    }

    const errorList = (newList) => {
        console.log(newList)
        let errors = newList.filter((issue) => issue.type === "error");
        return errors;
    };

    const noticeList = (newList) => {
        return newList.filter((item) => item.type === 'notice');
    };

    const warningList = (newList) => {
        return newList.filter((item) => item.type === 'warning');
    };
const  ensureDialogIsInViewport = (dialog)=> {
    const rect = dialog.getBoundingClientRect();
    const iframe = document.querySelector("#inlineFrameExample").getBoundingClientRect();
  
    // Check if dialog is out of the viewport and adjust its position if necessary
    if (rect.top < 0) {
      dialog.style.top = '10px'; // Adjust if the top is out of view
    }
    if (rect.left < 0) {
      dialog.style.left = '10px'; // Adjust if the left is out of view
    }
    if (rect.bottom > iframe.height) {
      dialog.style.top = `${ -rect.height-50 }px`; // Move the dialog up if bottom is out of view
    }
    if (rect.right > iframe.width) {
      dialog.style.left = `${-rect.width}px`; // Move the dialog left if right is out of view
    }
  }
    const createImage = async (newList, src) => {
        let changes = [];
        // Tüm açık dialogları saklamak için bir dizi oluştur
        const openDialogs = [];
        const iframeDocument = document.querySelector('#inlineFrameExample').contentWindow.document;
        newList.map((item) => {
            try {
                const newDiv = document.createElement('div');
                const newImage = document.createElement('img');
                //html > body > header > div:nth-child(1) > div > div > div > div > ul:nth-child(2) > li:nth-child(2) > span > input
                let selectorResult = document.querySelector('#inlineFrameExample').contentWindow.document.querySelector(item.selector);

                // Apply styles to the new div
              //  newDiv.style.border = '2px solid yellow';
                newDiv.style.display = 'inline-block'; // Ensures the div doesn't break onto a new line
                newDiv.style.padding = '5px'; // Adjust padding as needed
                newDiv.style.zIndex = 999;
                newDiv.style.position = 'relative';
              //  newDiv.style.backgroundColor = '#333';
                newDiv.style.minWidth = '30px'; // Adjust the width as needed
                newDiv.style.minHeight = '30px'; // Maintain aspect ratio
                newImage.style.width = '30px'; // Adjust the width as needed
                newImage.style.height = '30px'; // Maintain aspect ratio

                // Set the source and alt attributes for the image
                newImage.src = src; // Replace with the actual path to your image
                newImage.alt = item.selector;

                // Append the image to the div
                newDiv.appendChild(newImage);
                

                // const dialog = document.createElement('dialog');
                // dialog.textContent = item.message;
                // dialog.style.position = 'absulute';
                // dialog.style.display = 'none';
                // dialog.style.opacity = '1';
                // dialog.style.width = '100x'; // Adjust the width as needed
                // dialog.style.height = '100px';
                // dialog.style.color = 'black';
                // dialog.style.padding = '10px'; // İçerikten kenarlara boşluk bırakma
                // dialog.style.border = '1px solid black'; // İstediğiniz kenarlık rengini ve kalınlığını ayarlayın
                // dialog.style.zIndex = '1000';
                // dialog.style.backgroundColor = 'white';
                // dialog.style.width = '200px';
                // dialog.style.height = '200px';

                // // Append the tooltip to the body
                // newDiv.appendChild(dialog);

                // Event listener to toggle dialog visibility on click
                newDiv.addEventListener('click', (event) => {
                    const dialog = document.createElement('div');
                    dialog.textContent = item.message;
                    dialog.style.display = 'none';
                    dialog.style.backgroundColor = '#333';
                    dialog.style.color = '#fff';
                    dialog.textContent = item.message; // Change this to the desired tooltip content
                    dialog.style.position = "relative";
                    dialog.style.width = "300px";
                    dialog.style.padding = "5px";
                    dialog.style.marginTop = "15px";


                    // Append the dialog to the body or another appropriate container
                    newDiv.appendChild(dialog);

                    // const root = ReactDOM.createRoot(selectorResult);
                    // root.render(<CustomizedDialogs open={true} message={item.message} />);
                    // Eğer dialog zaten açıksa, kapat
                    if (dialog.style.display === 'block') {
                        closeDialog(dialog);
                    } else {
                        openDialog(dialog);
                    }

                    // //Yeni bir küçük bilgi penceresi açmak için burada işlemleri gerçekleştirin
                    // const newTooltip = document.createElement('div');
                    // newTooltip.textContent = item.message; // Buraya istediğiniz içeriği ekleyin
                    // newTooltip.style.backgroundColor = 'lightblue'; // İstediğiniz arka plan rengini ayarlayın
                    // newTooltip.style.position = 'absolute'; // Mutlaka 'absolute' olmalıdır
                    // newTooltip.style.top = event.clientY + 'px'; // Tıklama noktasına göre yukarıdan konumlandırma
                    // newTooltip.style.left = event.clientX + 'px'; // Tıklama noktasına göre soldan konumlandırma
                    // newTooltip.style.padding = '10px'; // İçerikten kenarlara boşluk bırakma
                    // newTooltip.style.border = '1px solid black'; // İstediğiniz kenarlık rengini ve kalınlığını ayarlayın
                    // newTooltip.style.zIndex = '1000'; // Diğer elemanların üzerinde olacak şekilde bir z-index değeri belirleyin
                    // newTooltip.style.color = '#fff';
                    // newTooltip.style.width = '200x'; // Adjust the width as needed
                    // newTooltip.style.height = '200px';
                    // selectorResult.appendChild(newTooltip); // Yeni oluşturulan küçük bilgi penceresini belgeye ekleyin

                    // Yeni bilgi penceresini otomatik olarak kapatmak için zamanlayıcı kullanabilirsiniz
                    // setTimeout(() => {
                    //     newTooltip.remove(); // Belirli bir süre sonra bilgi penceresini kaldırın
                    // }, 3000);
                });



                // Document seviyesinde bir tıklama olayını dinle
                document.addEventListener('click', (event) => {
                    openDialogs.forEach(dialog => closeDialog(dialog));
                });

                // Document seviyesinde bir kaydırma olayını dinle
                document.addEventListener('scroll', () => {
                    // Eğer sayfa kaydırıldıysa, tüm dialogları kapat
                    openDialogs.forEach(dialog => closeDialog(dialog));
                });

                // Document seviyesinde bir kaydırma olayını dinle
                /*                 iframeDocument.addEventListener('click', (event) => {
                                    if (newDiv.contains(event.target) && !openedDialog) {
                                        setOpenedDialog(true);
                                    } else {
                                        openDialogs.forEach(dialog => closeDialog(dialog));
                                        setOpenedDialog(false);
                                    }
                                }); */

                // Document seviyesinde bir kaydırma olayını dinle
                iframeDocument.addEventListener('scroll', () => {
                    // Eğer sayfa kaydırıldıysa, tüm dialogları kapat
                    openDialogs.forEach(dialog => closeDialog(dialog));
                });

                // Fonksiyonlar açık/kapalı dialogları kontrol etmek için
                function openDialog(dialog) {
                    openDialogs.forEach(dia => closeDialog(dia));
                    dialog.style.display = 'block';
                    dialog.parentNode.parentNode.style.border = '2px solid yellow';
                    openDialogs.push(dialog);
                    setOpenedDialog(true);
                    ensureDialogIsInViewport(dialog)
                }

                function closeDialog(dialog) {
                    dialog.style.display = 'none';
                    dialog.parentNode.parentNode.style.border = "";
                    const index = openDialogs.indexOf(dialog);
                    if (index !== -1) {
                        openDialogs.splice(index, 1);
                    }
                    setOpenedDialog(false);
                }

                if (selectorResult){
                    selectorResult.parentNode.appendChild(newDiv);
                   // ensureDialogIsInViewport(newDiv)
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })
    }

    return (
        <div>
            {/* Tabs component */}
            <Tabs value={value} onChange={handleChange} >
                <Tab label="Summary" />
                <Tab label="Error List" />
                <Tab label="Warning List" />
                <Tab label="Notice List" />
            </Tabs>

            <TabPanel value={value} index={0}>
                <SummaryList error={errors.length} warning={warnings.length} notice={notices.length}></SummaryList>
                <ButtonComponent btnName={'View Details'} handleSubmit={handleViewDetails}></ButtonComponent>
            </TabPanel>

            <TabPanel value={value} index={1} >
                <Item>
                    <SelectedListItem result={errors} title={'error'} iframe={props.iframe} url={props.url}></SelectedListItem>
                </Item>
            </TabPanel>

            <TabPanel value={value} index={2} >
                <Item>
                    <SelectedListItem result={warnings} title={'warning'} iframe={props.iframe} url={props.url}></SelectedListItem>
                </Item>
            </TabPanel>

            <TabPanel value={value} index={3} >
                <Item>
                    <SelectedListItem result={notices} title={'notice'} frame={props.iframe} url={props.url}></SelectedListItem>
                </Item>
            </TabPanel>


        </div>
    );
}