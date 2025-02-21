import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";


  const handleSubmit = async () => {
    try {
      // Validate JSON input
      const data = JSON.parse(input);

      // Call the backend API
      const res = await fetch(`${API_URL}/bfhl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log("Response from API:", result);
      setResponse(result);
      setError("");
    } catch (err) {
      setError("Invalid JSON input. Please check your input and try again.");
      setResponse(null);
    }
  };

  const handleFilterChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedFilters(options);
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    let filteredResponse = {};
    if (selectedFilters.includes("Alphabets")) filteredResponse.alphabets = response.alphabets;
    if (selectedFilters.includes("Numbers")) filteredResponse.numbers = response.numbers;
    if (selectedFilters.includes("Highest Alphabet")) filteredResponse.highest_alphabet = response.highest_alphabet;

    return (
      <div className="mt-4">
        {filteredResponse.numbers && (
          <p className="text-green-600">
            <strong>Numbers:</strong> {filteredResponse.numbers.join(", ")}
          </p>
        )}
        {filteredResponse.alphabets && (
          <p className="text-blue-600">
            <strong>Alphabets:</strong> {filteredResponse.alphabets.join(", ")}
          </p>
        )}
        {filteredResponse.highest_alphabet && (
          <p className="text-purple-600">
            <strong>Highest Alphabet:</strong> {filteredResponse.highest_alphabet.join(", ")}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">2220909</h1> {/* Replace with your roll number */}
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

        {response && (
          <div className="mt-6">
            <label className="block text-gray-700">Filter Response:</label>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFilterChange}
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