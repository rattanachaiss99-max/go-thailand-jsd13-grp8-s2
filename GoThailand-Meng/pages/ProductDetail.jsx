import { products } from "../moc-data/products";
import { useParams } from "react-router-dom";

export default function ProductsDetail() {
  const { productId } = useParams();
  console.log(useParams())

  //การหา product ให้เท่ากับ product ที่มี id นะเนๆ
  const product = products.find((p) => p.id === productId);

  //ในกรณีที่ product ไม่มีของออกมา
  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
    </div>
  );
}