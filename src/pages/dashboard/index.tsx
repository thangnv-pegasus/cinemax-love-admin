import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

// Đăng ký tất cả các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,    // Dành cho Pie chart
  PointElement,  // Dành cho Line chart
  LineElement    // Dành cho Line chart
);

export default function DashboardContent() {

  // Dữ liệu cho biểu đồ Line
  const dataLine = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Lượng người xem',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  // Dữ liệu cho biểu đồ Bar
  const dataBar = {
    labels: ['Action', 'Drama', 'Comedy', 'Romance', 'Horror'],
    datasets: [
      {
        label: 'Phim xem nhiều',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };

  // Dữ liệu cho biểu đồ Pie
  const dataPie = {
    labels: ['Windows', 'MacOS', 'Linux', 'Mobile'],
    datasets: [
      {
        data: [55, 30, 10, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ]
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 h-full">
      <h2 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h2>
      {/* Các biểu đồ */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        {/* Biểu đồ Line */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Lượng người xem theo tháng</h3>
          <Line data={dataLine} />
        </div>
        
        {/* Biểu đồ Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Phim xem nhiều</h3>
          <Bar data={dataBar} />
        </div>
      </div>
        {/* Biểu đồ Pie */}
        {/* <div className="bg-white p-4 rounded-lg shadow-md w-3/5 mx-auto">
          <h3 className="text-xl font-semibold mb-2">Phân bổ hệ điều hành người dùng</h3>
          <Pie data={dataPie} />
        </div> */}
    </div>
  );
};
