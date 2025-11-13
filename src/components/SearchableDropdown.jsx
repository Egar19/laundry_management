import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchableDropdown = ({
  label = "Pilih Item",
  data = [],
  displayKey = "nama",
  idKey = "id",
  selectedItem = null,
  onSelect = () => {},
  addButtonText = "Tambah Data",
  addButtonLink = "/",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const filteredData =
    query === ""
      ? data
      : data.filter((item) =>
          item[displayKey].toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (item) => {
    onSelect(item);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn w-full justify-between"
      >
        {selectedItem ? selectedItem[displayKey] : label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ml-2 transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.586l3.71-4.356a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full p-2 shadow bg-base-200 rounded-box z-50">
          <input
            type="text"
            placeholder="Cari..."
            className="input input-bordered w-full mb-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <ul className="max-h-48 overflow-y-auto">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <li key={item[idKey]}>
                  <button
                    type="button"
                    className={`w-full text-left py-2 px-4 rounded cursor-pointer ${
                      selectedItem?.[idKey] === item[idKey]
                        ? "bg-primary text-white"
                        : "hover:bg-base-100"
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    {item[displayKey]}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center opacity-60 py-2">Tidak ditemukan</li>
            )}
          </ul>

          <button
            type="button"
            className="btn btn-primary mt-2 w-full"
            onClick={() => {
              navigate(addButtonLink, { replace: true });
              setIsOpen(false);
            }}
          >
            + {addButtonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
