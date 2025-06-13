import React, { useEffect, useState } from "react";
import styles from "./Products.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/Store";
import {
  fetchProducts,
  deleteProduct,
} from "../../Redux/Slices/ProductSlice";
import type { Product } from "../../Interface/Product";
import ProductForm from "../../Modals/ProductForm/ProductForm";
import Loader from "../../Components/Loader/Loader";

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Products</h2>
      <button className={styles.edit} onClick={handleAdd}>
        Add Product
      </button>

      {loading && <Loader />}
      {error && <p className={styles.error}>{error}</p>}

      {showForm && (
        <ProductForm
          existingProduct={editingProduct}
          onClose={() => setShowForm(false)}
        />
      )}

      {!loading && !error && products.length === 0 && (
        <p className={styles.error}>No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product: Product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={styles.image}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>₹{product.price}</td>
                <td>{product.totalStock}</td>
                <td>
                  <button
                    onClick={() => handleEdit(product)}
                    className={styles.edit}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className={styles.delete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
