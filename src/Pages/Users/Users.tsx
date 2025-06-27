import React, { useEffect, useState, useCallback } from "react";
import styles from "./Users.module.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/Store";
import { fetchUsers, blockUser, unblockUser, searchUsers } from "../../Redux/Slices/UserSlice";
import type { UserData } from "../../Interface/UserServiceInterfaces";
import Loader from "../../Components/Loader/Loader";
import Pagination from "../../Components/Pagination/Pagination";
import { toast } from "react-toastify";
import useDebounce from "../../Hooks/UseDebounce/UseDebounce";
import ActionModal from "../../Modals/ActionModal/ActionModal";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { UsersAPI } from "../../API/UsersAPI";

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, page, totalPages } = useSelector(
    (state: RootState) => state.users,
    shallowEqual
  );

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const loadUsers = useCallback(() => {
    if (debouncedSearch.trim()) {
      dispatch(searchUsers({ query: debouncedSearch.trim(), limit: 10 }));
    } else {
      dispatch(fetchUsers({ page: currentPage }));
    }
  }, [dispatch, debouncedSearch, currentPage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleBlock = useCallback(async (id: string) => {
    await dispatch(blockUser(id));
    toast.success("User blocked");
    loadUsers();
  }, [dispatch, loadUsers]);

  const handleUnblock = useCallback(async (id: string) => {
    await dispatch(unblockUser(id));
    toast.success("User unblocked");
    loadUsers();
  }, [dispatch, loadUsers]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      dispatch(fetchUsers({ page: 1 }));
    }
  }, [dispatch]);

  const exportToCSV = useCallback(async () => {
    try {
      const res = await UsersAPI.download();
      const users = res.data.users;

      if (!Array.isArray(users)) {
        throw new Error("Invalid response format");
      }

      const headers = ["Name", "Email", "Phone", "Status", "Role"];
      const csvRows = users.map((user) =>
        [
          user.name || "",
          user.email || "",
          user.phone || "",
          user.status || "",
          user.role || "N/A"
        ].join(",")
      );

      const csvContent = [headers.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "users.csv";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export CSV. Please try again.");
    }
  }, []);




  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Users</h2>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button onClick={exportToCSV} className={styles.exportButton}>
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader text="Loading Users..." />
        </div>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length ? (
                  users.map((user: UserData) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.role}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${styles[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <ActionModal
                          actions={[
                            user.status === "block"
                              ? {
                                label: "Unblock",
                                icon: <ShieldCheck size={16} />,
                                onClick: () => handleUnblock(user.id),
                              }
                              : {
                                label: "Block",
                                icon: <ShieldOff size={16} />,
                                onClick: () => handleBlock(user.id),
                              },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.error} style={{ textAlign: "center" }}>No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(Users);
