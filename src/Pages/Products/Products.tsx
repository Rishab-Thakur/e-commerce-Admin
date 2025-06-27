import React, { useCallback, useEffect, useState, useMemo } from "react";
import styles from "./Products.module.css";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/Store";
import { fetchProducts, deleteProduct } from "../../Redux/Slices/ProductSlice";
import Loader from "../../Components/Loader/Loader";
import Pagination from "../../Components/Pagination/Pagination";
import ProductForm from "../../Modals/ProductForm/ProductForm";
import DeleteConfirmModal from "../../Modals/Confirm/DeleteConfirm";
import type { ProductData } from "../../Interface/ProductServiceInterfaces";
import useDebounce from "../../Hooks/UseDebounce/UseDebounce";
import ActionModal from "../../Modals/ActionModal/ActionModal";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { FormModeType } from "../../Constants/Enum";


const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, total, pageSize } = useSelector(
    (state: RootState) => state.products,
    shallowEqual
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState<FormModeType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);


  const loadProducts = useCallback(() => {
    const isSearching = !!debouncedSearchQuery.trim();
    const params = isSearching
      ? { name: debouncedSearchQuery.trim() }
      : { page: currentPage };

    dispatch(fetchProducts(params));
  }, [dispatch, debouncedSearchQuery, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openModal = useCallback((type: FormModeType, product?: ProductData) => {
    setSelectedProduct(product || null);
    setModalType(type);
  }, []);

  const closeModal = useCallback(() => {
    setModalType(null);
    setSelectedProduct(null);
  }, []);

  const confirmDelete = useCallback((id: string) => {
    setProductIdToDelete(id);
    setShowDeleteModal(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (productIdToDelete) {
      await dispatch(deleteProduct(productIdToDelete));
      setShowDeleteModal(false);
      setProductIdToDelete(null);
      loadProducts();
    }
  }, [dispatch, productIdToDelete, loadProducts]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / (pageSize || 1))),
    [total, pageSize]
  );


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Product Management</h2>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by Product Name, Brand"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button className={styles.addButton} onClick={() => openModal("add")}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <Loader text="Loading Products..." />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : products.length === 0 ? (
        <p className={styles.error}>No products found.</p>
      ) : (
        <>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Variants</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: ProductData) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>₹{product.price}</td>
                  <td style={{ paddingLeft: "2rem" }}>{product.variants.length}</td>
                  <td>{product.totalStock}</td>
                  <td className={styles.actions}>
                    <ActionModal
                      actions={[
                        {
                          label: "View",
                          icon: <Eye size={16} />,
                          onClick: () => openModal("view", product),
                        },
                        {
                          label: "Edit",
                          icon: <Pencil size={16} />,
                          onClick: () => openModal("edit", product),
                        },
                        {
                          label: "Delete",
                          icon: <Trash2 size={16} />,
                          onClick: () => confirmDelete(product._id),
                        },
                      ]}
                    />
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {modalType && (
        <ProductForm
          mode={modalType}
          product={selectedProduct}
          onClose={closeModal}
          onSuccess={() => setCurrentPage(1)}

        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          message="Are you sure you want to delete this product?"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default React.memo(Products);
