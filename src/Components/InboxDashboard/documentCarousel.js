import React from "react";
import Carousel from 'react-bootstrap/Carousel';

const DocumentCarousel = (props) => {
  return (
    <>
      <Carousel>
        {props.images?.map((image) => 
        <Carousel.Item >
          <div class="doc-image mx-auto my-0 text-center">
            {
              image?.url ? 
              <img src={image.url} text="First slide" />
              :
              <img src={image} text="First slide" />
            }
            
          </div>
        </Carousel.Item>
        )}
        
      </Carousel>
    </>
  );
};

export default DocumentCarousel;