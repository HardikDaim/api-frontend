import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      setResponse(result);
      setLoading(false);
      setError("");
    } catch (err) {
      setError("Invalid JSON input. Please check your input and try again.");
      setResponse(null);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    // Extract selected options and update state
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedFilters(options);
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    return (
      <div className="mt-4">
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
            <label className="block text-gray-700">Filter Response:</label>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFilterChange}
              value={selectedFilters}
            >
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest Alphabet">Highest Alphabet</option>
            </select>
            {renderFilteredResponse()}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;