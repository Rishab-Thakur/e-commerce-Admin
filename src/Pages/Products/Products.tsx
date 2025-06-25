import React, { useCallback, useEffect, useState, useMemo } from "react";
import styles from "./Products.module.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/Store";
import {
  fetchProducts,
  deleteProduct,
} from "../../Redux/Slices/ProductSlice";
import Loader from "../../Components/Loader/Loader";
import Pagination from "../../Components/Pagination/Pagination";
import ProductForm from "../../Modals/ProductForm/ProductForm";
import DeleteConfirmModal from "../../Modals/Confirm/DeleteConfirm";
import type { ProductData } from "../../Interface/ProductServiceInterfaces";

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, total, page, pageSize } = useSelector(
    (state: RootState) => state.products, shallowEqual
  );

  const [currentPage, setCurrentPage] = useState<number>(page || 1);
  const [modalType, setModalType] = useState<"add" | "edit" | "view" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage }));
  }, [dispatch, currentPage]);

  const openModal = useCallback((type: "add" | "edit" | "view", product?: ProductData) => {
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

  const refreshProducts = useCallback(() => {
    if (searchQuery) {
      dispatch(fetchProducts({ name: searchQuery }));
    } else {
      dispatch(fetchProducts({ page: currentPage }));
    }
  }, [dispatch, searchQuery, currentPage]);

  const handleDelete = useCallback(async () => {
    if (productIdToDelete) {
      await dispatch(deleteProduct(productIdToDelete));
      setShowDeleteModal(false);
      setProductIdToDelete(null);
      refreshProducts();
    }
  }, [dispatch, refreshProducts, productIdToDelete]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);



  const handleSearchClick = useCallback(() => {
    setCurrentPage(1);
    refreshProducts();
  }, [refreshProducts]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      dispatch(fetchProducts({ page: 1 }));
    }
  }, []);

  const totalPages = useMemo(() => Math.ceil(total / (pageSize || 1)), [total, pageSize]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Product Management</h2>
        <button className={styles.addButton} onClick={() => openModal("add")}>
          + Add Product
        </button>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by Product Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button onClick={handleSearchClick} className={styles.searchButton}>
          Search
        </button>
      </div>

      {loading ? (
        <Loader text="Loading Products..." />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product: ProductData) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>₹{product.price}</td>
                  <td>{product.totalStock}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => openModal("view", product)}
                    >
                      View
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => openModal("edit", product)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => confirmDelete(product._id)}
                    >
                      Delete
                    </button>
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
