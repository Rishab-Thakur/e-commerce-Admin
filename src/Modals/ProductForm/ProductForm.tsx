import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./ProductForm.module.css";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../Redux/Store";
import { createProduct, updateProduct } from "../../Redux/Slices/ProductSlice";
import type { Variant, ProductData } from "../../Interface/ProductServiceInterfaces";
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

  // Preload form when editing or viewing
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

  // Handle input field changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  }, []);

  // Handle variant field changes
  const handleVariantChange = useCallback((index: number, field: keyof Variant, value: string | number) => {
    const updatedVariants = [...form.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === "stock" ? parseInt(value as string) : value,
    };
    setForm((prev) => ({ ...prev, variants: updatedVariants }));
  }, [form.variants]);

  // Add a new variant
  const addVariant = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, defaultVariant],
    }));
  }, []);

  // Remove a variant
  const removeVariant = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  }, []);

  // Handle form submit for add/edit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [dispatch, form, isView, mode, onClose, product?.id]);

  const formTitle = useMemo(() => {
    if (mode === "add") return "Add Product";
    if (mode === "edit") return "Edit Product";
    return "View Product";
  }, [mode]);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>{formTitle}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div className={styles.imageSection}>
            <label className={styles.label}>Product Image</label>
            {mode === "add" && (
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
            )}

            {form.imageUrl && (
              <div className={styles.imagePreview}>
                <img src={form.imageUrl} alt="Product" />
                {!isView && (
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => setForm((prev) => ({ ...prev, imageUrl: "" }))}
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Basic Info Fields */}
          <div className={styles.grid}>
            {["name", "brand", "category", "subCategory", "gender", "price"].map((field) => (
              <div key={field}>
                <label className={styles.label}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "price" ? "number" : "text"}
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  disabled={isView}
                  required={field === "name" || field === "brand" || field === "price"}
                />
              </div>
            ))}
          </div>

          {/* Description */}
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

          {/* Variants */}
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

          {/* Form Actions */}
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

export default React.memo(ProductForm);
