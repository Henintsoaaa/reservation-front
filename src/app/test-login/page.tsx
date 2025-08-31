"use client";

import React, { useState } from "react";

const TestLogin: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testSimpleLogin = async () => {
    setLoading(true);
    setResult("Testing login...");

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "a@a.com",
          password: "password",
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const data = await response.json();
        setResult(`Success: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorData = await response.text();
        setResult(`Error ${response.status}: ${errorData}`);
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      setResult(`Fetch error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAxiosLogin = async () => {
    setLoading(true);
    setResult("Testing with axios...");

    try {
      const axios = (await import("axios")).default;

      const response = await axios.post(
        "http://localhost:3001/auth/login",
        {
          email: "a@a.com",
          password: "password",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResult(`Axios Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      console.error("Axios error:", error);
      setResult(
        `Axios error: ${error.message}\nResponse: ${JSON.stringify(
          error.response?.data,
          null,
          2
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login Test Page</h1>

      <div className="space-x-4 mb-4">
        <button
          onClick={testSimpleLogin}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test with Fetch
        </button>

        <button
          onClick={testAxiosLogin}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test with Axios
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded min-h-32">
        <h3 className="font-bold mb-2">Result:</h3>
        <pre className="whitespace-pre-wrap text-sm">{result}</pre>
      </div>
    </div>
  );
};

export default TestLogin;
