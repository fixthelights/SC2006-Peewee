import * as React from 'react';
import {TypographyOwnProps, Typography} from "@mui/material";

interface TitleProps extends TypographyOwnProps{
  children?: React.ReactNode;
}

export default function Title(props: TitleProps) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom {...props}>
      {props.children}
    </Typography>
  );
}