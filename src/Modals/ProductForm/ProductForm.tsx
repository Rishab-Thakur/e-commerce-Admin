import React, { useState, useEffect } from "react";
import styles from "./ProductForm.module.css";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../Redux/Store";
import {
  createProduct,
  updateProduct,
} from "../../Redux/Slices/ProductSlice";
import type {
  Variant,
  ProductData,
} from "../../Interface/ProductServiceInterfaces";
import { toast } from "react-toastify";

interface ProductFormProps {
  mode: "add" | "edit" | "view";
  product?: ProductData | null;
  onClose: () => void;
}

const defaultVariant: Variant = { size: "", color: "", stock: 0 };

const ProductForm: React.FC<ProductFormProps> = ({ mode, product, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isView = mode === "view";

  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    gender: "",
    brand: "",
    imageUrl: "",
    description: "",
    price: 0,
    variants: [defaultVariant],
  });

  const [imageType, setImageType] = useState<"file" | "url">("file");

  useEffect(() => {
    if (product && (mode === "edit" || mode === "view")) {
      setForm({
        name: product?.name,
        category: product?.category || "",
        subCategory: product?.subCategory || "",
        gender: product?.gender ?? "",
        brand: product?.brand ?? "",
        imageUrl: product?.imageUrl ?? "",
        description: product?.description ?? "",
        price: product?.price,
        variants: product?.variants || [defaultVariant],
      });
    }
  }, [product, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number
  ) => {
    const updatedVariants = [...form.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === "stock" ? parseInt(value as string) : value,
    };
    setForm((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, defaultVariant],
    }));
  };

  const removeVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isView) return;

    const payload = {
      ...form,
      totalStock: form.variants.reduce((sum, v) => sum + (v.stock || 0), 0),
    };

    try {
      if (mode === "add") {
        await dispatch(createProduct(payload)).unwrap();
        toast.success("Product added successfully!");
      } else if (mode === "edit" && product?.id) {
        await dispatch(updateProduct({ id: product.id, ...payload })).unwrap();
        toast.success("Product updated successfully!");
      }
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>
          {mode === "add"
            ? "Add Product"
            : mode === "edit"
              ? "Edit Product"
              : "View Product"}
        </h2>
        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.imageSection}>
            <label className={styles.label}>Product Image</label>
            {mode === "add" &&
              <div className={styles.imageInputGroup}>
                <select
                  value={imageType}
                  onChange={(e) => {
                    setImageType(e.target.value as "file" | "url");
                    setForm((prev) => ({ ...prev, imageUrl: "" }));
                  }}
                  className={styles.selectInput}
                  disabled={isView}
                >
                  <option value="file">Upload Image</option>
                  <option value="url">Upload Image URL</option>
                </select>

                {imageType === "file" ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setForm((prev) => ({
                            ...prev,
                            imageUrl: reader.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    disabled={isView}
                    className={styles.fileInput}
                  />
                ) : (
                  <input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={form.imageUrl}
                    onChange={handleChange}
                    disabled={isView}
                    className={styles.urlInput}
                    required
                  />
                )}
              </div>
            }

            {form.imageUrl && (
              <div className={styles.imagePreview}>
                <img src={form.imageUrl} alt="Product" />
                {!isView && (
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => {
                      setForm((prev) => ({ ...prev, imageUrl: "" }));
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>


          <div className={styles.grid}>
            <div>
              <label className={styles.label}>Product Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={isView}
                required
              />
            </div>
            <div>
              <label className={styles.label}>Brand</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                disabled={isView}
                required
              />
            </div>
            <div>
              <label className={styles.label}>Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={isView}
              />
            </div>
            <div>
              <label className={styles.label}>Sub Category</label>
              <input
                type="text"
                name="subCategory"
                value={form.subCategory}
                onChange={handleChange}
                disabled={isView}
              />
            </div>
            <div>
              <label className={styles.label}>Gender</label>
              <input
                type="text"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={isView}
              />
            </div>
            <div>
              <label className={styles.label}>Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                disabled={isView}
                required
              />
            </div>
          </div>

          <div>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isView}
              required
            ></textarea>
          </div>

          <div className={styles.variantSection}>
            <label className={styles.label}>Variants</label>
            {form.variants.map((variant, index) => (
              <div className={styles.variantRow} key={index}>
                <input
                  type="text"
                  placeholder="Size"
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(index, "size", e.target.value)
                  }
                  disabled={isView}
                  required
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(index, "color", e.target.value)
                  }
                  disabled={isView}
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                  disabled={isView}
                  required
                />
                {!isView && form.variants.length > 1 && (
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeVariant(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {!isView && (
              <button
                type="button"
                className={styles.addVariantBtn}
                onClick={addVariant}
              >
                + Add Variant
              </button>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            {!isView && (
              <button type="submit" className={styles.submitBtn}>
                {mode === "add" ? "Add" : "Update"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
