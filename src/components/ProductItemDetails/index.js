import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'

import SimilarProductItem from '../SimilarProductItem'
import './index.css'

class ProductItemDetails extends Component {
  state = {productDetail: [], similarProductDetails: [], qty: 1}

  componentDidMount() {
    this.getApiResults()
  }

  increaseCount = () =>
    this.setState(prevState => ({
      qty: prevState.qty + 1,
    }))

  decreaseCount = () => {
    const {qty} = this.state
    if (qty > 0) {
      this.setState(prevState => ({
        qty: prevState.qty - 1,
      }))
    }
  }

  getApiResults = async () => {
    const {location} = this.props
    const match = location
    const url = match
    const apiRequestUrl = `https://apis.ccbp.in${url.pathname}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(apiRequestUrl, options)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        productDetail: data,
        similarProductDetails: data.similar_products,
      })
    }
  }

  render() {
    const {productDetail, similarProductDetails, qty} = this.state
    console.log(similarProductDetails)
    return (
      <>
        <div className="productDetailCardContainer">
          <div className="imageCardContainer">
            <img
              className="productImage"
              src={productDetail.image_url}
              alt={productDetail.title}
            />
          </div>
          <div className="productDetailsContainer">
            <h1>{productDetail.title}</h1>
            <p>Rs {productDetail.price}/-</p>
            <p className="reviewPara">
              <span className="ratingSpan">
                {productDetail.rating}
                {'  '}
                <AiFillStar className="star" />
              </span>
              {productDetail.total_reviews} Reviews
            </p>
            <p>{productDetail.description}</p>
            <p>Available: {productDetail.availability}</p>
            <p>Brand: {productDetail.brand}</p>
            <hr />
            <div className="buttonContainer">
              <button type="button" onClick={this.increaseCount}>
                +
              </button>
              {qty}
              <button type="button" onClick={this.decreaseCount}>
                -
              </button>
            </div>

            <button className="addToCartButton" type="button">
              Add to Cart
            </button>
          </div>
        </div>
        <div className="similarProductsContainer">
          <h1>Similar Products</h1>
          <div className="similarItemsContainer">
            {similarProductDetails.map(each => (
              <SimilarProductItem key={each.id} item={each} />
            ))}
          </div>
        </div>
      </>
    )
  }
}
export default ProductItemDetails
