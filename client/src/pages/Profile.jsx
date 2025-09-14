
import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import NotificationModal from "../components/NotificationModal";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [passwords, setPasswords] = useState({ current: "", newPass: "" });
  const [passwordModal, setPasswordModal] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, type: "info", message: "" });

  useEffect(() => {
    api.get("/profile").then((res) => setProfile(res.data));
  }, []);

  const updateProfile = async () => {
    try {
      await api.put("/profile", profile);
      setNotification({
        isOpen: true,
        type: "success",
        message: "Profile updated successfully!",
        autoClose: true
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        type: "error",
        message: error.response?.data?.message || "Failed to update profile"
      });
    }
  };

  const changePassword = async () => {
    try {
      await api.put("/profile/password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      setPasswordModal(false);
      setPasswords({ current: "", newPass: "" });
      setNotification({
        isOpen: true,
        type: "success",
        message: "Password changed successfully!",
        autoClose: true
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        type: "error",
        message: error.response?.data?.message || "Failed to change password"
      });
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#f6f8fa" }}>
      <Navbar />
      <div style={{ maxWidth: 480, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: "2rem 2.5rem" }}>
        <h2 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: "1.5rem", color: "#3b2622ff" }}>Profile</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#4f4f4f" }}>Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 16 }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 500, color: "#4f4f4f" }}>Phone Number</label>
            <input
              value={profile.phoneNumber || ""}
              onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
              style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 16 }}
            />
          </div>
          {/* Add more fields as needed */}
          <button
            onClick={updateProfile}
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "0.7rem 1.5rem",
              fontWeight: 600,
              fontSize: 16,
              marginTop: 8,
              cursor: "pointer",
              boxShadow: "0 1px 4px #0001"
            }}
          >
            Save Profile
          </button>
        </div>

        <div style={{ margin: "2.5rem 0 1.5rem 0", borderTop: "1px solid #eee" }} />

        <h3 style={{ fontWeight: 600, fontSize: "1.2rem", color: "#22223b", marginBottom: 12 }}>Change Password</h3>
        <button
          onClick={() => setPasswordModal(true)}
          style={{
            background: "#646cff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "0.6rem 1.2rem",
            fontWeight: 500,
            fontSize: 15,
            cursor: "pointer",
            marginBottom: 10,
            boxShadow: "0 1px 4px #0001"
          }}
        >
          Change Password
        </button>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModal}
        onClose={() => {
          setPasswordModal(false);
          setPasswords({ current: "", newPass: "" });
        }}
        title="Change Password"
        size="small"
      >
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid #fdfcfcff", fontSize: 16 }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              style={{ width: "100%", padding: "0.7rem", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 16 }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                setPasswordModal(false);
                setPasswords({ current: "", newPass: "" });
              }}
              style={{
                background: "#ebe7e5ff",
                color: "#7979bbff",
                border: "none",
                borderRadius: 6,
                padding: "0.5rem 1.2rem",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              onClick={changePassword}
              disabled={!passwords.current || !passwords.newPass}
              style={{
                background: "#df4f16ff",
                color: "white",
                opacity: (!passwords.current || !passwords.newPass) ? 0.5 : 1,
                border: "none",
                borderRadius: 6,
                padding: "0.5rem 1.2rem",
                fontWeight: 500,
                fontSize: 15,
                cursor: (!passwords.current || !passwords.newPass) ? "not-allowed" : "pointer"
              }}
            >
              Change Password
            </button>
          </div>
        </div>
      </Modal>

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ isOpen: false, type: "info", message: "" })}
        type={notification.type}
        message={notification.message}
        autoClose={notification.autoClose}
      />
    </div>
  );
}
