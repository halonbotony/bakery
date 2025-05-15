import Breadcrumb from "../components/breadcrums";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaBreadSlice, FaPlus, FaMinus, FaTrash, FaSearch } from 'react-icons/fa';

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
 const [inventory, setInventory] = useState<InventoryItem[]>([
  { name: 'Pandesal', quantity: 12, category: 'bread', image: productImages['Pandesal'] },
  { name: 'Star Bread', quantity: 7, category: 'bread', image: productImages['Star Bread'] },
  { name: 'Pan De Coco', quantity: 5, category: 'bread', image: productImages['Pan De Coco'] },
  { name: 'Donut', quantity: 8, category: 'bread', image: productImages['Donut'] },
  { name: 'Shakoy', quantity: 10, category: 'bread', image: productImages['Shakoy'] },
  { name: 'Monay', quantity: 2, category: 'bread', image: productImages['Monay'] },
  { name: 'Hopia', quantity: 3, category: 'bread', image: productImages['Hopia'] },
  { name: 'Spanish Bread', quantity: 3, category: 'bread', image: productImages['Spanish Bread'] },
  { name: 'Ensaymada', quantity: 5, category: 'bread', image: productImages['Ensaymada'] },
  { name: 'Cupcake', quantity: 7, category: 'bread', image: productImages['Cupcake'] },
  { name: 'Crinkles', quantity: 1, category: 'bread', image: productImages['Crinkles'] },
  { name: 'Mamon', quantity: 2, category: 'bread', image: productImages['Mamon'] },

  { name: 'Red Velvet', quantity: 4, category: 'cake', image: productImages['Red Velvet'] },
  { name: 'Raspberry Cake', quantity: 1, category: 'cake', image: productImages['Raspberry Cake'] },
  { name: 'Oreo Cake', quantity: 3, category: 'cake', image: productImages['Oreo Cake'] },
  { name: 'White Forest Cake', quantity: 2, category: 'cake', image: productImages['White Forest Cake'] },
  { name: 'Green Velvet Cake', quantity: 2, category: 'cake', image: productImages['Green Velvet Cake'] },
  { name: 'Cookies and Cream Cake', quantity: 5, category: 'cake', image: productImages['Cookies and Cream Cake'] },
  { name: 'Ube Cake', quantity: 3, category: 'cake', image: productImages['Ube Cake'] },
  { name: 'Black Forest Cake', quantity: 3, category: 'cake', image: productImages['Black Forest Cake'] },
  { name: 'Chocolate Mousse Cake', quantity: 1, category: 'cake', image: productImages['Chocolate Mousse Cake'] },
  { name: 'Purple Yam', quantity: 6, category: 'cake', image: productImages['Purple Yam'] },
]);


  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<'bread' | 'cake' | 'other'>('bread');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'bread' | 'cake' | 'other'>('all');
  const navigate = useNavigate();

  const addItem = () => {
    if (!itemName.trim() || quantity <= 0) return;
    
    setInventory((prev) => {
      const existing = prev.find((item) => item.name.toLowerCase() === itemName.toLowerCase());
      return existing
        ? prev.map((item) =>
            item.name.toLowerCase() === itemName.toLowerCase()
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prev, { 
            name: itemName, 
            quantity, 
            category,
            image: productImages[itemName] || productImages['default']
          }];
    });
    setItemName('');
    setQuantity(1);
  };

  const updateItem = (name: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setInventory((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const deleteItem = (name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setInventory((prev) => prev.filter((item) => item.name !== name));
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const filteredInventory = inventory
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (activeCategory === 'all' || item.category === activeCategory)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'bread': return 'bg-amber-100 text-amber-800';
      case 'cake': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
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
                        links={[{ text: "Dashboard", link: "/customers" }]}
                        active="Inventory"
                    />
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-yellow-50 to-pink-50">
      <div className="relative max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-pink-400 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-flex items-center text-2xl md:text-3xl font-bold gap-3">
                <FaBreadSlice className="text-white" />
                <span>Bakery Inventory</span>
              </div>
              <p className="text-sm md:text-base opacity-90 mt-1">
                Manage your bakery stock with ease
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-yellow-200 text-xl p-1"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${activeCategory === 'all' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveCategory('bread')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${activeCategory === 'bread' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'}`}
                >
                  Breads
                </button>
                <button
                  onClick={() => setActiveCategory('cake')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${activeCategory === 'cake' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-800'}`}
                >
                  Cakes
                </button>
                <button
                  onClick={() => setActiveCategory('other')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${activeCategory === 'other' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Others
                </button>
              </div>
            </div>

            {/* Add Item Form */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-3">Add New Item</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-24 focus:ring-2 focus:ring-yellow-400"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-32 focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="bread">Bread</option>
                  <option value="cake">Cake</option>
                  <option value="other">Other</option>
                </select>
                <button
                  onClick={addItem}
                  className="bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200 shadow-md hover:shadow-lg"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Inventory List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Current Inventory
                {activeCategory !== 'all' && ` (${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)})`}
              </h2>
              <div className="text-sm text-gray-500">
                {filteredInventory.length} {filteredInventory.length === 1 ? 'item' : 'items'}
              </div>
            </div>

            {filteredInventory.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No items found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchTerm ? 'Try a different search term' : 'Add items to get started'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col"
                  >
                    <div className="relative h-40 w-full mb-3 overflow-hidden rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="absolute h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = productImages['default'];
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Quantity:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                          item.quantity < 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.quantity} {item.quantity === 1 ? 'unit' : 'units'}
                        </span>
                      </div>
                      {item.quantity < 3 && (
                        <span className="text-xs text-red-500 font-medium">Low Stock!</span>
                      )}
                    </div>
                    
                    <div className="mt-auto flex items-center gap-2">
                      <button
                        onClick={() => updateItem(item.name, item.quantity - 1)}
                        disabled={item.quantity <= 0}
                        className="flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-800 p-2 rounded-md disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus size={12} />
                      </button>
                      
                      <button
                        onClick={() => updateItem(item.name, item.quantity + 1)}
                        className="flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-md"
                        aria-label="Increase quantity"
                      >
                        <FaPlus size={12} />
                      </button>
                      
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.name, Math.max(0, Number(e.target.value)))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center text-sm"
                        min="0"
                      />
                      
                      <button
                        onClick={() => deleteItem(item.name)}
                        className="ml-auto flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-md"
                        aria-label="Delete item"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </>
  );
};

export default ManageInventory;