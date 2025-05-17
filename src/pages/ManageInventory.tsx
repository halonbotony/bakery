import Breadcrumb from "../components/breadcrums";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaBreadSlice, FaPlus, FaMinus, FaTrash, FaSearch } from 'react-icons/fa';
import http from "../api/http";

interface InventoryItem {
  name: string;
  quantity: number;
  category: 'bread' | 'cake' | 'other';
  image: string;
}

// Image URLs for each product
const productImages: Record<string, string> = {
  // Bread Products
  'Pandesal': "https://assets.tastemadecdn.net/images/2500b0/88b2df481e91c5531a6e/6797b8.jpg",
  'Star Bread': "https://i.ytimg.com/vi/6GPs4GOb-yw/maxresdefault.jpg",
  'Pan De Coco': "https://th.bing.com/th/id/R.408cfc427e78075621c4b2dad3546103?rik=sdTrrdpWiCqfvQ&riu=http%3a%2f%2f3.bp.blogspot.com%2f-2Mi7p_neGio%2fUYM7KZaPePI%2fAAAAAAAAAm4%2f3pRP-hnIOzQ%2fs1600%2fpan%2b006_edited-1.jpg&ehk=GPXkGtXjg3k5tvgucPHU2c6OK4ztFr4Z1xz6klx4ttI%3d&risl=&pid=ImgRaw&r=0",
  'Donut': "https://i.pinimg.com/736x/73/b7/a7/73b7a7b828d8be35bc0ba1acaaf7dfb7.jpg",
  'Shakoy': "https://i.ytimg.com/vi/OO_DOe-dUr8/maxresdefault.jpg",
  'Monay': "https://www.discoverthephilippines.com/wp-content/uploads/2021/08/monay.jpg",
  'Hopia': "https://th.bing.com/th/id/R.c474670b8caaa71d49131afa4a7ac876?rik=M0XAoqu%2bBa5edw&riu=http%3a%2f%2f2.bp.blogspot.com%2f_iw3Vvd1jqmA%2fRa8x2uhG2oI%2fAAAAAAAAAKQ%2f78HwIGR1R8M%2fs320%2fhopia.JPG&ehk=VEyiwbj3neGLpNwPLEAa%2fbAIabOIX5CHCHmkMIjlTYQ%3d&risl=&pid=ImgRaw&r=0",
  'Spanish Bread': "https://i.ytimg.com/vi/6adQgWA5GTw/maxresdefault.jpg",
  'Ensaymada': "https://i.ytimg.com/vi/98m0eM0_y1w/maxresdefault.jpg",
  'Cupcake': "https://i0.wp.com/ayellowbowl.com/wp-content/uploads/2018/03/P1100463.jpg?fit=1024%2C683&ssl=1",
  'Crinkles': "https://th.bing.com/th/id/R.013b5f8175e70500fcf40119e1131ded?rik=Gw7E61Pt3T3lNQ&riu=http%3a%2f%2fimages.summitmedia-digital.com%2fspotph%2fimages%2f2020%2f01%2f16%2fk-640-1579169717.jpg&ehk=aL3HlH%2f%2f5y3Q4XObA3ugsGKLCvi8vtDMmfCTXicXXlg%3d&risl=&pid=ImgRaw&r=0",
  'Mamon': "https://images.sbs.com.au/dims4/default/b8055ec/2147483647/strip/true/crop/3484x1960+126+0/resize/1280x720!/quality/90/?url=http:%2F%2Fsbs-au-brightspot.s3.amazonaws.com%2Fdrupal%2Fyourlanguage%2Fpublic%2Fthis.jpg&imwidth=1280",

  // Cake Products
  'Red Velvet': "https://www.thespruceeats.com/thmb/NQlKcmgH6A34snRB1CjFIGmRopc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/homemade-red-velvet-cake-with-cooked-frosting-3053390-hero-01-a17ad925fbea47fa8585f6cd39a0167e.jpg",
  'Raspberry Cake': "https://www.mycakeschool.com/images/2023/04/Raspberry-Cake-Mix-Recipe-featured-image-.jpg",
  'Oreo Cake': "https://th.bing.com/th/id/OIP.tHEWOdNtR68MvJS2u-bd1QHaE8?cb=iwp2&rs=1&pid=ImgDetMain",
  'White Forest Cake': "https://cafecakeguru.com/wp-content/uploads/2021/06/White-Forest-Cake.jpg",
  'Green Velvet Cake': "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/1/29/1/FN_St-Patricks-Day-Green-Velvet-Layer-Cake_s4x3.jpg.rend.hgtvcom.826.620.suffix/1391199935993.jpeg",
  'Cookies and Cream Cake': "https://alldayidreamaboutfood.com/wp-content/uploads/2019/10/Keto-Cookies-and-Cream-Cake-2.jpg",
  'Ube Cake': "https://th.bing.com/th/id/R.9ab7dd18e6b0c18326941a71b8f912ec?rik=iEkgNLSZhDUV1A&riu=http%3a%2f%2fflavorsoflife.com.ph%2fwp-content%2fuploads%2f2020%2f01%2fimage2-resized.jpg&ehk=bzqGPXcFGrvcj8evI3ZXaFBQ3Hc3DtQG7UIB3eDNX14%3d&risl=&pid=ImgRaw&r=0",
  'Black Forest Cake': "https://static01.nyt.com/images/2020/01/15/dining/ss-black-forest-cake/merlin_165684495_6689b1a0-42b5-4228-b871-37bb983d797e-superJumbo.jpg",
  'Chocolate Mousse Cake': "https://cafecakeguru.com/wp-content/uploads/2021/06/Chocolate-Cheese-Cake.jpg",
  'Purple Yam': "https://th.bing.com/th/id/OIP.lVlQkhmAhBRw8n4eyUolRwAAAA?cb=iwp2&rs=1&pid=ImgDetMain",

  // Default fallback image
  'default': 'https://i.imgur.com/placeholder.jpg'
};


