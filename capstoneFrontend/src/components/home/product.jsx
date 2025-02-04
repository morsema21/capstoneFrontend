import React from "react";
import { useGetProductByIdQuery } from "./homeSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useAddToCartMutation } from "../cart/cartSlice";
import { useDeleteProductMutation } from "../admin/adminSlice";
import "./home.css";

const SingleProduct = () => {
  const { id } = useParams();
  const {
    data: singleProduct,
    isSuccess,
    isLoading,
  } = useGetProductByIdQuery(id);
  const [addToCart] = useAddToCartMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const navigate = useNavigate();
  const sessionCart = window.sessionStorage.getItem("Cart");
  const sessionIsAdmin = window.sessionStorage.getItem("isAdmin");

  if (isLoading) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!isSuccess || !singleProduct) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = async () => {
    try {
      await addToCart({ id, sessionCart }).unwrap();
      alert("Added to cart");
    } catch (error) {
      alert("This product is already in your cart");
    }
  };

  const handleDeleteProduct = async (event, id) => {
    event.preventDefault();
    try {
      const response = await deleteProduct({ id });
      alert("Product deleted!");
      navigate("/");
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  if (sessionIsAdmin === "true") {
    return (
      <div className="product-form">
        <img
          src={singleProduct.image}
          alt={singleProduct.productName}
          height="300px"
        />
        <h1>{singleProduct.productName}</h1>
        <p className="price">${singleProduct.price}</p>

        <div className="button-container">
          <button
            type="button"
            className="button-confirm"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          <button
            className="button-confirm"
            type="button"
            onClick={() => navigate(`/updateProduct/${id}`)}
          >
            Update Product
          </button>
          <button
            onClick={(event) => handleDeleteProduct(event, id)}
            className="button-confirm"
          >
            Delete Product
          </button>
          <button
            className="button-confirm"
            type="button"
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </div>
    );
  } else if (sessionCart) {
    return (
      <div className="product-form">
        <div className="single-product">
          <img
            src={singleProduct.image}
            alt={singleProduct.productName}
            height="300px"
          />
          <h1>{singleProduct.productName}</h1>
          <p className="price">${singleProduct.price}</p>
          <button
            type="button"
            onClick={handleAddToCart}
            className="button-confirm"
          >
            Add to Cart
          </button>
          <div className="button-container">
            <button
              className="button-confirm"
              type="button"
              onClick={() => navigate("/")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="product-form">
        <div className="single-product">
          <img
            src={singleProduct.image}
            alt={singleProduct.productName}
            height="300px"
          />
          <h1>{singleProduct.productName}</h1>
          <p className="price">${singleProduct.price}</p>
          <div className="button-container">
            <button
              className="button-confirm"
              type="button"
              onClick={() => navigate("/")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }
};
export default SingleProduct;
