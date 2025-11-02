import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const UserProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`${API_BASE_URL}/transactions?${params}`);
      setTransactions(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (transactionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/transactions`, transactionData);
      setTransactions((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const editTransaction = useCallback(async (id, transactionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/transactions/${id}`, transactionData);
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? response.data : tx))
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${id}`);
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/budgets`);
      setBudgets(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const setBudget = useCallback(async (budgetData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/budgets`, budgetData);
      setBudgets((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBudget = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/budgets/${id}`);
      setBudgets((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/insights`);
      setInsights(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportCSV = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/export/csv`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to export CSV');
    }
  }, []);

  const exportPDF = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/export/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to export PDF');
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        transactions,
        budgets,
        insights,
        loading,
        error,
        fetchTransactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        fetchBudgets,
        setBudget,
        deleteBudget,
        fetchInsights,
        exportCSV,
        exportPDF,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
