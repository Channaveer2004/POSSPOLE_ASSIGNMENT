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
    <div>
      <Navbar />
      <h2>Profile</h2>
      <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
      <input value={profile.phoneNumber || ""} onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })} />
      <button onClick={updateProfile}>Save Profile</button>

      <h3>Change Password</h3>
      <button onClick={() => setPasswordModal(true)}>Change Password</button>

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
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
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
              style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button onClick={() => {
              setPasswordModal(false);
              setPasswords({ current: "", newPass: "" });
            }}>
              Cancel
            </button>
            <button 
              onClick={changePassword}
              disabled={!passwords.current || !passwords.newPass}
              style={{ 
                backgroundColor: "#646cff", 
                color: "white",
                opacity: (!passwords.current || !passwords.newPass) ? 0.5 : 1
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
