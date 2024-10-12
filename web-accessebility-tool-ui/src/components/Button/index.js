import React from 'react';
import { Button } from '@mui/material';

const useStyles = () => ({
    buttonStyle: {
        variant: 'outlined',
        margin: '',
        color: 'white',
        background: 'blue',
        marginTop: 50,
        height: '40px',
        minWidth: '100px'
    }
})

export default function ButtonComponent(props) {
    const classes = useStyles();
    return (
        <Button style={classes.buttonStyle} onClick={props.handleSubmit}>
            {props.btnName}
        </Button>
    );
}