import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

export default function SummaryList(props) {
    const handleTabChange = (tabIndex) => {
        props.setTab(tabIndex); 
    };
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start" button onClick={() => handleTabChange(1)}>
                <ListItemAvatar>
                    <Avatar alt="Error" src="images/error.png" />
                </ListItemAvatar>
                <ListItemText
                    primary="Error"
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                            </Typography>
                            {props.error}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start" onClick={() => handleTabChange(2)}>
                <ListItemAvatar>
                    <Avatar alt="Warning" src="images/warning.png" />
                </ListItemAvatar>
                <ListItemText
                    primary="Warning"
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                            </Typography>
                            {props.warning}
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start" onClick={() => handleTabChange(3)}>
                <ListItemAvatar>
                    <Avatar alt="Notice" src="images/notice.png" />
                </ListItemAvatar>
                <ListItemText
                    primary="Notice"
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                            </Typography>
                            {props.notice}
                        </React.Fragment>
                    }
                />
            </ListItem>
        </List>
    );
}