import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "../hooks/useAuth";
import ConfirmDialog from "../components/ConfirmDialog";

import { useNavigate } from "react-router-dom";
import { LucideLoader, LucideLogOut } from "lucide-react";
import MotionWrapper from "../helpers/MotionWrapper";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false); // <-- fix here
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("username, full_name, bio")
        .eq("id", user.id)
        .single();

      if (!error) setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase
      .from("users")
      .update(profile)
      .eq("id", user.id);

    if (error) {
      setMessage("❌ Error updating profile");
    } else {
      setMessage("✅ Profile updated successfully");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading)
    return (
      <MotionWrapper>
        <div className="w-full h-full flex items-center justify-center">
          <LucideLoader className="animate-spin" />
        </div>
      </MotionWrapper>
    );

  // Get first letter of email for avatar
  const avatarLetter = user?.email?.charAt(0).toUpperCase();

  if (!user) {
    return (
      <MotionWrapper>
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm text-center">
            <h1 className="text-xl font-semibold mb-4">Log New Trade</h1>
            <p className="mb-4 text-gray-600">
              You must be logged in to access this page.
            </p>
            <button
              onClick={() => (window.location.href = "/auth")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Go to Auth Page
            </button>
          </div>
        </div>
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper>
      <div className="p-4 relative">
        {/* Logout icon top-right */}
        <button
          onClick={() => setShowConfirm(true)}
          className="absolute top-4 right-4 text-gray-800 hover:text-red-600 p-2 bg-blue-200/50 rounded-full m-2"
          title="Logout"
        >
          <LucideLogOut className="w-6 h-6" />
        </button>

        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-600 text-white text-3xl font-bold">
              {avatarLetter}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {profile?.full_name || "Your Name"}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={profile?.username || ""}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                className="mt-1 w-full rounded-lg bg-gray-50 text-gray-800 p-2 
             focus:outline-none focus:ring-0 border-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={profile?.full_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                className="mt-1 w-full rounded-lg bg-gray-50 text-gray-800 p-2 
             focus:outline-none focus:ring-0 border-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                value={profile?.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={3}
                className="mt-1 w-full rounded-lg bg-gray-50 text-gray-800 p-2 
             focus:outline-none focus:ring-0 border-none shadow-sm "
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </form>

          {message && (
            <p className="text-sm text-center text-gray-600">{message}</p>
          )}

          {showConfirm && (
            <ConfirmDialog
              message="Are you sure you want to log out?"
              onConfirm={handleLogout}
              onCancel={() => setShowConfirm(false)}
            />
          )}
        </div>
      </div>
    </MotionWrapper>
  );
}
