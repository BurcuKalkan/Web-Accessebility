
import React, { useState, useRef } from 'react';
import CardComponent from '../../components/Card';
import { Grid, Paper, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import TabComponent from '../../components/Tab';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const HomePage = () => {
    const [isVisible, setVisible] = useState(false);
    const [result, setResult] = useState();
    const [url, setUrl] = useState("");
    const [iframeLoaded, setIFrameLoaded] = useState(false);
    const title = 'Website Accessibility Tool';

    const iframeRef = useRef(null);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api?url=${url}`)
            const result = await response.json();
            setResult(result.results)
            iframeRef.current.srcdoc = result.page
            setIFrameLoaded(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSubmit = () => {
        setResult(null);
        setIFrameLoaded(false);

        fetchData();
        setVisible(!isVisible)
    }

    const onLoad = () => {
        setIFrameLoaded(true);
    }

    return (
        <>
            <CardComponent title={title} handleSubmit={handleSubmit} setUrl={setUrl}></CardComponent>

            {isVisible &&
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        {
                            <TabComponent result={iframeLoaded ? result : undefined} iframe={iframeRef} url={url}></TabComponent>
                        }
                    </Grid>
                    <Grid item xs={9} >
                        <Item>
                        {!iframeLoaded && (
                                // İframe yüklenirken gösterilecek spinner
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '800px' }}>
                                    <CircularProgress />
                                    <Typography variant="h6" style={{ marginLeft: '10px' }}>Loading...</Typography>
                                </div>
                            ) }
                            <iframe
                                    ref={iframeRef}
                                    id="inlineFrameExample"
                                    title="Inline Frame Example"
                                    width="100%"
                                    height="800px"
                                    onLoad={onLoad}
                                />
                        </Item>
                    </Grid>
                </Grid>}

        </>

    );
}

export default HomePage;