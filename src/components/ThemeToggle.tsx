import { LucideMoon, LucideSun } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

export default function ThemeToggle() {
  const { theme, setTheme } = useAuth();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className=" w-10 h-10 text-center bg-gray-100 dark:bg-black/50 cursor-pointer rounded-full text-blue-600 dark:text-yellow-600 fixed top-5 right-10"
    >
      {theme === "light" ? (
        <LucideMoon className="self-center m-auto w-full h-full p-2" />
      ) : (
        <LucideSun className="self-center m-auto w-full h-full p-2" />
      )}
    </button>
  );
}
