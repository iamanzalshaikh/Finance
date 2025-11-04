


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
    console.log('📊 Fetching transactions with filters:', filters);
    
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`${API_BASE_URL}/transactions?${params}`, {
        withCredentials: true, // ✅ Send cookies
      });
      console.log('✅ Transactions fetched:', response.data.length, 'items');
      setTransactions(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('❌ Fetch transactions failed:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (transactionData) => {
    setLoading(true);
    setError(null);
    console.log('➕ Adding transaction:', transactionData);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/transactions`,
        transactionData,
        { withCredentials: true } // ✅ Send cookies
      );
      console.log('✅ Transaction added:', response.data);
      setTransactions((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('❌ Add transaction failed:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const editTransaction = useCallback(async (id, transactionData) => {
    setLoading(true);
    setError(null);
    console.log('✏️ Editing transaction:', id, transactionData);
    
    try {
      const response = await axios.put(
        `${API_BASE_URL}/transactions/${id}`,
        transactionData,
        { withCredentials: true } // ✅ Send cookies
      );
      console.log('✅ Transaction edited:', response.data);
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? response.data : tx))
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('❌ Edit transaction failed:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    console.log('🗑️ Deleting transaction:', id);
    
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${id}`, {
        withCredentials: true, // ✅ Send cookies
      });
      console.log('✅ Transaction deleted:', id);
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('❌ Delete transaction failed:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('💰 Fetching budgets...');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/budgets`, {
        withCredentials: true, // ✅ Send cookies
      });
      console.log('✅ Budgets fetched:', response.data.length, 'items');
      setBudgets(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('❌ Fetch budgets failed:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const setBudget = useCallback(async (budgetData) => {
    setLoading(true);
    setError(null);
    console.log('💰 Setting budget:', budgetData);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/budgets`,
        budgetData,
        { withCredentials: true } // ✅ Send cookies
      );
      console.log('✅ Budget set:', response.data);
      setBudgets((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('❌ Set budget failed:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBudget = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    console.log('🗑️ Deleting budget:', id);
    
    try {
      await axios.delete(`${API_BASE_URL}/budgets/${id}`, {
        withCredentials: true, // ✅ Send cookies
      });
      console.log('✅ Budget deleted:', id);
      setBudgets((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('❌ Delete budget failed:', errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('💡 Fetching insights...');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/insights`, {
        withCredentials: true, // ✅ Send cookies
      });
      console.log('✅ Insights fetched:', response.data);
      setInsights(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('❌ Fetch insights failed:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportCSV = useCallback(async () => {
    console.log('📥 Exporting CSV...');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/export/csv`, {
        responseType: 'blob',
        withCredentials: true, // ✅ Send cookies
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      console.log('✅ CSV exported successfully');
    } catch (err) {
      console.error('❌ Export CSV failed:', err.message);
      setError('Failed to export CSV');
    }
  }, []);

  const exportPDF = useCallback(async () => {
    console.log('📥 Exporting PDF...');
    
    try {
      const response = await axios.get(`${API_BASE_URL}/export/pdf`, {
        responseType: 'blob',
        withCredentials: true, // ✅ Send cookies
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      console.log('✅ PDF exported successfully');
    } catch (err) {
      console.error('❌ Export PDF failed:', err.message);
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
