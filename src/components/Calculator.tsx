'use client';

import React, { useState, useEffect } from 'react';

const Calculator = () => {
    const [highestDayProfit, setHighestDayProfit] = useState(0);
    const [currentTotalProfit, setCurrentTotalProfit] = useState(0);
    const [tradingDays, setTradingDays] = useState(0);
    const [targetPayout, setTargetPayout] = useState(35);
    const [plannedDays, setPlannedDays] = useState(5);
    const [exchangeRate, setExchangeRate] = useState(86);

    // UI State
    const [viewMode, setViewMode] = useState<'status' | 'roadmap' | null>(null);

    useEffect(() => {
        fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then(res => res.json())
            .then(data => {
                if (data && data.rates && data.rates.INR) {
                    setExchangeRate(data.rates.INR);
                }
            })
            .catch(err => console.error('Failed to fetch rates', err));
    }, []);

    // Constants based on rules
    const MIN_PROFIT_FOR_DAY = 5; // 0.5% of $1000
    const CONSISTENCY_THRESHOLD = 0.15; // 15%
    const MIN_WITHDRAWAL = 35; // Profit required
    const MAX_WITHDRAWAL = 100; // Profit Cap
    const MAX_PAYOUT = MAX_WITHDRAWAL * 0.8; // $80

    // Calculated values
    const minTotalProfitRequired = highestDayProfit > 0 ? highestDayProfit / CONSISTENCY_THRESHOLD : 0;
    const profitShortfall = Math.max(0, minTotalProfitRequired - currentTotalProfit);
    const isConsistencyPassed = currentTotalProfit >= minTotalProfitRequired && currentTotalProfit > 0;
    const isWithdrawalReady = isConsistencyPassed && currentTotalProfit >= MIN_WITHDRAWAL && tradingDays >= 3;

    // Visual helper for progress
    const consistencyPercentage = currentTotalProfit > 0 ? (highestDayProfit / currentTotalProfit) * 100 : 0;
    const currentPayout = Math.min(currentTotalProfit, MAX_WITHDRAWAL) * 0.8;

    const handleInputChange = (setter: (val: number) => void, value: string) => {
        setter(parseFloat(value) || 0);
        setViewMode(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-white">
                    Consistency Rule Calculator
                </h2>
                <p className="text-[var(--text-secondary)]">
                    Ensure your payouts are safe by validating against the 15% consistency rule.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Input Section */}
                <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-6 flex flex-col h-full">
                    <h3 className="text-xl font-semibold text-[var(--primary)]">Trading Data</h3>

                    <div className="space-y-4 flex-grow">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                Highest Profit Day ($)
                            </label>
                            <input
                                type="number"
                                value={highestDayProfit || ''}
                                onChange={(e) => handleInputChange(setHighestDayProfit, e.target.value)}
                                className="w-full p-3 rounded-lg input-field placeholder-gray-600"
                                placeholder="e.g. 50"
                            />
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                The single day with the most profit.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                Current Total Profit ($)
                            </label>
                            <input
                                type="number"
                                value={currentTotalProfit || ''}
                                onChange={(e) => handleInputChange(setCurrentTotalProfit, e.target.value)}
                                className="w-full p-3 rounded-lg input-field placeholder-gray-600"
                                placeholder="e.g. 200"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                Valid Trading Days Completed
                            </label>
                            <input
                                type="number"
                                value={tradingDays || ''}
                                onChange={(e) => handleInputChange(setTradingDays, e.target.value)}
                                className="w-full p-3 rounded-lg input-field placeholder-gray-600"
                                placeholder="Min 3 days required"
                            />
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                Days with at least ${MIN_PROFIT_FOR_DAY} (0.5%) profit.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-gray-700">
                            <label className="block text-sm font-bold text-[var(--success)] mb-1">
                                I want to Withdraw (Net Payout) ($)
                            </label>
                            <input
                                type="number"
                                value={targetPayout || ''}
                                onChange={(e) => handleInputChange(setTargetPayout, e.target.value)}
                                className="w-full p-3 rounded-lg input-field placeholder-gray-600 border-[var(--success)]"
                                placeholder="e.g. 50"
                                max={MAX_PAYOUT}
                            />
                            <div className="flex justify-between text-xs mt-1">
                                <span className="text-[var(--text-tertiary)]">Min: ${(MIN_WITHDRAWAL * 0.8).toFixed(2)}</span>
                                <span className="text-[var(--text-tertiary)]">Max: ${MAX_PAYOUT.toFixed(2)}</span>
                            </div>
                            {targetPayout < MIN_WITHDRAWAL * 0.8 && targetPayout > 0 && (
                                <p className="text-xs text-[var(--danger)] mt-1 font-bold">
                                    ⚠️ Minimum payout is ${(MIN_WITHDRAWAL * 0.8).toFixed(2)} (from $35 profit).
                                </p>
                            )}
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                This helps us calculate how much profit you need. (80% Split applied).
                            </p>

                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <label className="block text-sm font-bold text-[var(--success)] mb-1">
                                    Planned Trading Duration (Days)
                                </label>
                                <input
                                    type="number"
                                    value={plannedDays || ''}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setPlannedDays(val);
                                        setViewMode(null);
                                    }}
                                    className="w-full p-3 rounded-lg input-field placeholder-gray-600 border-[var(--success)]"
                                    placeholder="Min 3 days"
                                    min={3}
                                    max={30}
                                />
                                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                    Define your own timeline (3-30 Days). We will calculate the daily target.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={() => setViewMode('status')}
                            className="flex-1 py-3 bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-white font-bold rounded-xl border border-white/10 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            Check Status Only
                        </button>
                        <button
                            onClick={() => setViewMode('roadmap')}
                            className="flex-1 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-black font-bold rounded-xl shadow-lg shadow-[var(--primary)]/20 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            Plan Withdrawal
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="glass-panel p-6 rounded-2xl space-y-6 relative overflow-hidden min-h-[400px]">
                    {!viewMode ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-50">
                            <div className="w-20 h-20 bg-[var(--surface-3)] rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[var(--text-tertiary)]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-[var(--text-secondary)] text-lg">Enter your trading data and click Calculate</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)] opacity-5 blur-[50px] rounded-full pointer-events-none"></div>

                            <h3 className="text-xl font-semibold text-[var(--primary)]">Analysis</h3>

                            <div className="space-y-6 mt-4">
                                {/* Status Indicator */}
                                <div className={`p-4 rounded-xl border ${isConsistencyPassed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-lg">Consistency Status</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isConsistencyPassed ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                                            {isConsistencyPassed ? 'PASSED' : 'BREACHED'}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm opacity-80">
                                        Highest Day is <strong>{consistencyPercentage.toFixed(1)}%</strong> of Total Profit (Max 15% allowed).
                                    </p>
                                </div>

                                {/* Calculations */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                        <span className="text-[var(--text-secondary)]">Min Total Profit Required</span>
                                        <span className="font-mono text-xl text-[var(--primary)]">
                                            ${minTotalProfitRequired.toFixed(2)}
                                        </span>
                                    </div>

                                    {!isConsistencyPassed && (
                                        <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                            <span className="text-[var(--text-secondary)]">Additional Profit Needed</span>
                                            <span className="font-mono text-xl text-[var(--danger)]">
                                                +${profitShortfall.toFixed(2)}
                                            </span>
                                        </div>
                                    )}


                                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                        <span className="text-[var(--text-secondary)]">Payout Eligibility</span>
                                        <div className="text-right">
                                            <span className={`font-bold ${isWithdrawalReady ? 'text-[var(--success)]' : 'text-[var(--text-tertiary)]'}`}>
                                                {isWithdrawalReady ? 'READY' : 'NOT READY'}
                                            </span>
                                            {!isWithdrawalReady && (
                                                <p className="text-xs text-[var(--text-tertiary)] max-w-[150px]">
                                                    {currentTotalProfit < MIN_WITHDRAWAL ? `Need $${MIN_WITHDRAWAL} min total profit. ` : ''}
                                                    {tradingDays < 3 ? 'Need 3+ trading days. ' : ''}
                                                    {!isConsistencyPassed ? 'Fix consistency.' : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Payout Estimation */}
                                    <div className="mt-4 p-4 bg-[var(--surface-1)] rounded-xl border border-[var(--surface-3)]">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[var(--text-secondary)]">Estimated Payout (80%)</span>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-white">
                                                    ${currentPayout.toFixed(2)}
                                                </div>
                                                <div className="text-sm font-mono text-[var(--success)]">
                                                    ≈ ₹{(currentPayout * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-[var(--primary)] h-full transition-all duration-500"
                                                style={{ width: `${Math.min((currentTotalProfit / MAX_WITHDRAWAL) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
                                            <span>${MIN_WITHDRAWAL} Min</span>
                                            <span>${MAX_WITHDRAWAL} Max Cap</span>
                                        </div>
                                        {currentTotalProfit > MAX_WITHDRAWAL && (
                                            <p className="text-xs text-[var(--warning)] mt-2">
                                                * Profit exceeds ${MAX_WITHDRAWAL} cap. Payout is limited.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Breach Diagnosis */}
                                {!isConsistencyPassed && currentTotalProfit > 0 && (
                                    <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--warning)]/30">
                                        <h4 className="text-[var(--warning)] text-sm font-bold flex items-center gap-2 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                            </svg>
                                            Why is this a Breach?
                                        </h4>
                                        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                                            <p>
                                                Your Highest Day Profit is <span className="text-[var(--text-primary)] font-mono">${highestDayProfit}</span>.
                                            </p>
                                            <p>
                                                Your Total Profit is <span className="text-[var(--text-primary)] font-mono">${currentTotalProfit}</span>.
                                            </p>
                                            <div className="my-2 p-2 bg-black/20 rounded font-mono text-xs">
                                                ({highestDayProfit} ÷ {currentTotalProfit}) × 100 = <span className="text-[var(--danger)] font-bold">{consistencyPercentage.toFixed(2)}%</span>
                                            </div>
                                            <p>
                                                Because <span className="text-[var(--danger)] font-bold">{consistencyPercentage.toFixed(2)}%</span> is greater than the allowed <span className="text-[var(--success)] font-bold">15%</span>, the rule is breached.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Daily Target Tip */}
                                {isConsistencyPassed && (
                                    <div className="mt-6 pt-4 border-t border-gray-800">
                                        <h4 className="text-[var(--text-secondary)] text-sm mb-3 uppercase tracking-wider">Safe Daily Target</h4>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            You can safely make up to <span className="text-[var(--primary)] font-bold">${((currentTotalProfit * 0.15)).toFixed(2)}</span> today without breaking consistency.
                                        </p>
                                    </div>
                                )}

                                {/* Roadmap - Only show in Roadmap Mode */}
                                {viewMode === 'roadmap' && (
                                    <>
                                        {isWithdrawalReady ? (
                                            <div className="mt-6 pt-4 border-t border-gray-800">
                                                <h4 className="text-[var(--success)] text-sm font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                                                    <span className="text-xl">🎉</span> You are Ready!
                                                </h4>
                                                <p className="text-sm text-[var(--text-secondary)]">
                                                    You meet all requirements. You can request a payout of <span className="text-white font-bold">${(Math.min(currentTotalProfit, MAX_WITHDRAWAL) * 0.8).toFixed(2)}</span> now.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mt-6 pt-4 border-t border-gray-800">
                                                <h4 className="text-[var(--primary)] text-sm font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Roadmap to Your Payout Goal
                                                </h4>

                                                <div className="bg-[var(--surface-3)] p-4 rounded-lg space-y-3">
                                                    {/* Roadmap Logic & Schedule */}
                                                    {(() => {
                                                        const targetForConsistency = highestDayProfit > 0 ? highestDayProfit / CONSISTENCY_THRESHOLD : 0;
                                                        const targetForPayout = (targetPayout || 0) / 0.8;
                                                        const realTarget = Math.max(MIN_WITHDRAWAL, targetForConsistency, targetForPayout);

                                                        const amountNeeded = Math.max(0, realTarget - currentTotalProfit);
                                                        const daysMissing = Math.max(0, 3 - tradingDays);

                                                        // Respect User's Planned Days
                                                        const userDuration = plannedDays >= 3 && plannedDays <= 30 ? plannedDays : 3;
                                                        const safePlanDays = Math.max(daysMissing, userDuration);

                                                        const dailyProfitTarget = safePlanDays > 0 ? amountNeeded / safePlanDays : 0;

                                                        // Risk Calculation
                                                        const riskFreeLimit = highestDayProfit > 0 ? highestDayProfit * 0.95 : 999999;
                                                        const isRisky = highestDayProfit > 0 && dailyProfitTarget > riskFreeLimit && amountNeeded > 0;

                                                        return (
                                                            <>
                                                                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                                                                    <span className="text-gray-400">Target Profit Goal:</span>
                                                                    <span className="font-mono font-bold">${realTarget.toFixed(2)}</span>
                                                                </div>

                                                                {realTarget > MIN_WITHDRAWAL && currentTotalProfit < realTarget && (
                                                                    <p className="text-xs text-[var(--warning)] italic">
                                                                        * Goal is higher than $35 because of your ${highestDayProfit} highest day (Consistency Rule) or your Payout Goal.
                                                                    </p>
                                                                )}

                                                                <div className="text-sm">
                                                                    <p className="mb-3 font-semibold text-white flex justify-between items-center mt-3">
                                                                        <span>Your Custom Plan</span>
                                                                        <span className="bg-[var(--primary)] text-black text-xs px-2 py-0.5 rounded font-bold">
                                                                            {safePlanDays} Day Strategy
                                                                        </span>
                                                                    </p>

                                                                    {isRisky && (
                                                                        <div className="mb-4 bg-[var(--surface-2)] p-3 rounded border border-l-4 border-l-[var(--warning)] border-white/5">
                                                                            <p className="text-xs font-bold text-[var(--warning)] mb-1">⚠️ High Risk Plan</p>
                                                                            <p className="text-xs text-[var(--text-secondary)]">
                                                                                To reach your goal in {safePlanDays} days, you need <strong>${dailyProfitTarget.toFixed(2)}/day</strong>.
                                                                            </p>
                                                                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                                                                                This is very close to your highest day (${highestDayProfit}). You might breach the consistency rule if you exceed it. Consider increasing your duration.
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    <div className="space-y-2 mb-4">
                                                                        {amountNeeded <= 0 && daysMissing > 0 ? (
                                                                            <>
                                                                                <p className="text-xs text-[var(--success)] mb-2 font-bold">
                                                                                    ✅ Profit Goal Met! You just need to fill trading days.
                                                                                </p>
                                                                                {Array.from({ length: daysMissing }).map((_, i) => (
                                                                                    <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded px-3 border border-white/5">
                                                                                        <span className="text-gray-400">Day {i + 1} Task</span>
                                                                                        <div className="text-right">
                                                                                            <span className="font-mono text-[var(--success)] block text-sm">Target: +$5.00</span>
                                                                                            <span className="text-[10px] text-gray-500">Min 0.5% Profit Rule</span>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </>
                                                                        ) : (
                                                                            Array.from({ length: safePlanDays }).map((_, i) => (
                                                                                <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded px-3 border border-white/5">
                                                                                    <span className="text-gray-400">Day {i + 1} Target</span>
                                                                                    <span className="font-mono text-[var(--success)] font-bold">
                                                                                        +${Math.max(MIN_PROFIT_FOR_DAY, dailyProfitTarget).toFixed(2)}
                                                                                    </span>
                                                                                </div>
                                                                            ))
                                                                        )}
                                                                    </div>

                                                                    {safePlanDays > 1 && amountNeeded > 0 && (
                                                                        <p className="text-xs text-gray-400 italic mb-2">
                                                                            * This plan ensures you don&apos;t break the consistency rule by aiming too high.
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Future Outcome */}
                                                                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center bg-black/20 p-3 rounded">
                                                                    <div>
                                                                        <div className="text-xs text-gray-400">Total Journey Profit</div>
                                                                        <div className="font-bold text-white">${Math.max(realTarget, currentTotalProfit).toFixed(2)}</div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-xs text-[var(--primary)]">Projected Payout</div>
                                                                        <div className="font-bold text-xl text-[var(--success)]">
                                                                            ${(Math.min(Math.max(realTarget, currentTotalProfit), MAX_WITHDRAWAL) * 0.8).toFixed(2)}
                                                                        </div>
                                                                        <div className="text-xs font-mono text-[var(--success)]">
                                                                            ≈ ₹{((Math.min(Math.max(realTarget, currentTotalProfit), MAX_WITHDRAWAL) * 0.8) * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Rules Reference */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">
                <RuleCard title="Max Daily Drawdown" value="3%" sub="Trailing Equity/Balance" />
                <RuleCard title="Max Total Drawdown" value="6%" sub="Trailing Equity" />
                <RuleCard title="Min Trading Days" value="3 Days" sub="0.5% profit/day required" />
                <RuleCard title="Profit Split" value="80%" sub="Bi-weekly payouts" />
            </div>
        </div>
    );
};

function RuleCard({ title, value, sub }: { title: string, value: string, sub: string }) {
    return (
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-[var(--primary)]">
            <h4 className="text-sm text-[var(--text-secondary)] uppercase tracking-wide">{title}</h4>
            <div className="text-2xl font-bold my-1">{value}</div>
            <p className="text-xs text-[var(--text-tertiary)]">{sub}</p>
        </div>
    );
}

export default Calculator;
