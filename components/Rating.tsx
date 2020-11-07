import React, { FunctionComponent } from "react";

interface RatingProps {
  value: number;
  text: string;
  color?: string;
}
const Rating: FunctionComponent<RatingProps> = ({
  value,
  text,
  color = "#f8e825",
}) => {
  return (
    <div className="rating">
      {[...Array(5)].map((x, i) => (
        <span key={`star-${i}`}>
          <i
            style={{ color }}
            className={
              value >= i + 1
                ? "fa fa-star"
                : value >= i + 0.5
                ? "fa fa-star-half-alt"
                : "far fa-star"
            }
          />
        </span>
      ))}
      <span>{text && text}</span>
    </div>
  );
};

export default Rating;
