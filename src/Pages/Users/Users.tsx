import React, { useEffect, useState } from "react";
import styles from "./Users.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../Redux/Store";
import {
  fetchUsers,
  blockUser,
  unblockUser,
  searchUsers,
} from "../../Redux/Slices/UserSlice";
import type { UserData } from "../../Interface/UserServiceInterfaces";
import Loader from "../../Components/Loader/Loader";
import Pagination from "../../Components/Pagination/Pagination";
import { toast } from "react-toastify";

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, page, totalPages } = useSelector(
    (state: RootState) => state.users
  );

  const [currentPage, setCurrentPage] = useState(page);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handleBlock = async (id: string) => {
    await dispatch(blockUser(id));
    toast.success("User blocked");
    refreshUsers();
  };

  const handleUnblock = async (id: string) => {
    await dispatch(unblockUser(id));
    toast.success("User unblocked");
    refreshUsers();
  };

  const refreshUsers = () => {
    if (searchQuery || statusFilter !== "all") {
      dispatch(
        searchUsers({
          query: searchQuery,
          status: statusFilter === "all" ? undefined : (statusFilter as any),
          limit: 10,
        })
      );
    } else {
      dispatch(fetchUsers({ page: currentPage }));
    }
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    refreshUsers();
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
    setTimeout(() => {
      refreshUsers();
    }, 0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const exportToCSV = () => {
    const csv = users
      .map((user) => `${user.name},${user.email},${user.role},${user.status}`)
      .join("\n");
    const blob = new Blob([`Name,Email,Role,Status\n${csv}`], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Users</h2>
        <button onClick={exportToCSV} className={styles.exportButton}>
          Export CSV
        </button>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select
          className={styles.filter}
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="block">Blocked</option>
        </select>
        <button onClick={handleSearchClick} className={styles.searchButton}>
          Search
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
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: UserData) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[user.status]
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>
                      {user.status === "block" ? (
                        <button
                          className={styles.unblock}
                          onClick={() => handleUnblock(user.id)}
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          className={styles.blocked}
                          onClick={() => handleBlock(user.id)}
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
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

export default Users;
