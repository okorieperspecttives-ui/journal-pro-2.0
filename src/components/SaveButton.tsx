import { Save } from "lucide-react";

export default function SaveButton() {
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 flex items-center justify-center"
    >
      <Save className="mr-2" size={20} /> Save Trade
    </button>
  );
}
