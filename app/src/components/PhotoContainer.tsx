import React, { FC } from "react";
import ReactDOM from "react-dom";
import Photo from "./Photos";

interface PhotoContainerProps {
  photos: string[];
}

const PhotoContainer: FC<PhotoContainerProps> = ({ photos }) => {
  return (
    <div>
      {photos.map((photo, index) => (
        <img key={index} src={photo} alt={`Road condition ${index}`} />
      ))}
    </div>
  );
};

export default PhotoContainer;