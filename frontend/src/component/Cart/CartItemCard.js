import React from 'react'
import "./CartItemCard.css";
import {Link} from "react-router-dom";

const CartItemCart = ({item,deleteCartItems}) => {
  return (
    <div className='CartItemCart'>
        <img src={item.image} alt="ssa" />
        <div>
            <Link to={'/product/'+item.product}>{item.name}</Link>
            <span>{'Price : ₹'+item.price}</span>
            <p onClick={()=>deleteCartItems(item.product)}>Remove</p>
        </div>
    </div>
  )
}

export default CartItemCart
