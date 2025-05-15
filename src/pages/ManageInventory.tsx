import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { FaTimes } from 'react-icons/fa'; // Import a close icon from react-icons

interface InventoryItem {
  name: string;
  quantity: number;
}

const ManageInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  const addItem = () => {
    setInventory((prevInventory) => {
      const existingItem = prevInventory.find((item) => item.name === itemName);
      if (existingItem) {
        return prevInventory.map((item) =>
          item.name === itemName ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevInventory, { name: itemName, quantity }];
      }
    });
    setItemName('');
    setQuantity(0);
  };

  const updateItem = (name: string, newQuantity: number) => {
    setInventory((prevInventory) =>
      prevInventory.map((item) =>
        item.name === name ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const deleteItem = (name: string) => {
    setInventory((prevInventory) => prevInventory.filter((item) => item.name !== name));
  };

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto bg-white-200 shadow-lg rounded-lg min-h-screen relative">
      <button onClick={handleClose} className="absolute top-4 left-4 text-2xl  hover:text-red-900">
        <FaTimes />
      </button>
      <h1 className="text-3xl font-bold text-center mb-6">Inventory Management</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="border p-3 rounded flex-1"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-3 rounded w-32"
        />
        <button onClick={addItem} className="bg-blue-500 text-white p-3 rounded">
          Add Item
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Current Inventory</h2>
      {inventory.length === 0 ? (
        <p className="text-gray-700">The inventory is empty.</p>
      ) : (
        <ul className="space-y-3">
          {inventory.map((item) => (
            <li key={item.name} className="flex justify-between items-center p-4 bg-white rounded shadow-md">
              <span className="font-semibold">
                {item.name}: {item.quantity}
              </span>
              <div>
                <button
                  onClick={() => updateItem(item.name, item.quantity + 1)}
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  +
                </button>
                <button
                  onClick={() => updateItem(item.name, item.quantity - 1)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  -
                </button>
                <button
                  onClick={() => deleteItem(item.name)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageInventory;
