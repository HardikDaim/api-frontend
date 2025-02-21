import React, { useState, useEffect } from "react";
import { RiArrowDropUpLine, RiArrowDropDownLine } from "react-icons/ri";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate JSON input
      const data = JSON.parse(input);
      // Ensure "data" exists and is an array
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Input must be a JSON object with a 'data' array.");
      }

      // Call the backend API
      const res = await fetch(`${API_URL}/bfhl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      // Ensure the response contains the expected keys
      if (!result.alphabets || !result.numbers || !result.highest_alphabet) {
        throw new Error("Invalid response from the server.");
      }

      setResponse(result);
      setLoading(false);
      setError("");
    } catch (err) {
      setError(
        err.message ||
          "Invalid JSON input. Please check your input and try again."
      );
      setResponse(null);
      setLoading(false);
    }
  };

  // Reset selected filters when a new response is received
  useEffect(() => {
    if (response) {
      setSelectedFilters([]);
    }
  }, [response]);

  const handleFilterClick = (filter) => {
    setIsDropdownOpen(false); // Close the dropdown
    // Toggle the filter in the selectedFilters array
    if (selectedFilters.includes(filter)) {
      setSelectedFilters((prev) => prev.filter((f) => f !== filter));
    } else {
      setSelectedFilters((prev) => [...prev, filter]);
    }
  };

  const renderFilteredResponse = () => {
    if (!response || selectedFilters.length === 0) {
      return null; // Show nothing if no filters are selected
    }

    return (
      <div className="mt-4 space-y-2">
        {/* Display Alphabets if selected */}
        {selectedFilters.includes("Alphabets") && response.alphabets && (
          <p className="text-blue-600">
            <strong>Alphabets:</strong>{" "}
            {response.alphabets.join(", ") || "None"}
          </p>
        )}

        {/* Display Numbers if selected */}
        {selectedFilters.includes("Numbers") && response.numbers && (
          <p className="text-green-600">
            <strong>Numbers:</strong> {response.numbers.join(", ") || "None"}
          </p>
        )}

        {/* Display Highest Alphabet if selected */}
        {selectedFilters.includes("Highest Alphabet") &&
          response.highest_alphabet && (
            <p className="text-purple-600">
              <strong>Highest Alphabet:</strong>{" "}
              {response.highest_alphabet || "None"}
            </p>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">2220909</h1>{" "}
      {/* Replace with your roll number */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON input, e.g., { "data": ["M", "1", "334", "4", "B"] }'
          rows={5}
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSubmit}
        >
          Submit
        </button>

        {loading && (
          <p className="text-blue-500 text-center mt-4">Loading...</p>
        )}

        {response && (
          <div className="mt-6">
            <div className="relative">
              {/* Custom Dropdown */}
              <div className="relative">
                <button
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 text-left"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Select Filters
                  <span className="float-right text-xl text-gray-500">
                    {isDropdownOpen ? <RiArrowDropDownLine /> : <RiArrowDropUpLine />} {/* Upward and downward arrows */}
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 bg-white border border-gray-300 rounded-lg my-1 w-full">
                    {["Alphabets", "Numbers", "Highest Alphabet"].map(
                      (filter) => (
                        <div
                          key={filter}
                          className={`p-2 cursor-pointer hover:bg-gray-100 ${
                            selectedFilters.includes(filter)
                              ? "bg-blue-100"
                              : ""
                          }`}
                          onClick={() => handleFilterClick(filter)}
                        >
                          {filter}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedFilters.map((filter) => (
                  <span
                    key={filter}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center"
                  >
                    {filter}
                    <button
                      className="ml-2 text-red-500"
                      onClick={() =>
                        setSelectedFilters((prev) =>
                          prev.filter((f) => f !== filter)
                        )
                      }
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {renderFilteredResponse()}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
