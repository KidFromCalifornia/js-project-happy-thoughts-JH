import styled from "styled-components";
import { useState } from "react";
import { PinkButton } from "../styles/Messagestyles";
import { BoxStyle } from "../styles/Messagestyles";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FormContainer = styled(BoxStyle)`
  max-width: 300px;
  width: 100%;
`;

const PopDownContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: white;
  border: 2px solid #000000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  z-index: 1000;
  transition: top 0.3s;
  color: black;
  gap: 1rem;
  max-width: 400px;
`;

const API_URL =
  import.meta.env.VITE_API_URL || "https://js-project-api-k17p.onrender.com";

const LoginForm = ({ onClose, setIsLoggedIn, setCurrentUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedEmail = email?.trim();

    try {
      const endpoint = isSignup ? "/register" : "/login";
      const body = isSignup
        ? {
            username: trimmedUsername,
            password: trimmedPassword,
            email: trimmedEmail,
          }
        : { username: trimmedUsername, password: trimmedPassword };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem("userToken", data.accessToken);
        localStorage.setItem("username", trimmedUsername);
        setIsLoggedIn(true);
        setCurrentUser({ username: trimmedUsername });
        setError("");
        onClose();
        setLoading(false);
      } else if (!res.ok) {
        throw new Error(isSignup ? "Signup failed" : "Login failed");
      }
    } catch {
      setError(
        isSignup
          ? "Signup failed. Try a different username."
          : "Invalid username or password"
      );
      setLoading(false);
    }
  };

  return (
    <PopDownContainer>
      <button
        type="button"
        aria-label="Close login form"
        onClick={onClose}
        style={{
          float: "right",
          cursor: "pointer",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
        }}
      >
        X
      </button>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <FormContainer onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="email"
              role="textbox"
            />
            <br />
          </>
        )}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          aria-label="username"
          role="textbox"
        />
        <br />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "none",
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="password"
            role="textbox"
          />
          <button
            aria-label="Toggle password visibility"
            role="button"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              marginLeft: "0.2rem",
              cursor: "pointer",
              background: "none",
              border: "none",
              fontSize: "1rem",
              color: "black",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <br />
        <PinkButton type="submit" disabled={loading}>
          {loading
            ? isSignup
              ? "Signing Up..."
              : "Logging In..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </PinkButton>
      </FormContainer>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
        <PinkButton
          aria-label="Toggle between login and signup"
          role="button"
          type="button"
          style={{
            cursor: "pointer",
          }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Login" : "Sign Up"}
        </PinkButton>
      </p>
    </PopDownContainer>
  );
};

export default LoginForm;
