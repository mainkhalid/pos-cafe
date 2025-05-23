import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>
      
      <HorizontalCardProduct category={"hot-coffee"} heading={"Featured Hot Coffee"}/>
      <HorizontalCardProduct category={"cold-coffee"} heading={"Popular Cold Brews"}/>
      
      <VerticalCardProduct category={"tea"} heading={"Premium Teas"}/>
      <VerticalCardProduct category={"pastries"} heading={"Fresh Pastries"}/>
      <VerticalCardProduct category={"sandwiches"} heading={"Gourmet Sandwiches"}/>
      <VerticalCardProduct category={"cakes"} heading={"Specialty Cakes"}/>
      <VerticalCardProduct category={"breakfast"} heading={"Breakfast Menu"}/>
      <VerticalCardProduct category={"smoothies"} heading={"Refreshing Smoothies"}/>
      <VerticalCardProduct category={"seasonal-specials"} heading={"Seasonal Specials"}/>
      <VerticalCardProduct category={"merchandise"} heading={"Cafe Merchandise"}/>
    </div>
  )
}

export default Home