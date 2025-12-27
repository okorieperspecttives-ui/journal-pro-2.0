import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const { user, loading } = useAuth();
  const navigate = useNavigate(); // replace with router.push if Next.js

  useEffect(() => {
    if (!loading && user) {
      // ✅ If user exists after auth check, redirect to dashboard
      navigate("/dashboard");
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <p>Loading...</p>; // show spinner while checking session
  }

  if (user) {
    // Optional: you could return null here since redirect happens
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setMessage("Login successful ✅");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match ❌");
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setMessage("Signup successful ✅. Check your email for confirmation.");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("login")}
          className={`flex-1 py-2 ${
            activeTab === "login" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={`flex-1 py-2 ${
            activeTab === "signup" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Signup
        </button>
      </div>

      {activeTab === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            Login
          </button>
        </form>
      )}

      {activeTab === "signup" && (
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded"
          >
            Signup
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
