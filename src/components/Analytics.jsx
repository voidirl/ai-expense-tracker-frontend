import { useEffect, useState } from "react";
import {
    Chart as ChartJs, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";
import { getAllExpenses } from "../services/expenseServices";

ChartJs.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const COLORS = [
    "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981",
    "#ef4444", "#3b82f6", "#ec4899", "#14b8a6",
];

export default function Analytics() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllExpenses().then((data) => setExpenses(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-full text-cyan-400 trxt-lg">
            Loading Analytics...
        </div>
    );

    if (expenses.length === 0) return (
        <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            No expenses found. Add some to see analytics!
        </div>
    );

    const categoryMap = {};
    expenses.forEach(({ category, amount }) => {
        categoryMap[category] = (categoryMap[category] || 0) + amount;
    });

    const categories = Object.keys(categoryMap);
    const categoryAmounts = Object.values(categoryMap);

    const donutData = {
        labels: categories,
        datasets: [{
            data: categoryAmounts,
            backgroundColor: COLORS.slice(0, categories.length),
            borderColor: "#1e293b",
            borderWidth: 2,
        }],
    };

    const monthMap = {};
    expenses.forEach(({ expenseDate, amount }) => {
        const month = new Date(expenseDate).toLocaleString("default", { month: "short", year: "numeric" });
        monthMap[month] = (monthMap[month] || 0) + amount;
    });
    const months = Object.keys(monthMap);
    const monthAmounts = Object.values(monthMap);

    const barData = {
        labels: months,
        datasets: [{
            label: "Monthly Spending (₹)",
            data: monthAmounts,
            backgroundColor: "#06b6d4",
            borderRadius: 6,
        }],
    };


    const barOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: "#94a3b8" } },
            title: { display: false },
        },
        scales: {
            x: { ticks: { color: "#94a3b8" }, grid: { color: "#1e293b" } },
            y: { ticks: { color: "#94a3b8" }, grid: { color: "#1e293b" } },
        },
    };

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const highestCategory = categories.length > 0
        ? categories.reduce((a, b) => categoryMap[a] > categoryMap[b] ? a : b)
        : "N/A";
    
    const recent = [...expenses]
        .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))
        .slice(0, 5);

    return (
        <div className="p-6 text-white space-y-8">
            <h1 className="text-2xl font-bold text-cyan-400">Analytics</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Total Spent</p>
                    <p className="text-2xl font-bold text-cyan-400">₹{total.toFixed(2)}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Highest Category</p>
                    <p className="text-2xl font-bold text-purple-400">{highestCategory}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4">
                    <p className="text-gray-400 text-sm">Total Transactions</p>
                    <p className="text-2xl font-bold text-emerald-400">{expenses.length}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-xl p-5">
                    <h2 className="text-lg font-semibold text-gray-300 mb-4">Spending by Category</h2>
                    <div className="max-w-xs mx-auto">
                        <Doughnut data={donutData} />
                    </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-5">
                    <h2 className="text-lg font-semibold text-gray-300 mb-4">Monthly Spending</h2>
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-gray-300 mb-4">Recent Transactions</h2>
                <div className="space-y-3">
                    {recent.map((e) => (
                        <div key={e.id} className="flex justify-between items-center border-b border-slate-700 pb-2">
                            <div>
                                <p className="font-medium">{e.title}</p>
                                <p className="text-sm text-gray-400">{e.category} · {new Date(e.expenseDate).toLocaleDateString()}</p>
                            </div>
                            <p className="text-cyan-400 font-semibold">₹{e.amount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}