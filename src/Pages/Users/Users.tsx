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

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, page, totalPages } = useSelector(
    (state: RootState) => state.users
  );

  const [currentPage, setCurrentPage] = useState(page);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
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
  }, [dispatch, currentPage, searchQuery, statusFilter]);

  const handleBlock = async (id: string) => {
    await dispatch(blockUser(id));
    refreshUsers();
  };

  const handleUnblock = async (id: string) => {
    await dispatch(unblockUser(id));
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Users</h2>

      <div className={styles.topControls}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.searchInput}
        />

        <select
          className={styles.statusFilter}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="block">Blocked</option>
        </select>

        <button onClick={exportToCSV} className={styles.export}>
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader text="Loading Users..." />
        </div>
      ) : (
        <>
          {error && <p className={styles.error}>{error}</p>}

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
                  <td>{user.status}</td>
                  <td>
                    {user.status === "active" || user.status === "inactive" ? (
                      <button
                        onClick={() => handleBlock(user.id)}
                        className={styles.block}
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnblock(user.id)}
                        className={styles.unblock}
                      >
                        Unblock
                      </button>
                    )}
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
    </div>
  );
};

export default Users;