const ManageInventory: React.FC = () => {

  const [newItem, setNewItem] = useState({
    pname: "",
    pprice: "",
    stock: "",
    ptype: "Bread",
    pexpiry: "",
    picturepath: ""
  });

  const [newIngredient, setNewIngredient] = useState({
    ingredientname:"",
    stock:""
  })

  const handleNewIngredients = (key:any, value:any) => {
    setNewIngredient(prevState=>({
      ...prevState,
      [key]: value
    }))
  }

  const [items, setItems] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [stockChanges, setStockChanges] = useState<{ [key: number]: string }>({});

  const getItemsAll = async () => {
    const response = await http.get('/get-products');
    if (response.status === 200) {
      setItems(response.data.data);
    }
  };


  const getIngredientsAll = async () => {
    const response = await http.get('/get-ingredients')
    if (response.status == 200) {
      setIngredients(response.data.data)
    }
  }


  useEffect(() => {
    getItemsAll();
    getIngredientsAll();
  }, []);

  const handleSetNewItem = (key: any, value: any) => {
    setNewItem(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const addItem = async () => {
    const response = await http.post('/save-product', { dataVariable: newItem });
    if (response.status === 200) {
      alert("Added new item");
      getItemsAll();
    }
  };

  const deleteProduct = async (id: any) => {
    const response = await http.delete(`/delete-product?id=${id}`);
    if (response.status === 200) {
      alert("Item deleted");
      getItemsAll();
    }
  };

  const handleUpdateStock = async (id: number, newStock: number, tableName: string) => {
    try {
      const response = await http.post('/update-stock', { id, stock: newStock, tableName:tableName});
      if (response.status === 200) {
        getItemsAll();
        getIngredientsAll();
      }
    } catch (error) {
      console.error("Failed to update stock:", error);
      alert("Failed to update stock");
    }
  };

  const addIngredient = async () => {
    const response = await http.post("/save-ingredient", {dataVariable:newIngredient});
    if (response.status == 200) {
      alert("Ingredient Added");
      getIngredientsAll();
    }
  }

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content min-h-screen flex flex-col bg-white-200">
        <div className="container-fluid flex flex-col flex-grow">
          <Breadcrumb
            title="Bakery Inventory Dashboard"
            links={[{ text: "Dashboard", link: "/customers" }]}
            active="Inventory" />
          
          {/* Add New Item Section */}
          <div className="flex flex-col">
            <h3>Add New Item</h3>
            <div className="flex gap-5">
              <div className="flex items-center gap-1">
                <p>Item Name: </p>
                <input placeholder="Item Name" onChange={(e) => handleSetNewItem("pname", e.target.value)} />
              </div>
              <div className="flex items-center gap-1">
                <p>Item Price: </p>
                <input placeholder="Item Price" onChange={(e) => handleSetNewItem("pprice", e.target.value)} />
              </div>
              <div className="flex items-center gap-1">
                <p>Item Stock: </p>
                <input placeholder="Item Stock" onChange={(e) => handleSetNewItem("stock", e.target.value)} />
              </div>
            </div>
            <div className="flex gap-5 mt-5">
              <div className="flex items-center gap-1">
                <p>Item Type:</p>
                <select onChange={(e) => handleSetNewItem("ptype", e.target.value)}>
                  <option value="Bread">Bread</option>
                  <option value="Cake">Cake</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <p>Item Expiry: </p>
                <input placeholder="Date" type="date" onChange={(e) => handleSetNewItem("pexpiry", e.target.value)} />
              </div>
              <div className="flex items-center gap-1">
                <p>Picture Path: </p>
                <input placeholder="URL" onChange={(e) => handleSetNewItem("picturepath", e.target.value)} />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={addItem}>Add item</button>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div>
            <div>
              <h3>Items</h3>
            </div>
            <div className="flex flex-wrap gap-5">
              {items.map((i) => (
                <div key={i.id} className="flex flex-col items-center border border-black p-5 rounded-xl shadow-lg">
                  <button className="self-end" onClick={() => deleteProduct(i.id)}>Delete</button>
                  <img src={i.picturepath} alt="no image yet" className="size-40" />
                  <h4>{i.pname}</h4>
                  <p>Quantity: {i.stock}</p>
                  <div className="flex items-center gap-2">
                    <button
                      className="size-5 border border-black"
                      onClick={() => handleUpdateStock(i.id, parseInt(i.stock) - 1, "tblproduct")}
                    >-</button>
                    <button
                      className="size-5 border border-black"
                      onClick={() => handleUpdateStock(i.id, parseInt(i.stock) + 1, "tblproduct")}
                    >+</button>
                    <input readOnly value={i.stock} />
                    <input
                      style={{ width: 125 }}
                      placeholder="add/remove"
                      value={stockChanges[i.id] || ""}
                      onChange={(e) =>
                        setStockChanges(prev => ({ ...prev, [i.id]: e.target.value }))
                      }
                    />
                    <button
                      onClick={() => {
                        const change = parseInt(stockChanges[i.id] || "0");
                        if (!isNaN(change)) {
                          handleUpdateStock(i.id, parseInt(i.stock) + change, "tblproduct");
                        }
                      }}
                    >Add</button>
                    <button
                      onClick={() => {
                        const change = parseInt(stockChanges[i.id] || "0");
                        if (!isNaN(change)) {
                          handleUpdateStock(i.id, parseInt(i.stock) - change, "tblproduct");
                        }
                      }}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredient List */}
          <div className="flex flex-col mt-10">
            <h3>Add New Ingredient</h3>
            <div className="flex gap-5">
              <div className="flex items-center gap-1">
                <p>Item Name: </p>
                <input placeholder="Ingredient Name" onChange={(e) => handleNewIngredients("ingredientname", e.target.value)} />
              </div>
              <div className="flex items-center gap-1">
                <p>Item Quantity: </p>
                <input placeholder="Item Stock" onChange={(e) => handleNewIngredients("stock", e.target.value)} />
              </div>
              <button onClick={addIngredient}>Add Item</button>
            </div>
          </div>

          {/* Ingredient List */}
          <div>
            <div>
              <h3>Ingredients</h3>
            </div>
            <div className="flex flex-wrap gap-5">
              {ingredients.map((i) => (
                <div key={i.id} className="flex flex-col items-center border border-black p-5 rounded-xl shadow-lg">
                  <button className="self-end" onClick={() => deleteProduct(i.id)}>Delete</button>
                  
                  <h4>{i.ingredientname}</h4>
                  <p>Quantity: {i.stock}</p>
                  <div className="flex items-center gap-2">
                    <button
                      className="size-5 border border-black"
                      onClick={() => handleUpdateStock(i.id, parseInt(i.stock) - 1, "tblingredient")}
                    >-</button>
                    <button
                      className="size-5 border border-black"
                      onClick={() => handleUpdateStock(i.id, parseInt(i.stock) + 1, "tblingredient")}
                    >+</button>
                    <input readOnly value={i.stock} />
                    <input
                      style={{ width: 125 }}
                      placeholder="add/remove"
                      value={stockChanges[i.id] || ""}
                      onChange={(e) =>
                        setStockChanges(prev => ({ ...prev, [i.id]: e.target.value }))
                      }
                    />
                    <button
                      onClick={() => {
                        const change = parseInt(stockChanges[i.id] || "0");
                        if (!isNaN(change)) {
                          handleUpdateStock(i.id, parseInt(i.stock) + change, "tblingredient");
                        }
                      }}
                    >Add</button>
                    <button
                      onClick={() => {
                        const change = parseInt(stockChanges[i.id] || "0");
                        if (!isNaN(change)) {
                          handleUpdateStock(i.id, parseInt(i.stock) - change, "tblingredient");
                        }
                      }}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageInventory;