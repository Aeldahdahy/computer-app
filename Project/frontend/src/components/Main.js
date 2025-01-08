import React, { useEffect, useRef } from 'react';
import ModuleHeader from './ModuleHeader';
import Chart from 'chart.js/auto';

const generateMockData = () => ({
  totalUsers: Math.floor(Math.random() * 10000),
  activeUsers: Math.floor(Math.random() * 5000),
  revenue: Math.floor(Math.random() * 100000),
  conversionRate: (Math.random() * 10).toFixed(2),
  userHistory: Array.from({ length: 7 }, () => Math.floor(Math.random() * 1000)),
  revenueHistory: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10000)),
  deviceStats: {
    desktop: Math.floor(Math.random() * 60),
    mobile: Math.floor(Math.random() * 30),
    tablet: Math.floor(Math.random() * 10)
  },
  performanceMetrics: {
    speed: Math.floor(Math.random() * 100),
    reliability: Math.floor(Math.random() * 100),
    satisfaction: Math.floor(Math.random() * 100)
  },
  trafficSources: {
    organic: Math.floor(Math.random() * 1000),
    direct: Math.floor(Math.random() * 800),
    social: Math.floor(Math.random() * 600)
  },
  userDemographics: {
    male: Math.floor(Math.random() * 50),
    female: Math.floor(Math.random() * 50)
  },
  userEngagement: {
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 500),
    shares: Math.floor(Math.random() * 300)
  }
});

const animateValue = (element, start, end, duration) => {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      clearInterval(timer);
      current = end;
    }
    element.textContent = Math.round(current).toLocaleString();
  }, 16);
};

const updateStats = (data) => {
  const elements = {
    totalUsers: document.querySelector('#totalUsers .stat-value'),
    activeUsers: document.querySelector('#activeUsers .stat-value'),
    revenue: document.querySelector('#revenue .stat-value'),
    conversion: document.querySelector('#conversion .stat-value')
  };

  const currentValues = {
    totalUsers: parseInt(elements.totalUsers.textContent.replace(/,/g, '')) || 0,
    activeUsers: parseInt(elements.activeUsers.textContent.replace(/,/g, '')) || 0,
    revenue: parseInt(elements.revenue.textContent.replace(/[$,]/g, '')) || 0,
    conversion: parseFloat(elements.conversion.textContent) || 0
  };

  animateValue(elements.totalUsers, currentValues.totalUsers, data.totalUsers, 1000);
  animateValue(elements.activeUsers, currentValues.activeUsers, data.activeUsers, 1000);
  animateValue(elements.revenue, currentValues.revenue, data.revenue, 1000);
  elements.revenue.textContent = `$${elements.revenue.textContent}`;
  elements.conversion.textContent = `${data.conversionRate}%`;
};

const createCharts = (data, chartRefs) => {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Destroy existing charts if they exist
  chartRefs.current.forEach(chart => chart && chart.destroy());

  // Users Chart
  chartRefs.current[0] = new Chart(document.getElementById('usersChart'), {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Daily Active Users',
        data: data.userHistory,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });

  // Device Distribution
  chartRefs.current[1] = new Chart(document.getElementById('deviceChart'), {
    type: 'doughnut',
    data: {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [{
        data: [data.deviceStats.desktop, data.deviceStats.mobile, data.deviceStats.tablet],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
      }]
    }
  });

  // Traffic Sources
  chartRefs.current[2] = new Chart(document.getElementById('trafficChart'), {
    type: 'bar',
    data: {
      labels: ['Organic', 'Direct', 'Social'],
      datasets: [{
        label: 'Traffic Sources',
        data: [data.trafficSources.organic, data.trafficSources.direct, data.trafficSources.social],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
      }]
    }
  });

  // Performance Metrics
  chartRefs.current[3] = new Chart(document.getElementById('performanceChart'), {
    type: 'radar',
    data: {
      labels: ['Speed', 'Reliability', 'Satisfaction'],
      datasets: [{
        label: 'Performance Metrics',
        data: [data.performanceMetrics.speed, data.performanceMetrics.reliability, data.performanceMetrics.satisfaction],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        pointBackgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });

  // Revenue History
  chartRefs.current[4] = new Chart(document.getElementById('revenueHistoryChart'), {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Revenue History',
        data: data.revenueHistory,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });

  // Revenue Chart
  chartRefs.current[5] = new Chart(document.getElementById('revenueChart'), {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: 'Revenue',
        data: data.revenueHistory,
        backgroundColor: '#10b981'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });

  // User Demographics
  chartRefs.current[6] = new Chart(document.getElementById('demographicsChart'), {
    type: 'pie',
    data: {
      labels: ['Male', 'Female'],
      datasets: [{
        data: [data.userDemographics.male, data.userDemographics.female],
        backgroundColor: ['#3b82f6', '#f59e0b']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });

  // User Engagement
  chartRefs.current[7] = new Chart(document.getElementById('engagementChart'), {
    type: 'polarArea',
    data: {
      labels: ['Likes', 'Comments', 'Shares'],
      datasets: [{
        data: [data.userEngagement.likes, data.userEngagement.comments, data.userEngagement.shares],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  });
};

const setupDateRange = (chartRefs) => {
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  startDate.value = weekAgo.toISOString().split('T')[0];
  endDate.value = today.toISOString().split('T')[0];
  
  [startDate, endDate].forEach(input => {
    input.addEventListener('change', () => {
      const newData = generateMockData();
      updateStats(newData);
      createCharts(newData, chartRefs);
    });
  });
};

function Main() {
  const chartRefs = useRef([]);

  useEffect(() => {
    document.querySelectorAll('.stat-card').forEach((card, index) => {
      card.style.setProperty('--order', index);
    });

    const data = generateMockData();
    updateStats(data);
    createCharts(data, chartRefs);
    setupDateRange(chartRefs);
    
    const interval = setInterval(() => {
      const newData = generateMockData();
      updateStats(newData);
    }, 5000);

    return () => {
      clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      chartRefs.current.forEach(chart => chart && chart.destroy());
    };
  }, []);

  return (
    <>
      <ModuleHeader ModuleName="Main" />
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Analytics Dashboard</h1>
          <div className="date-range">
            <input type="date" id="startDate" />
            <input type="date" id="endDate" />
          </div>
        </header>
        
        <div className="stats-grid">
          <div className="stat-card" id="totalUsers">
            <h3>Total Users</h3>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card" id="activeUsers">
            <h3>Active Users</h3>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card" id="revenue">
            <h3>Revenue</h3>
            <p className="stat-value">$0</p>
          </div>
          <div className="stat-card" id="conversion">
            <h3>Conversion Rate</h3>
            <p className="stat-value">0%</p>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-container">
              <canvas id="usersChart"></canvas>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-container">
              <canvas id="revenueChart"></canvas>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-container">
              <canvas id="deviceChart"></canvas>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-container">
              <canvas id="performanceChart"></canvas>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-container">
              <canvas id="trafficChart"></canvas>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-container">
              <canvas id="revenueHistoryChart"></canvas>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-container">
              <canvas id="demographicsChart"></canvas>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-container">
              <canvas id="engagementChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;