import React from 'react';
import { Card, CardContent, Typography, TextField } from '@mui/material';
import ButtonComponent from '../Button';

const useStyles = () => ({
    cardStyle: {
        width: '900px', // veya istediğiniz genişliği belirleyin
        height: '150px', // veya istediğiniz yüksekliği belirleyin
        backgroundColor: 'black',
        margin: 'auto',
        marginTop: '30px',
        marginBottom: '10px',
        borderRadius: '20px'
    },

    titleStyle: {
        fontSize: '2rem', // Set the desired font size
        color: 'white',
        fontFamily: 'Arial, sans-serif', // Set the desired font family
    },

    textStyle: {
        margin: 'auto',
        background: 'white',
        width: 500,
        marginTop: 30,
        marginRight: 8,
    }
});

const CardComponent = ({ title, handleSubmit, setUrl }) => {

    const classes = useStyles();

    return (
        <>
            <Card style={classes.cardStyle}>
                <CardContent>
                    <Typography variant='h2' style={classes.titleStyle}>
                        {title}
                    </Typography>
                    <TextField placeholder='Enter a website' style={classes.textStyle} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleSubmit();
                        }
                    }} variant='outlined' size='small'></TextField>
                    <ButtonComponent btnName={'Submit'} handleSubmit={handleSubmit} ></ButtonComponent>
                </CardContent>
            </Card>
        </>

    );
};

export default CardComponent;