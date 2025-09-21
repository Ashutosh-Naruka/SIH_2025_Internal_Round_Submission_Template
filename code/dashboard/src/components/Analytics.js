// src/components/Analytics.js
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

export default function Analytics({ issues }) {
  const { t } = useLanguage();
  // Category breakdown data
  const categoryData = issues.reduce((acc, issue) => {
    const category = issue.category || 'general';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Status distribution data
  const statusData = issues.reduce((acc, issue) => {
    const status = issue.status || 'reported';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Daily trends (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyTrends = last7Days.map(date => {
    const dayIssues = issues.filter(issue => {
      const issueDate = issue.createdAt?.toDate?.() || new Date(issue.createdAt);
      return issueDate.toISOString().split('T')[0] === date;
    });
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      issues: dayIssues.length,
      resolved: dayIssues.filter(i => i.status === 'resolved').length
    };
  });

  const COLORS = ['#3498db', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c', '#34495e'];

  return (
    <div>
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-header">
          <h2 className="card-title">
            📊 {t('analyticsTitle')}
          </h2>
        </div>
      </div>
      
      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        
        {/* Category Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('categoryBreakdown')}</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('statusDistribution')}</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip />
                <Bar dataKey="value" fill="var(--primary-green)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Trends */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('dailyTrends')}</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="issues" 
                stroke="var(--warning)" 
                strokeWidth={3} 
                name={t('newIssues')}
                dot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="var(--success)" 
                strokeWidth={3} 
                name={t('resolvedIssuesChart')}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
