import * as regIcons from '@fortawesome/free-regular-svg-icons'
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FunctionComponent } from 'react'

interface RatingProps {
  value: number
  text?: string
  color?: string
}
const Rating: FunctionComponent<RatingProps> = ({ value, text, color = '#f8e825' }) => {
  return (
    <div className="rating">
      {[...Array(5)].map((x, i) => {
        const full = value >= i + 1
        const half = value >= i + 0.5

        return (
          <span key={`star-${i}`}>
            {full && (
              <>
                <FontAwesomeIcon color={color} icon={faStar} />
              </>
            )}
            {!full && half && (
              <>
                <FontAwesomeIcon color={color} icon={faStarHalfAlt} />
              </>
            )}
            {!full && !half && (
              <>
                <FontAwesomeIcon color={color} icon={regIcons.faStar} />
              </>
            )}
          </span>
        )
      })}{' '}
      ({value}) <span>{text && text}</span>
    </div>
  )
}

export default Rating
