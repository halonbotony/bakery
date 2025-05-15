import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const products: Product[] = [
  { id: 1, name: "Pandesal", price: 5, image: "https://assets.tastemadecdn.net/images/2500b0/88b2df481e91c5531a6e/6797b8.jpg" },
  { id: 2, name: "Star Bread", price: 10, image: "https://i.ytimg.com/vi/6GPs4GOb-yw/maxresdefault.jpg" },
  { id: 3, name: "Pan De Coco", price: 15, image: "https://th.bing.com/th/id/R.408cfc427e78075621c4b2dad3546103?rik=sdTrrdpWiCqfvQ&riu=http%3a%2f%2f3.bp.blogspot.com%2f-2Mi7p_neGio%2fUYM7KZaPePI%2fAAAAAAAAAm4%2f3pRP-hnIOzQ%2fs1600%2fpan%2b006_edited-1.jpg&ehk=GPXkGtXjg3k5tvgucPHU2c6OK4ztFr4Z1xz6klx4ttI%3d&risl=&pid=ImgRaw&r=0" },
  { id: 4, name: "Donut", price: 10, image: "https://i.pinimg.com/736x/73/b7/a7/73b7a7b828d8be35bc0ba1acaaf7dfb7.jpg" },
  { id: 5, name: "Shakoy", price: 5, image: "https://i.ytimg.com/vi/OO_DOe-dUr8/maxresdefault.jpg" },
  { id: 6, name: "Monay", price: 10, image: "https://www.discoverthephilippines.com/wp-content/uploads/2021/08/monay.jpg" },
  { id: 7, name: "Hopia", price: 5, image: "https://th.bing.com/th/id/R.c474670b8caaa71d49131afa4a7ac876?rik=M0XAoqu%2bBa5edw&riu=http%3a%2f%2f2.bp.blogspot.com%2f_iw3Vvd1jqmA%2fRa8x2uhG2oI%2fAAAAAAAAAKQ%2f78HwIGR1R8M%2fs320%2fhopia.JPG&ehk=VEyiwbj3neGLpNwPLEAa%2fbAIabOIX5CHCHmkMIjlTYQ%3d&risl=&pid=ImgRaw&r=0" },
  { id: 8, name: "Spanish Bread", price: 15, image: "https://i.ytimg.com/vi/6adQgWA5GTw/maxresdefault.jpg" },
  { id: 9, name: "Ensaymada", price: 10, image: "https://i.ytimg.com/vi/98m0eM0_y1w/maxresdefault.jpg" },
  { id: 10, name: "Cupcake", price: 15, image: "https://i0.wp.com/ayellowbowl.com/wp-content/uploads/2018/03/P1100463.jpg?fit=1024%2C683&ssl=1" },
  { id: 11, name: "Crinkles", price: 5, image: "https://th.bing.com/th/id/R.013b5f8175e70500fcf40119e1131ded?rik=Gw7E61Pt3T3lNQ&riu=http%3a%2f%2fimages.summitmedia-digital.com%2fspotph%2fimages%2f2020%2f01%2f16%2fk-640-1579169717.jpg&ehk=aL3HlH%2f%2f5y3Q4XObA3ugsGKLCvi8vtDMmfCTXicXXlg%3d&risl=&pid=ImgRaw&r=0" },
  { id: 12, name: "Mamon", price: 15, image: "https://images.sbs.com.au/dims4/default/b8055ec/2147483647/strip/true/crop/3484x1960+126+0/resize/1280x720!/quality/90/?url=http:%2F%2Fsbs-au-brightspot.s3.amazonaws.com%2Fdrupal%2Fyourlanguage%2Fpublic%2Fthis.jpg&imwidth=1280" },



  { id: 1, name: "Red Velvet", price: 350, image: "https://www.thespruceeats.com/thmb/NQlKcmgH6A34snRB1CjFIGmRopc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/homemade-red-velvet-cake-with-cooked-frosting-3053390-hero-01-a17ad925fbea47fa8585f6cd39a0167e.jpg"},
  { id: 2, name: "Raspberry Cake", price: 500, image: "https://www.mycakeschool.com/images/2023/04/Raspberry-Cake-Mix-Recipe-featured-image-.jpg"},
  { id: 3, name: "Oreo Cake", price: 450, image: "https://th.bing.com/th/id/OIP.tHEWOdNtR68MvJS2u-bd1QHaE8?cb=iwp2&rs=1&pid=ImgDetMain"},
  { id: 4, name: "White Forest Cake", price: 500, image: "https://cafecakeguru.com/wp-content/uploads/2021/06/White-Forest-Cake.jpg"},
  { id: 5, name: "Green Velvet Cake", price: 550, image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2014/1/29/1/FN_St-Patricks-Day-Green-Velvet-Layer-Cake_s4x3.jpg.rend.hgtvcom.826.620.suffix/1391199935993.jpeg"},
  { id: 6, name: "Cookies and Cream Cake", price: 450, image: "https://alldayidreamaboutfood.com/wp-content/uploads/2019/10/Keto-Cookies-and-Cream-Cake-2.jpg"},
  { id: 7, name: "Ube Cake", price: 500, image: "https://th.bing.com/th/id/R.9ab7dd18e6b0c18326941a71b8f912ec?rik=iEkgNLSZhDUV1A&riu=http%3a%2f%2fflavorsoflife.com.ph%2fwp-content%2fuploads%2f2020%2f01%2fimage2-resized.jpg&ehk=bzqGPXcFGrvcj8evI3ZXaFBQ3Hc3DtQG7UIB3eDNX14%3d&risl=&pid=ImgRaw&r=0"},
  { id: 8, name: "Black Forest  Cake", price: 550, image: "https://static01.nyt.com/images/2020/01/15/dining/ss-black-forest-cake/merlin_165684495_6689b1a0-42b5-4228-b871-37bb983d797e-superJumbo.jpg"},
  { id: 9, name: "Chocolate  Mousse  Cake ", price: 650, image: "https://cafecakeguru.com/wp-content/uploads/2021/06/Chocolate-Cheese-Cake.jpg"},
  { id: 10, name: "Purple Yam", price: 600, image: "https://th.bing.com/th/id/OIP.lVlQkhmAhBRw8n4eyUolRwAAAA?cb=iwp2&rs=1&pid=ImgDetMain"},
  

];

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    // Reset quantity after adding to cart
    setQuantities(prev => ({...prev, [product.id]: 1}));
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter(item => item.product.id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleClose = () => {
    window.history.back();
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, newQuantity)
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg relative">
      <button
        className="absolute top-1 right-1 text-gray-500 text-3xl font-bold hover:text-gray-700"
        onClick={handleClose}
      >
        &times;
      </button>
      <h1 className="text-2xl font-bold mb-4">Bakery POS System</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {products.map((product) => (
          <div key={product.id} className="text-center bg-white p-4 rounded-lg shadow">
            <div className="h-48 mb-2 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" />
            </div>
            <div className="mb-2">
              <input
                type="number"
                min="1"
                value={quantities[product.id] || 1}
                onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                className="w-16 p-1 border rounded text-center mb-2"
              />
            </div>
            <button
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-full"
              onClick={() => addToCart(product)}
            >
              {product.name} - ₱{product.price}
            </button>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold">Cart</h2>
      <ul className="mb-4">
        {cart.map((item, index) => (
          <li key={index} className="flex justify-between items-center p-2 bg-gray-100 my-2 rounded">
            <div className="flex items-center">
              <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover mr-2 rounded" />
              <span>
                {item.product.name} - ₱{item.product.price} × {item.quantity}
              </span>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => removeFromCart(item.product.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-bold">Total: ₱{total}</h2>
      <button
        className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full"
        disabled={cart.length === 0}
        onClick={() => alert(`Total: ₱${total}`)}
      >
        Checkout
      </button>
    </div>
  );
}