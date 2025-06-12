'use client'

import React, { useEffect, useState } from "react";
import { Printer } from "lucide-react";

type StockItem = {
    id: string;
    name: string;
    unit: string;
    category: string;
    minStockLevel: number;
    totalReceived: number;
    totalIssued: number;
    availableStock: number;
    stockValue: number;
    isLowStock: boolean;
};

type MovementItem = {
    type: "GRN" | "ISSUE";
    date: string;
    reference: string;
    quantity: number;
    rate: number;
    amount: number;
    balance: number;
};

const tabLabels = [
    "Current Stock",
    "Stock Movements"
];

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    });

const Reports: React.FC = () => {
    const [tab, setTab] = useState(0);

    // Current Stock
    const [stock, setStock] = useState<StockItem[]>([]);
    const [stockLoading, setStockLoading] = useState(true);

    // Movements
    const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
    const [movements, setMovements] = useState<MovementItem[]>([]);
    const [movementsLoading, setMovementsLoading] = useState(false);

    useEffect(() => {
        setStockLoading(true);
        fetcher("http://localhost:3001/api/stock/current")
            .then((data) => {
                setStock(data);
                if (data.length > 0) setSelectedMaterialId(data[0].id);
            })
            .finally(() => setStockLoading(false));
    }, []);

    useEffect(() => {
        if (!selectedMaterialId) return;
        setMovementsLoading(true);
        fetcher(`http://localhost:3001/api/stock/movements/${selectedMaterialId}`)
            .then(setMovements)
            .finally(() => setMovementsLoading(false));
    }, [selectedMaterialId]);

    return (
        <div style={{
            maxWidth: 900,
            margin: "32px auto",
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px #0001",
            padding: 24
        }}>
            <div style={{ borderBottom: "1px solid #eee", marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Stock Reports</h2>
                <div style={{ color: "#888", fontSize: 15, marginBottom: 8 }}>
                    Current stock and movement reports
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {tabLabels.map((label, i) => (
                        <button
                            key={label}
                            onClick={() => setTab(i)}
                            style={{
                                border: "none",
                                background: tab === i ? "#f0f0f0" : "transparent",
                                borderBottom: tab === i ? "2px solid #333" : "2px solid transparent",
                                padding: "8px 16px",
                                cursor: "pointer",
                                fontWeight: tab === i ? 600 : 400,
                                fontSize: 16
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                {tab === 0 && (
                    <>
                        <h3 style={{ marginTop: 0 }}>Current Stock Report</h3>
                        {stockLoading ? (
                            <div style={{ padding: 32, textAlign: "center" }}>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f8f8f8" }}>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Material</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Category</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Total Received</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Total Issued</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Available Stock</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Unit</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Min Stock Level</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Stock Value</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stock.map((row) => (
                                            <tr key={row.id}>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.name}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.category}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.totalReceived}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.totalIssued}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.availableStock}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.unit}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.minStockLevel}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>₹{row.stockValue.toLocaleString()}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>
                                                    {row.isLowStock ? (
                                                        <span style={{ color: "red", fontWeight: 600 }}>Low</span>
                                                    ) : (
                                                        <span style={{ color: "green", fontWeight: 600 }}>OK</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
                {tab === 1 && (
                    <>
                        <h3 style={{ marginTop: 0 }}>Stock Movement Report</h3>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ marginRight: 8, fontWeight: 500 }}>Material:</label>
                            <select
                                value={selectedMaterialId}
                                onChange={e => setSelectedMaterialId(e.target.value)}
                                style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #ccc" }}
                            >
                                {stock.map((m) => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        {movementsLoading ? (
                            <div style={{ padding: 32, textAlign: "center" }}>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f8f8f8" }}>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Date</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Type</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Reference</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Quantity</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Rate</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Amount</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movements.map((mv, i) => (
                                            <tr key={i}>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{new Date(mv.date).toLocaleString()}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{mv.type}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{mv.reference}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{mv.quantity}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>₹{mv.rate.toFixed(2)}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>₹{mv.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{mv.balance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div style={{ marginTop: 32 }}>
                <button
                    onClick={() => window.print()}
                    style={{
                        border: "1px solid #888",
                        background: "#fff",
                        color: "#222",
                        padding: "8px 20px",
                        borderRadius: 6,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 16
                    }}
                >
                    <Printer size={18} />
                    Print Report
                </button>
            </div>
        </div>
    );
};

export default Reports;
