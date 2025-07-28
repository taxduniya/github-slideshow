import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Receipt, DollarSign, PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Pie } from 'recharts';
import { mockExpenses, expenseCategories } from '../data/mockData';
import { Expense } from '../types';

interface ExpensesProps {
  onEditExpense?: (expense: Expense) => void;
  onCreateExpense?: () => void;
}

const Expenses: React.FC<ExpensesProps> = ({ onEditExpense, onCreateExpense }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Filter expenses based on search and filters
  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesSearch = !searchTerm || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.receipt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesMethod = methodFilter === 'all' || expense.paymentMethod === methodFilter;
    
    return matchesSearch && matchesCategory && matchesMethod;
  });

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowExpenseModal(true);
  };

  const handleEditExpense = (expense: Expense) => {
    if (onEditExpense) {
      onEditExpense(expense);
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      console.log('Deleting expense:', expenseId);
    }
  };

  const ExpenseModal = () => {
    if (!selectedExpense) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowExpenseModal(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Expense Details</h2>
            <button className="modal-close" onClick={() => setShowExpenseModal(false)}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="form-grid">
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Expense Information</h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Category:</strong> 
                  <span style={{ 
                    marginLeft: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'var(--gray-100)',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.875rem'
                  }}>
                    {selectedExpense.category}
                  </span>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Description:</strong> {selectedExpense.description}
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Amount:</strong> 
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--danger)', marginLeft: '0.5rem' }}>
                    ${selectedExpense.amount.toLocaleString()}
                  </span>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Date:</strong> {selectedExpense.date.toLocaleDateString()}
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem', color: 'var(--gray-800)' }}>Payment Details</h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Payment Method:</strong> 
                  <span style={{ 
                    marginLeft: '0.5rem',
                    textTransform: 'capitalize'
                  }}>
                    {selectedExpense.paymentMethod}
                  </span>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong>Receipt Number:</strong> 
                  <code style={{ 
                    marginLeft: '0.5rem',
                    fontSize: '0.875rem', 
                    backgroundColor: 'var(--gray-100)', 
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {selectedExpense.receipt}
                  </code>
                </div>
              </div>
            </div>
            
            {selectedExpense.notes && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--gray-800)' }}>Notes</h4>
                <p style={{ 
                  padding: '1rem', 
                  backgroundColor: 'var(--gray-50)', 
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--gray-700)'
                }}>
                  {selectedExpense.notes}
                </p>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button 
              className="btn btn-primary"
              onClick={() => {
                setShowExpenseModal(false);
                handleEditExpense(selectedExpense);
              }}
            >
              <Edit2 className="btn-icon" />
              Edit Expense
            </button>
            <button className="btn btn-secondary" onClick={() => setShowExpenseModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const calculateStats = () => {
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthExpenses = filteredExpenses
      .filter(e => e.date.getMonth() === currentMonth && e.date.getFullYear() === currentYear)
      .reduce((sum, e) => sum + e.amount, 0);
    
    const categoryTotals = expenseCategories.map(category => ({
      category,
      total: filteredExpenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0),
      count: filteredExpenses.filter(e => e.category === category).length
    })).filter(item => item.total > 0);
    
    return { totalExpenses, thisMonthExpenses, categoryTotals };
  };

  const stats = calculateStats();

  // Chart data
  const pieChartData = stats.categoryTotals.map((item, index) => ({
    name: item.category,
    value: item.total,
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
  }));

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthExpenses = mockExpenses
      .filter(e => e.date.getMonth() === date.getMonth() && e.date.getFullYear() === date.getFullYear())
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      amount: monthExpenses
    };
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="page-title">Expense Monitor</h1>
        <button className="btn btn-primary" onClick={onCreateExpense}>
          <Plus className="btn-icon" />
          Add Expense
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-input">
          <div style={{ position: 'relative' }}>
            <Search 
              size={20} 
              style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--gray-400)'
              }} 
            />
            <input
              type="text"
              placeholder="Search by description, category, or receipt..."
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <select 
          className="form-select filter-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {expenseCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <select 
          className="form-select filter-select"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="all">All Methods</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="transfer">Transfer</option>
          <option value="cheque">Cheque</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card expenses">
          <div className="stat-header">
            <span className="stat-title">Total Expenses</span>
            <DollarSign className="stat-icon" />
          </div>
          <div className="stat-value">${stats.totalExpenses.toLocaleString()}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">This Month</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            ${stats.thisMonthExpenses.toLocaleString()}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Categories</span>
            <PieChart className="stat-icon" />
          </div>
          <div className="stat-value">{stats.categoryTotals.length}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Transactions</span>
            <Receipt className="stat-icon" />
          </div>
          <div className="stat-value">{filteredExpenses.length}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={(entry) => `${entry.name}: $${entry.value}`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Monthly Expense Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Expenses']} />
              <Bar dataKey="amount" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Receipt</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date.toLocaleDateString()}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'var(--gray-100)',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {expense.category}
                  </span>
                </td>
                <td>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
                      {expense.description}
                    </div>
                    {expense.notes && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        {expense.notes.substring(0, 50)}{expense.notes.length > 50 ? '...' : ''}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: '600', color: 'var(--danger)' }}>
                    ${expense.amount.toLocaleString()}
                  </span>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{expense.paymentMethod}</td>
                <td>
                  <code style={{ 
                    fontSize: '0.875rem', 
                    backgroundColor: 'var(--gray-100)', 
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {expense.receipt}
                  </code>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleViewExpense(expense)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEditExpense(expense)}
                      title="Edit Expense"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      title="Delete Expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredExpenses.length === 0 && (
        <div className="card text-center" style={{ marginTop: '2rem' }}>
          <Receipt size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray-400)' }} />
          <h3 style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>No expenses found</h3>
          <p style={{ color: 'var(--gray-500)' }}>
            {searchTerm || categoryFilter !== 'all' || methodFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by recording your first expense.'
            }
          </p>
          {!searchTerm && categoryFilter === 'all' && methodFilter === 'all' && (
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={onCreateExpense}>
              <Plus className="btn-icon" />
              Add First Expense
            </button>
          )}
        </div>
      )}

      {/* Category Breakdown */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 className="card-title">Category Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {stats.categoryTotals.map((category, index) => (
            <div key={category.category} style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--gray-50)', 
              borderRadius: 'var(--radius-md)',
              borderLeft: `4px solid hsl(${(index * 137.5) % 360}, 70%, 50%)`
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                ${category.total.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>
                {category.category}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                {category.count} transaction{category.count !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showExpenseModal && <ExpenseModal />}
    </div>
  );
};

export default Expenses;