"use client"
import React from 'react'
import Header from "./Header"
import { useState, useEffect } from 'react'
import LoadingAnimation from './LoadingAnimation';
import { useUser } from '@clerk/nextjs';

function Dashboard() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  const userId = user?.id;
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dropdown, setDropdown] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/dashboard/api/product');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const buttonAction = async (action, name, initialQuantity) => {
    let index = products.findIndex((item) => item.modelName === name);
    let newProducts = JSON.parse(JSON.stringify(products));
    
    if (action === "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else if (action === "minus" && initialQuantity > 0) {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
  
    setProducts(newProducts);
  
    let indexdrop = dropdown.findIndex((item) => item.modelName === name);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    
    if (action === "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1;
    } else if (action === "minus" && initialQuantity > 0) {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1;
    }
  
    setDropdown(newDropdown);
  
    const response = await fetch('/dashboard/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, name, initialQuantity })
    });
    let r = await response.json();
  };
  
  const addProduct = async (e) => {
    e.preventDefault();
    const requiredFields = ['brandName', 'productName', 'modelName', 'date', 'serialNumber', 'quantity', 'landingPrice', 'sellingPrice'];
    const isValid = requiredFields.every(field => productForm[field]);
    
    if (!isValid) {
      setAlert("All fields are required!!!!");
      setTimeout(() => {
        setAlert('');
      }, 5000);
      return;
    }

    const productData = {
      ...productForm,
      userId, 
    };
    try {
      const response = await fetch('/dashboard/api/product', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, body: JSON.stringify(productData) 
      });
      if (response.ok) {
        setAlert("Your Product has been added!!!!")
        setTimeout(() => {
          setAlert('');
        }, 5000);
        setProductForm({})
      } else {
        console.error('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    const response = await fetch('/dashboard/api/product')
    let data = await response.json()
    setProducts(data.products)
    e.preventDefault();
  }

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      setDropdown([]);
      try {
        const response = await fetch('/dashboard/api/search?query=' + value);
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          data = { products: [] };
        }
  
        setDropdown(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setDropdown([]);
      } finally {
        setLoading(false);
      }
    } else {
      setDropdown([]);
    }
  };
  
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedProducts = [...products].sort((a, b) => {
      const valueA = a[key] ? a[key].toString().toUpperCase() : ''; // Ensure valueA is a string
      const valueB = b[key] ? b[key].toString().toUpperCase() : ''; // Ensure valueB is a string

      let comparison = 0;
      if (valueA > valueB) {
          comparison = 1;
      } else if (valueA < valueB) {
          comparison = -1;
      }

      if (direction === 'descending') {
          comparison *= -1;
      }
      return comparison;
    });

    setProducts(sortedProducts);
  };

  

  return (
    <div className="bg-gradient-to-t from-blue-100 to-gray-100">

      <Header className="shadow-2xl"/>

      <div className='py-7 mx-2 md:mx-14 lg:mx-28 text-[#094e6e]'>

        {/* Component to add any item */}
        <div className="container mx-auto my-6 drop-shadow-lg">
          <h1 className="text-4xl font-bold mb-3">Add a Product</h1>
          <form className='flex-row'>

            <div className="flex-row sm:flex md:flex lg:flex xl:flex gap-5">
              <div className="mb-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                <label htmlFor="brandName" className="block mb-2">Brand Name</label>
                <input value={productForm?.brandName || ""} name='brandName' type="text" id="brandName" onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 outline-none"/>
              </div>

              <div className="mb-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                <label htmlFor="productName" className="block mb-2">Product Name</label>
                <input value={productForm?.productName || ""} name='productName' type="text" id="productName" onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 outline-none" />
              </div>
            </div>

            <div className="flex-row sm:flex md:flex lg:flex xl:flex gap-5">
              <div className="mb-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                <label htmlFor="modelName" className="block mb-2">Model Name</label>
                <input value={productForm?.modelName || ""} name='modelName' type="text" id="modelName" onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 outline-none" />
              </div>

              <div className="mb-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                <label htmlFor="date" className="block mb-2">Date</label>
                <input value={productForm?.date || ""} name='date' type="date" id="date" onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 outline-none" />
              </div>
            </div>

            <div className="flex-row sm:flex md:flex lg:flex xl:flex gap-5">
              <div className="mb-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                <label htmlFor="serialNumber" className="block mb-2">Serial Number</label>
                <input value={productForm?.serialNumber || ""}  name='serialNumber' type="number" id="serialNumber" onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 outline-none" />
              </div>

              <div className="mb-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                <label htmlFor="quantity" className="block mb-2">Quantity</label>
                <input value={productForm?.quantity || ""} name='quantity' type="number" id="quantity" onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 outline-none" />
              </div>
            </div>
            <div className="flex-row sm:flex md:flex lg:flex xl:flex gap-5">
              <div className="mb-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                <label htmlFor="landingPrice" className="block mb-2">Landing Price</label>
                <input value={productForm?.landingPrice || ""} name='landingPrice' type="number" id="landingPrice" onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 outline-none" />
              </div>

              <div className="mb-4 w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2">
                <label htmlFor="sellingPrice" className="block mb-2">Selling price</label>
                <input value={productForm?.sellingPrice || ""} name='sellingPrice' type="number" id="sellingPrice" onChange={handleChange} className="w-full border border-gray-300 px-4 py-2 outline-none" />
              </div>
            </div>
            

            <button onClick={addProduct} type="submit" className="bg-[#094e6e] hover:bg-[#3a6275] text-white px-4 py-2 rounded-lg shadow-md font-semibold">
              Add Product
            </button>
          </form>
          <div className='text-green-800 text-center'>{alert}</div>
        </div>

        {/* Component to Search any item */}
        <div className="container mx-auto my-6 drop-shadow-lg">
          <h1 className="text-4xl font-bold mb-3">Search a Product</h1>
          <div className="flex mb-2">
            <input 
              onChange={onDropdownEdit} 
              type="text" 
              placeholder="Enter a product name" 
              className="flex-1 border border-gray-300 px-4 py-2 outline-none" 
            />
          </div>
          {
            loading && <LoadingAnimation />
          }
          {dropdown.length > 0 && (
            <div className="dropcontainer relative w-full border bg-white rounded-md mt-4">
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Brand Name</th>
                    <th className="px-4 py-2">Product Name</th>
                    <th className="px-4 py-2">Model Name</th>
                    <th className="px-4 py-2">Serial Number</th>
                    <th className="px-4 py-2">Landing Price</th>
                    <th className="px-4 py-2">Selling Price</th>
                    <th className="px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {dropdown.map(item => (
                    <tr key={item.brandName}>
                      <td className="border px-4 py-2">{item.brandName}</td>
                      <td className="border px-4 py-2">{item.productName}</td>
                      <td className="border px-4 py-2">{item.modelName}</td>
                      <td className="border px-4 py-2">{item.serialNumber}</td>
                      <td className="border px-4 py-2">{item.landingPrice}</td>
                      <td className="border px-4 py-2">₹{item.sellingPrice}</td>     
                      <td className="border px-4 py-2 flex justify-around items-center">
                        <button onClick={() => { buttonAction("minus", item.modelName, item.quantity) }} className="subtract inline-block w-[30px] h-[30px] cursor-pointer bg-[#094e6e] text-white font-bold rounded-lg shadow-md "> - </button>
                          <span className="quantity inline-block  min-w-3 mx-3">{item.quantity}</span>
                        <button onClick={() => { buttonAction("plus", item.modelName, item.quantity) }} className="add inline-block w-[30px] h-[30px] cursor-pointer bg-[#094e6e] text-white font-bold rounded-lg shadow-md">  + </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Component to display all inventory */}
        <div className="container mx-auto my-6 drop-shadow-lg">
          <h1 className="text-4xl font-bold mb-3">Inventory</h1>
          {isLoading ? (
            <LoadingAnimation /> // Render loading animation while fetching data
          ) : (
          <table className="table-auto w-full drop-shadow-lg bg-white">
            <thead>
              <tr>
                <SortableHeader
                  label="Brand Name ⬇️"
                  onClick={() => requestSort('brandName')}
                  sortConfig={sortConfig}
                />
                <SortableHeader
                  label="Product Name ⬇️"
                  onClick={() => requestSort('productName')}
                  sortConfig={sortConfig}
                />
                <th className="px-4 py-2">Model Name</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Serial Number</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Landing Price</th>
                <th className="px-4 py-2">Selling Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.slug}>
                  <td className="border px-4 py-2">{product.brandName}</td>
                  <td className="border px-4 py-2">{product.productName}</td>
                  <td className="border px-4 py-2">{product.modelName}</td>
                  <td className="border px-4 py-2">{product.date}</td>
                  <td className="border px-4 py-2">{product.serialNumber}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">₹{product.landingPrice}</td>
                  <td className="border px-4 py-2">₹{product.sellingPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

      </div>
    </div>
  )
}

const SortableHeader = ({ label, onClick, sortConfig }) => {
  const { key, direction } = sortConfig;

  let sortIcon = null;
  if (key === label.replace(' ', '').toLowerCase()) {
    sortIcon = direction === 'ascending' ? '▲' : '▼';
  }

  return (
    <th className="px-4 py-2 cursor-pointer">
      <div className="flex items-center" onClick={onClick}>
        {label} {sortIcon && <span className="ml-1">{sortIcon}</span>}
      </div>
    </th>
  );
};


export default Dashboard
