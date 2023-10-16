import React, { FC } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';

interface IncidentListItemProps {
    incidentType: String
    incidentTime: String
    incidentLocation: String
    incidentDescription: String 
}
  
const IncidentListItem: FC<IncidentListItemProps> = ({incidentType, incidentTime, incidentLocation, incidentDescription}) => {
    return ( 
        <React.Fragment>
            <Grid item xs={12} md={12} lg={12}>
            <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 300,
                overflow: 'auto'
            }}
            >
            <Stack spacing={2} direction="row" paddingX={2} paddingY={2}>
            <Typography
                component="h1"
                variant="body1"
                color="inherit"
                noWrap
            >
                {incidentType}
            </Typography>
            </Stack>
            <Stack spacing={2} direction="row" paddingX={2} paddingY={2}>
            <AccessTimeIcon />
                <Typography
                component="h1"
                variant="body1"
                color="inherit"
                noWrap
                >
                {incidentTime}
                </Typography>
            </Stack>
            <Stack spacing={2} direction="row" paddingX={2} paddingY={2}>
            <FmdGoodOutlinedIcon />
                <Typography
                component="h1"
                variant="body1"
                color="inherit"
                noWrap
                >
                {incidentLocation}
            </Typography>
            </Stack>
            <Typography
                component="h1"
                variant="body1"
                color="inherit"
                paddingX={2}
                paddingY={2}
                >
                {incidentDescription}
            </Typography>
            </Paper>
        </Grid>
        </React.Fragment>
    )
  }
  
  export {IncidentListItem}