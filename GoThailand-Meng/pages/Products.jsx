import { useNavigate } from "react-router-dom";
import { products } from "../moc-data/products";

export default function Products() {
  
  //เรียก Navigate มาใช้
    const navigate = useNavigate();

    //เป็นเส้นทางที่ตอน router เราสร้างไว้เป็น dynamic ไว้
  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb=4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-100 shadow-2xl rounded-2xl p-4 mt-2"
          >
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price.toFixed(2)}</p>
            <div>
              <button
                onClick={() => handleViewDetails(product.id)}
                className="text-white bg-teal-500 px-4 py-2 rounded-md hover:bg-teal-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}