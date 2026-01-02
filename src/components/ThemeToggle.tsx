import { LucideMoon, LucideSun } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

export default function ThemeToggle() {
  const { theme, setTheme } = useAuth();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className=" w-8 h-8 text-center bg-gray-300 cursor-pointer rounded-full text-[--text] fixed top-5 right-10"
    >
      {theme === "light" ? (
        <LucideMoon className="self-center m-auto" />
      ) : (
        <LucideSun className="self-center m-auto" />
      )}
    </button>
  );
}
