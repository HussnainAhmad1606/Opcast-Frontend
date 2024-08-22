import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const BrowserChart = ({ data }) => {
  // Count occurrences of each browser
  const browserCounts = data.reduce((acc, item) => {
    acc[item.browser] = (acc[item.browser] || 0) + 1;
    return acc;
  }, {});

  if (Object.keys(browserCounts).length === 0) {
    return <p className='my-5 text-center'>No browser data available to display.</p>;
  }

  const labels = Object.keys(browserCounts);
  const chartData = Object.values(browserCounts);

  const dataForChart = {
    labels: labels,
    datasets: [
      {
        data: chartData,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#33FF57'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: '200px', height: '200px' }}>
      <Pie data={dataForChart} options={chartOptions} />
    </div>

  )
};

export default BrowserChart;
