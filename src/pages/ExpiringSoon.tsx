import dayjs from "dayjs";
import http from "../api/http";
import Breadcrumb from "../components/breadcrums";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import React, { useState, useEffect } from 'react';



const BakeryPOS: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  

  const getProducts = async() =>{
    const response = await http.get('/get-products')
    setProducts(response.data.data)
  }

  const getIngredients = async() =>{
    const response = await http.get('/get-ingredients')
    setIngredients(response.data.data)
  }

  useEffect(()=>{
    getProducts()
    getIngredients()
  }, [])

  return (
  <>
    <Header />
    <Sidemenu />
      <div className="main-content app-content min-h-screen flex flex-col bg-white-200">
        <div className="container-fluid flex flex-col flex-grow">
          <Breadcrumb
            title="Bakery Inventory Dashboard"
            links={[{ text: "Dashboard", link: "/dashboard" }]}
            active="Inventory"/>
        {/* products table */}
        <div>
          <h3>All Products</h3>
          <table className="table border border-black">
            <tr className="flex border">
              <th className="flex-1 border-b border-black">Product Name</th>
              <th className="flex-1 border-b border-black">Product Price</th>
              <th className="flex-1 border-b border-black">stock</th>
              <th className="flex-1 border-b border-black">type</th>
              <th className="flex-1 border-b border-black">expiry</th>
            </tr>
            {
              products.map((i)=> 
                <tr className="flex">
                  <td className="flex-1 border">{i.pname}</td>
                  <td className="flex-1 border">{i.pprice}</td>
                  <td className="flex-1 border">{i.stock}</td>
                  <td className="flex-1 border">{i.ptype}</td>
                  <td className="flex-1 border" style={{color: dayjs(i.pexpiry).diff(dayjs(), 'day') >= 7 ? 'green' : 'red'}}>{i.pexpiry}</td>
                </tr>
              )
            }

          </table>
        </div>

        {/* ingredient table */}
        <div>
          <h3>All Ingredients</h3>
          <div>
            <h3>All Products</h3>
            <table className="table border border-black">
              <tr className="flex border">
                <th className="flex-1 border-b border-black">Ingredient Name</th>
                <th className="flex-1 border-b border-black">Ingredient Stock</th>
              </tr>
              {
                ingredients.map((i)=> 
                  <tr className="flex">
                    <td className="flex-1 border">{i.ingredientname}</td>
                    <td className="flex-1 border">{i.stock}</td>
                  </tr>
                )
              }

            </table>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default BakeryPOS;