import React, { FC } from 'react';
import ReactDOM from "react-dom";

interface PhotoProps {
  url: string;
}

const Photo: FC<PhotoProps> = (props) => {
  return (
    <section>
      <img src={props.url} alt="Camera photo" />
    </section>
  );
}

export default Photo;