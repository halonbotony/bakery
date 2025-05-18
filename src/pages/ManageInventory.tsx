import Breadcrumb from "../components/breadcrums";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import React, { useEffect, useState } from 'react';
import http from "../api/http";



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