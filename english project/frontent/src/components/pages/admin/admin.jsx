import React, { useState, useEffect } from "react";
import { Card, Button, Table, TextInput, Container, Title, Modal } from "@mantine/core";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState({ username: "", password: "" });
  const [editUser, setEditUser] = useState(null); // Ma'lumotni tahrir qilish uchun
  const [modalOpen, setModalOpen] = useState(false); // Modalni ochish uchun

  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://192.168.1.45:5050/api/auth/get-all")
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching users:", error));
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (adminData.username === "1" && adminData.password === " ") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const handleSaveChanges = () => {
    const updatedUser = {
      ...editUser,
    };

    fetch(`http://192.168.1.45:5050/api/auth/edit/${editUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then(() => {
        setModalOpen(false);
        alert("User updated successfully!");
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  if (!isLoggedIn) {
    return (
      <Container size="sm" className="flex flex-col items-center justify-center h-screen">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2} className="mb-4">Admin Login</Title>
          <TextInput 
            placeholder="Username" 
            className="mb-2"
            value={adminData.username}
            onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
          />
          <TextInput 
            type="password" 
            placeholder="Password" 
            className="mb-4"
            value={adminData.password}
            onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
          />
          <Button onClick={handleLogin} fullWidth>Login</Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="lg" className="p-6">
      <Title order={1} className="mb-4">Admin Dashboard</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              // Ensure the key is unique (by combining user.id and user.email)
              <tr key={`${user.id}-${user.email}`}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>
                  <Button variant="outline" className="mr-2" onClick={() => handleEdit(user)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Edit User">
        <TextInput
          label="Full Name"
          value={editUser?.fullName || ""}
          onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
        />
        <TextInput
          label="Email"
          value={editUser?.email || ""}
          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
        />
        <TextInput
          label="Password"
          type="password"
          value={editUser?.password || ""}
          onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
        />
        <Button onClick={handleSaveChanges} fullWidth>Save Changes</Button>
      </Modal>
    </Container>
  );
};

export default AdminPage;
