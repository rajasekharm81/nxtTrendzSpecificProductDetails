import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

class SimilarProductItem extends Component {
  render() {
    const {item} = this.props
    return (
      <li className="itemContainer">
        <img
          className="similarItemImage"
          src={item.image_url}
          alt="similar product"
        />
        <h3>{item.title}</h3>
        <p>By {item.brand}</p>
        <div className="priceAndRatingContainer">
          <p>Rs: {item.price}</p>
          <p className="reviewPara">
            <span className="ratingSpan">
              {item.rating}
              {'  '}
              <AiFillStar className="star" />
            </span>
          </p>
        </div>
      </li>
    )
  }
}

export default SimilarProductItem
