import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const fetchingStatusList = {
  success: 'SUCCESS',
  loading: 'LOADING',
  failed: 'FAILED',
}
class ProductItemDetails extends Component {
  state = {
    productDetail: [],
    fetchingStatus: fetchingStatusList.loading,
    similarProductDetails: [],
    qty: 1,
  }

  componentDidMount() {
    this.getApiResults()
  }

  increaseCount = () =>
    this.setState(prevState => ({
      qty: prevState.qty + 1,
    }))

  decreaseCount = () => {
    const {qty} = this.state
    if (qty > 1) {
      this.setState(prevState => ({
        qty: prevState.qty - 1,
      }))
    }
  }

  getApiResults = async () => {
    const {location} = this.props
    this.setState({fetchingStatus: fetchingStatusList.loading})
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
        fetchingStatus: fetchingStatusList.success,
      })
    } else if (response.status === 404) {
      this.setState({fetchingStatus: fetchingStatusList.failed})
    }
  }

  renderProductDetail = () => {
    const {productDetail, similarProductDetails, qty} = this.state

    return (
      <>
        <div className="productDetailCardContainer">
          <div className="imageCardContainer">
            <img
              className="productImage"
              src={productDetail.image_url}
              alt="product"
            />
          </div>
          <div className="productDetailsContainer">
            <h1>{productDetail.title}</h1>
            <p>Rs {productDetail.price}/-</p>
            <div className="reviewPara">
              <p className="ratingSpan">
                {productDetail.rating}
                {'  '}
                <AiFillStar className="star" />
              </p>
              {productDetail.total_reviews} Reviews
            </div>
            <p>{productDetail.description}</p>
            <p>Available: {productDetail.availability}</p>
            <p>Brand: {productDetail.brand}</p>
            <hr />
            <div className="buttonContainer">
              <button id="plus" type="button" onClick={this.increaseCount}>
                <BsPlusSquare />
              </button>
              <p>{qty}</p>
              <button id="minus" type="button" onClick={this.decreaseCount}>
                <BsDashSquare />
              </button>
            </div>

            <button className="addToCartButton" type="button">
              Add to Cart
            </button>
          </div>
        </div>
        <div className="similarProductsContainer">
          <h1>Similar Products</h1>
          <ul className="similarItemsContainer">
            {similarProductDetails.map(each => (
              <SimilarProductItem key={each.id} item={each} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="noPorductFoundMainContainer">
      <img
        className="noProductImage"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button className="ContinueShoppingButton" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div id="loader" className="productsLoaderContainer">
      <Loader
        className="loader"
        type="ThreeDots"
        color="#0b69ff"
        height="50"
        width="50"
      />
    </div>
  )

  render() {
    const {fetchingStatus} = this.state

    switch (fetchingStatus) {
      case fetchingStatusList.loading:
        return this.renderLoadingView()
      case fetchingStatusList.success:
        return this.renderProductDetail()
      case fetchingStatusList.failed:
        return this.renderFailureView()
      default:
        return null
    }
  }
}
export default ProductItemDetails
