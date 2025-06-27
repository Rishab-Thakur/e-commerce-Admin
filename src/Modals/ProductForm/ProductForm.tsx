import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./ProductForm.module.css";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../Redux/Store";
import { MdDeleteForever } from "react-icons/md";
import { createProduct, updateProduct } from "../../Redux/Slices/ProductSlice";
import type {
  Variant,
  ProductData,
  ProductImage,
} from "../../Interface/ProductServiceInterfaces";
import { toast } from "react-toastify";
import { FORM_MODE, type FormModeType } from "../../Constants/Enum";

interface ProductFormProps {
  mode: FormModeType;
  product?: ProductData | null;
  onClose: () => void;
  onSuccess: () => void;
}

const defaultVariant: Variant = { size: "", color: "", stock: 0 };

const ProductForm: React.FC<ProductFormProps> = ({ mode, product, onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isView = mode === FORM_MODE.VIEW;

  const [form, setForm] = useState({
    name: "",
    category: "",
    subCategory: "",
    gender: "",
    brand: "",
    description: "",
    price: 0,
    variants: [defaultVariant],
    images: [] as ProductImage[],
  });

  const [imageType, setImageType] = useState<"file" | "url">("url");
  const [tempImageUrl, setTempImageUrl] = useState("");

  // Load product data if editing or viewing
  useEffect(() => {
    if (product && (mode === FORM_MODE.EDIT || mode === FORM_MODE.VIEW)) {
      setForm({
        name: product.name,
        category: product.category || "",
        subCategory: product.subCategory || "",
        gender: product.gender || "",
        brand: product.brand || "",
        description: product.description || "",
        price: product.price,
        variants: product.variants || [defaultVariant],
        images: product.images || [],
      });
    }
  }, [mode, product]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value) : value,
      }));
    },
    []
  );

  const handleVariantChange = useCallback(
    (index: number, field: keyof Variant, value: string | number) => {
      const updatedVariants = [...form.variants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: field === "stock" ? parseInt(value as string) : value,
      };
      setForm((prev) => ({ ...prev, variants: updatedVariants }));
    },
    [form.variants]
  );

  const addVariant = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, defaultVariant],
    }));
  }, []);

  const removeVariant = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  }, []);

  const addImage = useCallback(() => {
    if (!tempImageUrl) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { url: tempImageUrl, isPrimary: prev.images.length === 0 }],
    }));
    setTempImageUrl("");
  }, [tempImageUrl]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setForm((prev) => ({
            ...prev,
            images: [
              ...prev.images,
              { url: base64, isPrimary: prev.images.length === 0 },
            ],
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const removeImage = useCallback((index: number) => {
    setForm((prev) => {
      const updated = [...prev.images];
      updated.splice(index, 1);
      if (!updated.find((img) => img.isPrimary) && updated[0]) {
        updated[0].isPrimary = true;
      }
      return { ...prev, images: updated };
    });
  }, []);

  const setPrimaryImage = useCallback((index: number) => {
    setForm((prev) => {
      const updated = prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }));
      return { ...prev, images: updated };
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isView) return;

      const payload = {
        ...form,
        totalStock: form.variants.reduce((sum, v) => sum + (v.stock || 0), 0),
      };

      try {
        if (mode === FORM_MODE.ADD) {
          await dispatch(createProduct(payload)).unwrap();
          toast.success("Product added successfully!");
          onSuccess();
        } else if (mode === FORM_MODE.EDIT && product?._id) {
          await dispatch(updateProduct({ id: product._id, ...payload })).unwrap();
          toast.success("Product updated successfully!");
        }
        onClose();
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {

      }
    },
    [dispatch, form, isView, mode, onClose, product?._id]
  );

  const formTitle = useMemo(() => {
    if (mode === FORM_MODE.ADD) return "Add Product";
    if (mode === FORM_MODE.EDIT) return "Edit Product";
    return "View Product";
  }, [mode]);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h2>{formTitle}</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.imageSection}>
            <label className={styles.label}>Product Images</label>
            {mode !== "view" && (
              <>
                <div className={styles.imageInputGroup}>
                  <select
                    value={imageType}
                    onChange={(e) => setImageType(e.target.value as "file" | "url")}
                    className={styles.selectInput}
                    disabled={isView}
                  >
                    <option value="file">Upload File</option>
                    <option value="url">Enter URL</option>
                  </select>

                  {imageType === "file" ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isView}
                      className={styles.fileInput}
                    />
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        disabled={isView}
                        className={styles.urlInput}
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        className={styles.addVariantBtn}
                      >
                        + Add
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            <div className={styles.imagePreviewList}>
              {form.images.map((img, index) => (
                <div className={styles.imagePreview} key={index}>
                  <img src={img.url} alt={`img-${index}`} />
                  <span className={styles.primaryBadge}>
                    {img.isPrimary ? "Primary" : ""}
                  </span>
                  {!isView && (
                    <div className={styles.imageActions}>
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className={styles.makePrimaryBtn}
                        >
                          Make Primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={styles.removeImageBtn}
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

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
                  required={["name", "brand", "price"].includes(field)}
                />
              </div>
            ))}
          </div>

          <div>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isView}
              required
            />
          </div>

          <div className={styles.variantSection}>
            <label className={styles.label}>Variants</label>
            {form.variants.map((variant, index) => (
              <div className={styles.variantRow} key={index}>
                <input
                  type="text"
                  placeholder="Size"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                  disabled={isView}
                  required
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                  disabled={isView}
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                  disabled={isView}
                  required
                />
                {!isView && form.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className={styles.removeBtn}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {!isView && (
              <button type="button" onClick={addVariant} className={styles.addVariantBtn}>
                + Add Variant
              </button>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            {!isView && (
              <button type="submit" className={styles.submitBtn}>
                {mode === FORM_MODE.ADD ? "Add" : "Update"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(ProductForm);
