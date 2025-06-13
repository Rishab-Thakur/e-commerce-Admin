import React, { useEffect, useState } from "react";
import type { Product } from "../../Interface/Product";
import styles from "./ProductForm.module.css";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../Redux/Store";
import { addProduct, updateProduct } from "../../Redux/Slices/ProductSlice";
import Loader from "../../Components/Loader/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductFormProps {
  existingProduct: Product | null;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ existingProduct, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    category: "",
    subCategory: "",
    brand: "",
    imageUrl: "",
    description: "",
    price: 0,
    totalStock: 0,
    variants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData(existingProduct);
    }
  }, [existingProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "totalStock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (existingProduct) {
        const updatedProduct = {
          ...formData,
          updatedAt: new Date(),
        };
        await dispatch(updateProduct(updatedProduct)).unwrap();
        toast.success("Product updated successfully!");
      } else {
        const { id, createdAt, updatedAt, ...productData } = formData;
        await dispatch(addProduct(productData as Omit<Product, "id">)).unwrap();
        toast.success("Product added successfully!");
      }
      onClose();
    } catch (err) {
      toast.error("Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formOverlay}>
      {isSubmitting && <Loader />}
      <form className={styles.productForm} onSubmit={handleSubmit}>
        <h2>{existingProduct ? "Edit Product" : "Add Product"}</h2>

        <input type="text" name="name" value={formData.name} placeholder="Product Name" onChange={handleChange} required />
        <input type="text" name="brand" value={formData.brand} placeholder="Brand" onChange={handleChange} required />
        <input type="text" name="category" value={formData.category} placeholder="Category" onChange={handleChange} />
        <input type="text" name="subCategory" value={formData.subCategory} placeholder="Subcategory" onChange={handleChange} />
        <input type="text" name="imageUrl" value={formData.imageUrl} placeholder="Image URL" onChange={handleChange} />
        <textarea name="description" value={formData.description} placeholder="Product Description" onChange={handleChange} />
        <input type="number" name="price" value={formData.price} placeholder="Price" onChange={handleChange} />
        <input type="number" name="totalStock" value={formData.totalStock} placeholder="Stock" onChange={handleChange} />

        <div className={styles.formActions}>
          <button type="submit" disabled={isSubmitting}>
            {existingProduct ? "Update" : "Add"}
          </button>
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
