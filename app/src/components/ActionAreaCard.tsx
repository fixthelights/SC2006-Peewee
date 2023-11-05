import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { StringDecoder } from 'string_decoder';
import {Grid, Box} from '../components/ComponentsIndex'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface ActionAreaCardProps{
  image: string
  title: string
  description: string
}

const ActionAreaCard: React.FC<ActionAreaCardProps> = ({image, title, description}) => {
  return (
    <Box
    sx={{
        display: "flex",
        flexDirection:"row",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        height: "100px",
        pt: 23
    }}
>
    <Card sx={{ width: 345, height: 300}}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="190"
          image={image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </Box>
  );
};

export {ActionAreaCard}