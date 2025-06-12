'use client'

import React, { useEffect, useState } from "react";
import { Printer } from "lucide-react";

type Material = {
    id: string;
    name: string;
    unit: string;
    category: string;
    minStockLevel: number;
};

type GRN = {
    id: string;
    grnNumber: string;
    date: string;
    materialId: string;
    quantity: number;
    rate: number;
    totalAmount: number;
    supplierName: string;
};

type IssueNote = {
    id: string;
    issueNumber: string;
    date: string;
    materialId: string;
    totalQuantity: number;
    weightedRate: number;
    totalAmount: number;
    issuedTo: string;
    approvedBy: string;
    issueItems: IssueItem[];
};

type IssueItem = {
    id: string;
    grnId: string;
    quantity: number;
    rate: number;
    amount: number;
    grn: GRN;
};

type StockReport = {
    material: Material;
    currentStock: number;
    minStockLevel: number;
    unit: string;
};

type MovementReport = {
    material: Material;
    movements: {
        date: string;
        type: "GRN" | "Issue";
        quantity: number;
        rate: number;
        refNumber: string;
    }[];
};

type ValuationReport = {
    material: Material;
    stockValue: number;
    currentStock: number;
    weightedRate: number;
};

const fetcher = (url: string) =>
    fetch(url).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
    });

const tabLabels = [
    "Current Stock",
    "Stock Movements",
    "Stock Valuation"
];

const Reports: React.FC = () => {
    const [tab, setTab] = useState(0);

    // Current Stock
    const [stock, setStock] = useState<StockReport[]>([]);
    const [stockLoading, setStockLoading] = useState(true);

    // Movements
    const [movements, setMovements] = useState<MovementReport[]>([]);
    const [movementsLoading, setMovementsLoading] = useState(true);

    // Valuation
    const [valuation, setValuation] = useState<ValuationReport[]>([]);
    const [valuationLoading, setValuationLoading] = useState(true);

    useEffect(() => {
        setStockLoading(true);
        fetcher("/api/stock/current")
            .then(setStock)
            .finally(() => setStockLoading(false));
    }, []);

    useEffect(() => {
        setMovementsLoading(true);
        fetcher("/api/stock/movements")
            .then(setMovements)
            .finally(() => setMovementsLoading(false));
    }, []);

    useEffect(() => {
        setValuationLoading(true);
        fetcher("/api/stock/valuation")
            .then(setValuation)
            .finally(() => setValuationLoading(false));
    }, []);

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
                    Current stock, movement, and valuation reports
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
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Current Stock</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Unit</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Min Stock Level</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stock.map((row) => (
                                            <tr key={row.material.id}>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.material.name}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.material.category}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.currentStock}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.unit}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{row.minStockLevel}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>
                                                    {row.currentStock <= row.minStockLevel ? (
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
                        {movementsLoading ? (
                            <div style={{ padding: 32, textAlign: "center" }}>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            movements.map((m) => (
                                <div key={m.material.id} style={{ marginBottom: 24 }}>
                                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                        {m.material.name} ({m.material.unit})
                                    </div>
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr style={{ background: "#f8f8f8" }}>
                                                    <th style={{ padding: 8, border: "1px solid #eee" }}>Date</th>
                                                    <th style={{ padding: 8, border: "1px solid #eee" }}>Type</th>
                                                    <th style={{ padding: 8, border: "1px solid #eee" }}>Quantity</th>
                                                    <th style={{ padding: 8, border: "1px solid #eee" }}>Rate</th>
                                                    <th style={{ padding: 8, border: "1px solid #eee" }}>Reference</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {m.movements.map((mv, i) => (
                                                    <tr key={i}>
                                                        <td style={{ padding: 8, border: "1px solid #eee" }}>{new Date(mv.date).toLocaleDateString()}</td>
                                                        <td style={{ padding: 8, border: "1px solid #eee" }}>{mv.type}</td>
                                                        <td style={{ padding: 8, border: "1px solid #eee" }}>{mv.quantity}</td>
                                                        <td style={{ padding: 8, border: "1px solid #eee" }}>₹{mv.rate.toFixed(2)}</td>
                                                        <td style={{ padding: 8, border: "1px solid #eee" }}>{mv.refNumber}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
                {tab === 2 && (
                    <>
                        <h3 style={{ marginTop: 0 }}>Stock Valuation Report</h3>
                        {valuationLoading ? (
                            <div style={{ padding: 32, textAlign: "center" }}>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#f8f8f8" }}>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Material</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Current Stock</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Weighted Avg Rate</th>
                                            <th style={{ padding: 8, border: "1px solid #eee" }}>Stock Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {valuation.map((v) => (
                                            <tr key={v.material.id}>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{v.material.name}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>{v.currentStock}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>₹{v.weightedRate.toFixed(2)}</td>
                                                <td style={{ padding: 8, border: "1px solid #eee" }}>₹{v.stockValue.toFixed(2)}</td>
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