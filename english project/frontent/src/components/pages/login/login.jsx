import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Redirect qilish uchun

  const handleLogin = async () => {
    setError(""); // Avvalgi errorni tozalash

    try {
      const response = await fetch("http://192.168.1.4:5050/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Server Response:", data); // 👈 Debug uchun log qo‘shildi

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Tokenlarni localStorage'ga saqlash
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userId", data.user?.id || "");

      navigate("/profile"); // Profil sahifasiga o'tish
      window.location.reload(); // Sahifani yangilash

    } catch (err) {
      console.error("Login Error:", err); // 👈 Xatolikni console'ga chiqarish
      setError(err.message);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome back!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button" onClick={() => navigate("/signup")}>
          Sign Up
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {error && <Text color="red">{error}</Text>}

        <TextInput
          label={<Text fw="bold">Email</Text>}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          label={<Text fw="bold">Password</Text>}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt="md"
        />

        <Button fullWidth mt="xl" onClick={handleLogin} disabled={!email || !password}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
