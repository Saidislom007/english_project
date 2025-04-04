import React, { useEffect, useState } from "react";
import { Avatar, Card, Group, Text, Button, Loader } from "@mantine/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserCardImage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://192.168.1.45:5050/api/auth/get-profile/${storedUserId}`,
          { withCredentials: true }
        );

        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);

          const userSkills = response.data.skills || {};
          setStats([
            { value: userSkills.writing || 0, label: "Writing" },
            { value: userSkills.speaking || 0, label: "Speaking" },
            { value: userSkills.listening || 0, label: "Listening" },
            { value: userSkills.reading || 0, label: "Reading" },
          ]);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("No refresh token found!");
        return;
      }
      
  
      const response = await axios.post(
        "http://192.168.1.45:5050/api/auth/logout",
        { refreshToken }, // So'rovni bodyda yuborish
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Logout successful:", response.data);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
  
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error);
    }
  };
  
  

  if (loading) {
    return (
      <Card withBorder padding="xl" radius="md">
        <Loader size="lg" />
      </Card>
    );
  }

  return (
    <Card withBorder padding="xl" radius="md">
      <Card.Section
        h={140}
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1488590545505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)",
        }}
      />
      <Avatar
        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"
        size={80}
        radius={80}
        mx="auto"
        mt={-30}
      />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {user ? user.fullname : "Loading..."}
      </Text>

      <Group mt="md" justify="center" gap={30}>
        {stats.map((stat) => (
          <div key={stat.label}>
            <Text ta="center" fz="lg" fw={500}>
              {stat.value}
            </Text>
            <Text ta="center" fz="sm" c="dimmed" lh={1}>
              {stat.label}
            </Text>
          </div>
        ))}
      </Group>

      <Button fullWidth mt="md" color="red" onClick={handleLogout}>
        Logout
      </Button>
    </Card>
  );
};

export default UserCardImage;
