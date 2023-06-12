import React from "react";
import "./Card.css";

const Card = ( { value, suit, image } ) => {
    return (
        <div>
            <img src={`${image}`} alt={`${value} of ${suit}`} />
        </div>
    )
}

export default Card;