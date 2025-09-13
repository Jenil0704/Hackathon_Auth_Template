export default function InputField({ label, type, name, value, onChange }) {
  return (
    <div>
      <label className="block text-gray-700 text-sm mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring focus:ring-blue-300 focus:outline-none"
      />
    </div>
  );
}
