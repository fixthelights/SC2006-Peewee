import { FC } from "react";

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