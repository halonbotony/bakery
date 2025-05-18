import http from "../api/http";
import Breadcrumb from "../components/breadcrums";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import { useEffect, useState } from "react";

export default function POS() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const [hdr, setHdr] = useState({
    transactiontotal: "",
    transactiontype: "CASH",
  });

  const [transaction, setTransaction] = useState({
    hdr: hdr,
    dtl: cart,
  });

  const getProducts = async () => {
    const response = await http.get("/get-products");
    setProducts(response.data.data);
  };

  const addProducttoCart = (product: any) => {
      const quantityToAdd = quantities[product.id] || 1;

      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex(item => item.product.id === product.id);

        if (existingIndex !== -1) {
          // Product already in cart, update quantity
          const updatedCart = [...prevCart];
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: updatedCart[existingIndex].quantity + quantityToAdd
          };
          return updatedCart;
        } else {
          // New product
          return [...prevCart, { product, quantity: quantityToAdd }];
        }
      });
    };

  const handleSetHdr = (key: string, value: any) => {
    const newHdr = { ...hdr, [key]: value };
    setHdr(newHdr);
    setTransaction((prev) => ({
      ...prev,
      hdr: newHdr,
    }));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.pprice * item.quantity,
    0
  );

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const newHdr = { ...hdr, transactiontotal: totalAmount.toFixed(2) };
    setHdr(newHdr);
    setTransaction({
      hdr: newHdr,
      dtl: cart,
    });
  }, [cart]);

  const handleCheckout = async () => {
    console.log("Transaction:", transaction);
    try {
      const response = await http.post("/save-transaction", {dataVariable:transaction});
      if (response.status == 200) {
         alert("Transaction successful!");
        setCart([]);
        setQuantities({});
      }
    } catch (error) {
      alert("Checkout failed.");
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content min-h-screen flex flex-col bg-white-200">
        <div className="container-fluid flex flex-col flex-grow">
          <Breadcrumb
            title="Bakery Inventory Dashboard"
            links={[{ text: "Dashboard", link: "/dashboard" }]}
            active="Inventory"
          />
          <div className="p-6 w-full mx-auto bg-white shadow-lg rounded-lg relative mt-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Bakery POS System</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col items-center bg-white p-4 rounded-lg shadow h-full">
                  <div className="w-full h-48 flex items-center justify-center mb-2 overflow-hidden rounded">
                    <img
                      src={product.picturepath}
                      alt={product.pname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-semibold text-lg mb-1">{product.pname}</h2>
                  <p className="mb-2 text-blue-700 font-bold">₱{product.pprice}</p>
                  <input
                    type="number"
                    min={1}
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      setQuantities({ ...quantities, [product.id]: parseInt(e.target.value) })
                    }
                    className="w-16 mb-2 p-1 border rounded text-center"
                  />
                  <button
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-full font-medium"
                    onClick={() => addProducttoCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold mb-4">Cart</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                <>
                  <ul className="mb-4">
                    {cart.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-100 my-2 rounded"
                      >
                        <div className="flex items-center">
                          <img
                            src={item.product.picturepath}
                            alt={item.product.pname}
                            className="w-10 h-10 object-cover mr-2 rounded"
                          />
                          <span>
                            {item.product.pname} - ₱{item.product.pprice} × {item.quantity}
                          </span>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setCart(cart.filter((_, i) => i !== index))}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-4 items-center mb-2">
                    <label className="font-medium">Payment Method:</label>
                    <select
                      value={hdr.transactiontype}
                      onChange={(e) => handleSetHdr("transactiontype", e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="CASH">Cash</option>
                      <option value="GCASH">Gcash</option>
                    </select>
                  </div>
                  <h2 className="text-lg font-bold mb-2">Total: ₱{totalAmount.toFixed(2)}</h2>
                  <button
                    className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full font-semibold"
                    disabled={cart.length === 0}
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
