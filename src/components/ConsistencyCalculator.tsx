'use client';

import React, { useState, useEffect } from 'react';

type DayData = {
    id: number;
    profit: number; // Can be negative
};

const ConsistencyCalculator = () => {
    const [numDays, setNumDays] = useState(5);
    const [numDaysInput, setNumDaysInput] = useState('5'); // String state for input
    const [days, setDays] = useState<DayData[]>([]);
    const [ruleType, setRuleType] = useState<string>('15_promo'); // Default to 1K $1 Promo

    // Initialize days when numDays changes, preserving existing data if expanding
    useEffect(() => {
        const newDays = Array.from({ length: numDays }, (_, i) => ({
            id: i + 1,
            profit: days[i]?.profit || 0
        }));
        setDays(newDays);
    }, [numDays]);

    const handleProfitChange = (index: number, val: string) => {
        const newDays = [...days];
        newDays[index].profit = parseFloat(val) || 0;
        setDays(newDays);
    };

    // Calculations
    const totalProfit = days.reduce((sum, day) => sum + day.profit, 0);
    const positiveDays = days.filter(d => d.profit > 0);
    const totalPositiveProfit = positiveDays.reduce((sum, day) => sum + day.profit, 0); // Consistency usually applies to Total Profit (Net) or sum of positive?
    // Usually consistency uses Net P&L of the payout period. If Net is negative, consistency doesn't apply for payout.
    // If Net is positive, Max Day must be <= X% of Net Total.

    // Let's assume Net Total Profit.
    const maxDay = days.reduce((max, day) => (day.profit > max.profit ? day : max), { profit: 0 } as DayData);

    const getRulePercent = (type: string) => {
        if (type === '20') return 20;
        return 15; // Default to 15 for '15' and '15_promo'
    };

    const rulePercent = getRulePercent(ruleType);
    const consistencyThreshold = rulePercent / 100;
    const maxAllowedDayProfit = totalProfit * consistencyThreshold;

    // If totalProfit is 0 or negative, analysis is N/A for payout
    const isProfitable = totalProfit > 0;

    const consistencyPercentage = isProfitable ? (maxDay.profit / totalProfit) * 100 : 0;
    const isPassed = isProfitable && consistencyPercentage <= rulePercent;

    // Withdrawal Logic
    const MIN_WITHDRAWAL_PROFIT = 35; // $35 Minimum profit required
    const PROFIT_SPLIT = 0.80; // 80% split

    const isWithdrawalEligible = isPassed && totalProfit >= MIN_WITHDRAWAL_PROFIT;
    const potentialPayout = isWithdrawalEligible ? totalProfit * PROFIT_SPLIT : 0;
    const payoutShortfall = MIN_WITHDRAWAL_PROFIT - totalProfit;

    // Suggestions to fix
    // If breached, we need Total * Threshold >= MaxDay
    // So RequiredTotal >= MaxDay / Threshold
    const requiredTotalProfit = maxDay.profit / consistencyThreshold;
    const profitShortfall = requiredTotalProfit - totalProfit;
    const minTotalProfitRequired = requiredTotalProfit; // Alias for readability in suggestions

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-white">
                    Detailed Consistency Analysis
                </h2>
                <p className="text-[var(--text-secondary)]">
                    Enter your daily P&L to check if you meet the {ruleType}% consistency rule.
                </p>
            </div>

            <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-end border-b border-gray-700 pb-6">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                            Program Type
                        </label>
                        <select
                            value={ruleType}
                            onChange={(e) => setRuleType(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[var(--surface-2)] border border-gray-700 text-white focus:border-[var(--primary)] outline-none"
                        >
                            <option value="15_promo">1K $1 Instant Account (15% Rule)</option>
                            <option value="15">Instant GOAT / Blitz (15% Rule)</option>
                            <option value="20">Instant PRO (20% Rule)</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                            Number of Trading Days
                        </label>
                        <input
                            type="number"
                            value={numDaysInput} // Bind to string state
                            onChange={(e) => {
                                const val = e.target.value;
                                setNumDaysInput(val);

                                // Only update logic if valid number
                                const parsed = parseInt(val);
                                if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
                                    setNumDays(parsed);
                                }
                            }}
                            onBlur={() => {
                                // On blur, ensure consistency
                                if (!numDaysInput || isNaN(parseInt(numDaysInput)) || parseInt(numDaysInput) < 1) {
                                    setNumDaysInput(numDays.toString());
                                }
                            }}
                            className="w-full p-3 rounded-lg bg-[var(--surface-2)] border border-gray-700 text-white focus:border-[var(--primary)] outline-none"
                            min="1"
                            max="100"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Input List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[var(--primary)] flex items-center gap-2">
                            <span>Daily Result Log</span>
                            <span className="text-xs font-normal text-gray-500 bg-gray-800 px-2 py-1 rounded">Input P&L for each day</span>
                        </h3>

                        <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                            {days.map((day, idx) => (
                                <div key={day.id} className="flex items-center gap-3 bg-[var(--surface-1)] p-3 rounded-lg border border-white/5">
                                    <span className="text-sm text-gray-400 w-16">Day {day.id}</span>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            value={day.profit === 0 ? '' : day.profit}
                                            onChange={(e) => handleProfitChange(idx, e.target.value)}
                                            className={`w-full bg-[var(--surface-1)] pl-7 pr-3 py-1 rounded border outline-none font-mono ${day.profit > 0 ? 'text-[var(--success)] border-green-900/50' :
                                                day.profit < 0 ? 'text-[var(--danger)] border-red-900/50' : 'text-gray-500 border-gray-700'
                                                }`}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Analysis */}
                    <div className="space-y-6">
                        <div className="glass-panel bg-[var(--surface-2)]/50 p-5 rounded-xl border border-white/5">
                            <h3 className="text-lg font-semibold mb-4 text-white">Summary</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Total Net Profit</span>
                                    <span className={`font-mono text-xl font-bold ${totalProfit >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                        ${totalProfit.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Highest Profit Day (Day {maxDay.id})</span>
                                    <span className="font-mono text-lg text-white">
                                        ${maxDay.profit.toFixed(2)}
                                    </span>
                                </div>

                                <div className="h-px bg-white/10 my-2"></div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Consistency Score</span>
                                    <div className="text-right">
                                        <span className={`font-mono text-2xl font-bold ${isPassed ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                                            {consistencyPercentage.toFixed(1)}%
                                        </span>
                                        <div className="text-xs text-gray-500">Max Allowed: {rulePercent}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Checker */}
                        {isProfitable ? (
                            <div className={`p-4 rounded-xl border ${isPassed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                <h4 className={`font-bold mb-2 flex items-center gap-2 ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
                                    {isPassed ? (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Consistency Approved
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            Consistency Violated
                                        </>
                                    )}
                                </h4>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {isPassed
                                        ? `Your highest day ($${maxDay.profit.toFixed(2)}) is only ${consistencyPercentage.toFixed(1)}% of your total profit, which is safely below the ${rulePercent}% limit.`
                                        : `Your highest day accounts for ${consistencyPercentage.toFixed(1)}% of total profit. It must be below ${rulePercent}%.`
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl border bg-gray-800/20 border-gray-700">
                                <p className="text-gray-400 text-sm">Target a positive Net Profit to enable Consistency analysis.</p>
                            </div>
                        )}

                        {/* Withdrawal Status */}
                        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--primary)]/20">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400 uppercase tracking-widest">Withdrawable Payout (80%)</span>
                                <span className={`text-2xl font-bold ${isWithdrawalEligible ? 'text-[var(--success)]' : 'text-gray-600'}`}>
                                    ${potentialPayout.toFixed(2)}
                                </span>
                            </div>
                            {!isWithdrawalEligible && isProfitable && (
                                <div className="mt-2 text-xs text-[var(--warning)] space-y-1">
                                    {!isPassed && <p>• Fix Consistency Rule first.</p>}
                                    {totalProfit < MIN_WITHDRAWAL_PROFIT && (
                                        <p>• Minimum profit of ${MIN_WITHDRAWAL_PROFIT} required (Shortfall: ${payoutShortfall.toFixed(2)}).</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Suggestions */}
                        {(!isPassed || (totalProfit < MIN_WITHDRAWAL_PROFIT)) && isProfitable && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <h4 className="text-[var(--primary)] font-bold uppercase tracking-wider text-sm">Suggestions to Fix</h4>

                                {!isPassed && (
                                    <div className="bg-[var(--surface-1)] p-4 rounded-lg border border-l-4 border-l-[var(--warning)] border-white/5">
                                        <p className="font-bold text-white mb-2">Issue: Consistency Breach</p>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Your highest day of ${maxDay.profit.toFixed(2)} is too large compared to your total profit. You need to dilute it by making more total profit.
                                        </p>

                                        <div className="bg-black/30 p-3 rounded flex justify-between items-center mb-4 border border-white/5">
                                            <div>
                                                <span className="text-sm text-gray-300 block">Profit Gap to Bridge</span>
                                                <span className="text-[10px] text-gray-500">Total Profit needed to dilute highest day</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[var(--warning)] font-bold font-mono text-lg block">+${profitShortfall.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <h5 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-2">Action Plans to Fix</h5>

                                        <div className="grid grid-cols-1 gap-2">
                                            {(() => {
                                                // Max safe is technically slightly less than the current highest day to avoid setting a new high
                                                // But usually people just trade their "normal" size.
                                                // Let's propose 3 scenarios.

                                                const maxSafeDaily = maxDay.profit * 0.99; // 99% of highest day
                                                const mediumDaily = maxDay.profit * 0.5; // 50% of highest day
                                                const smallDaily = minTotalProfitRequired ? Math.max(5, minTotalProfitRequired * 0.05) : 10; // Small conservative

                                                const scenarios = [
                                                    { label: "🚀 Fastest Path", daily: maxSafeDaily, risk: "High Efficiency" },
                                                    { label: "⚖️ Balanced Path", daily: mediumDaily, risk: "Recommended" },
                                                    { label: "🛡️ Safe Path", daily: 5, risk: "Slow & Steady" }, // assuming $5 min profit
                                                ];

                                                return scenarios.map((s, i) => {
                                                    const daysNeeded = Math.ceil(profitShortfall / s.daily);
                                                    const projectedGross = (daysNeeded * s.daily);
                                                    const projectedPayout = projectedGross * 0.8;

                                                    return (
                                                        <div key={i} className="flex justify-between items-center bg-[var(--surface-2)]/50 p-2 rounded hover:bg-[var(--surface-2)] transition-colors border border-white/5">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-xs text-white">{s.label}</span>
                                                                <span className="text-[10px] text-gray-400">Trade {daysNeeded} days @ ~${s.daily.toFixed(0)}/day</span>
                                                            </div>
                                                            <div className="text-right flex flex-col items-end">
                                                                <span className="text-xs font-mono text-[var(--success)] block">+${projectedGross.toFixed(0)} Gross</span>
                                                                <span className="text-[10px] text-gray-500 font-mono">(Payout: +${projectedPayout.toFixed(0)})</span>
                                                            </div>
                                                        </div>
                                                    )
                                                });
                                            })()}
                                        </div>

                                        <p className="text-[10px] text-gray-500 mt-3 italic mb-2">
                                            * Trading more than ${maxDay.profit.toFixed(2)} in a single day will increase the gap further. Stay below this limit!
                                        </p>

                                        <div className="bg-blue-500/10 border border-blue-500/30 p-2 rounded text-xs text-blue-200 flex items-start gap-2">
                                            <span className="text-lg">ℹ️</span>
                                            <div>
                                                <span className="font-bold">Important Payout Note:</span>
                                                <p>The "Total Profit" shown is 100% of your generated profit. You will receive an <span className="text-white font-bold">80% profit split</span> of this amount.</p>
                                                <p className="mt-1 opacity-75">Example: If you make $100 profit, your payout will be $80.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isPassed && totalProfit < MIN_WITHDRAWAL_PROFIT && (
                                    <div className="bg-[var(--surface-1)] p-4 rounded-lg border border-l-4 border-l-blue-500 border-white/5">
                                        <p className="font-bold text-white mb-2">Issue: Below Minimum Payout</p>
                                        <p className="text-sm text-gray-400 mb-1">
                                            You are consistent, but haven&apos;t reached the ${MIN_WITHDRAWAL_PROFIT} minimum profit threshold yet.
                                        </p>
                                        <p className="text-sm text-blue-400">
                                            Keep trading consistent days to gain another +${payoutShortfall.toFixed(2)}.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Explanation */}
                        <div className="mt-8 pt-6 border-t border-gray-800 text-sm text-[var(--text-tertiary)] space-y-2">
                            <h5 className="text-[var(--text-secondary)] font-bold">Rule Explanation</h5>
                            <p>
                                The {rulePercent}% Consistency Rule states: No single trading day can account for {rulePercent}% or more of your total profit at the time of withdrawal.
                            </p>
                            <p className="font-mono text-xs bg-black/20 p-2 rounded">
                                Consistency % = (Highest Day Profit / Total Profit) × 100
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsistencyCalculator;
