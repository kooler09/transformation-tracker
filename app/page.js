'use client';

import { useState, useEffect } from 'react';

export default function TrackerPage() {
  const [currentWeight, setCurrentWeight] = useState(186);
  const [selectedDate, setSelectedDate] = useState('');
  const [allData, setAllData] = useState({});

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    
    // Load from localStorage
    const saved = localStorage.getItem('kostaTracker');
    if (saved) {
      setAllData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(allData).length > 0) {
      localStorage.setItem('kostaTracker', JSON.stringify(allData));
    }
  }, [allData]);

  const today = allData[selectedDate] || {
    morning: { wokeOnTime: false, supplements: false, proteinShake: false },
    work: { deepWork1: false, deepWork2: false, noSocialMedia: false },
    meals: { proteinTarget: false, calorieTarget: false, noSnacks: false },
    workout: { completed: false, supplements: false },
    evening: { peptides: false, prepped: false, bedtime: false },
    weight: currentWeight,
    notes: ''
  };

  const updateField = (category, field, value) => {
    setAllData(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [category]: {
          ...prev[selectedDate]?.[category],
          [field]: value
        }
      }
    }));
  };

  const updateWeight = (weight) => {
    setCurrentWeight(weight);
    setAllData(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        weight: weight
      }
    }));
  };

  const updateNotes = (notes) => {
    setAllData(prev => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        notes: notes
      }
    }));
  };

  const calculateScore = () => {
    const m = today.morning;
    const w = today.work;
    const ml = today.meals;
    const wo = today.workout;
    const e = today.evening;

    let score = 0;
    if (m.wokeOnTime) score += 5;
    if (m.supplements) score += 5;
    if (m.proteinShake) score += 5;
    if (w.deepWork1) score += 10;
    if (w.deepWork2) score += 10;
    if (w.noSocialMedia) score += 5;
    if (ml.proteinTarget) score += 10;
    if (ml.calorieTarget) score += 10;
    if (ml.noSnacks) score += 5;
    if (wo.completed) score += 15;
    if (wo.supplements) score += 5;
    if (e.peptides) score += 5;
    if (e.prepped) score += 5;
    if (e.bedtime) score += 5;

    return score;
  };

  const dailyScore = calculateScore();
  const targetWeight = 170;
  const toGo = Math.max(0, today.weight - targetWeight);

  const getScoreLevel = (score) => {
    if (score >= 90) return { level: 'LEGEND', color: 'text-green-600' };
    if (score >= 80) return { level: 'ELITE', color: 'text-blue-600' };
    if (score >= 70) return { level: 'SOLID', color: 'text-yellow-600' };
    if (score >= 60) return { level: 'AVERAGE', color: 'text-orange-600' };
    return { level: 'RESET NEEDED', color: 'text-red-600' };
  };

  const scoreInfo = getScoreLevel(dailyScore);

  const copyForGoogleSheets = () => {
    const headers = ['Date', 'Weight', 'Daily Score', 'Notes'];
    const rows = Object.entries(allData).map(([date, data]) => {
      const m = data.morning || {};
      const w = data.work || {};
      const ml = data.meals || {};
      const wo = data.workout || {};
      const e = data.evening || {};
      
      let score = 0;
      if (m.wokeOnTime) score += 5;
      if (m.supplements) score += 5;
      if (m.proteinShake) score += 5;
      if (w.deepWork1) score += 10;
      if (w.deepWork2) score += 10;
      if (w.noSocialMedia) score += 5;
      if (ml.proteinTarget) score += 10;
      if (ml.calorieTarget) score += 10;
      if (ml.noSnacks) score += 5;
      if (wo.completed) score += 15;
      if (wo.supplements) score += 5;
      if (e.peptides) score += 5;
      if (e.prepped) score += 5;
      if (e.bedtime) score += 5;

      return [date, data.weight, score, data.notes || ''].join('\t');
    });

    const text = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(text);
    alert('✅ Data copied! Paste into Google Sheets.');
  };

  const CheckboxItem = ({ label, checked, onChange, points }) => (
    <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
        checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
      }`}>
        {checked && <span className="text-white text-sm">✓</span>}
      </div>
      <span className="flex-1 text-gray-700">{label}</span>
      <span className="text-sm font-semibold text-blue-600">{points}pts</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kosta&apos;s Transformation Tracker</h1>
              <p className="text-gray-600 mt-1">Build the best version of yourself, one day at a time</p>
            </div>
            <div className="text-5xl">🔥</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="text-sm text-blue-600 font-medium">Current Weight</div>
              <div className="text-2xl font-bold text-blue-900">{today.weight} lbs</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="text-sm text-green-600 font-medium">Target Weight</div>
              <div className="text-2xl font-bold text-green-900">{targetWeight} lbs</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="text-sm text-purple-600 font-medium">To Go</div>
              <div className="text-2xl font-bold text-purple-900">{toGo.toFixed(1)} lbs</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl">
              <div className="text-sm text-orange-600 font-medium">Today&apos;s Score</div>
              <div className={`text-2xl font-bold ${scoreInfo.color}`}>{dailyScore}/100</div>
            </div>
          </div>

          {/* Date & Weight */}
          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={today.weight}
                onChange={(e) => updateWeight(parseFloat(e.target.value))}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg w-32 focus:border-blue-500 focus:outline-none"
              />
              <span className="text-gray-600">lbs</span>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Daily Performance</div>
              <div className="text-4xl font-bold mt-1">{dailyScore} / 100</div>
              <div className="text-lg mt-2 opacity-90">{scoreInfo.level}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Days Tracked</div>
              <div className="text-3xl font-bold mt-1">{Object.keys(allData).length}</div>
            </div>
          </div>
        </div>

        {/* Morning */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">☀️</div>
            Morning Routine (15 pts)
          </h2>
          <div className="space-y-2">
            <CheckboxItem label="Woke up by 6:00 AM" checked={today.morning.wokeOnTime} onChange={(e) => updateField('morning', 'wokeOnTime', e.target.checked)} points={5} />
            <CheckboxItem label="Took all morning supplements" checked={today.morning.supplements} onChange={(e) => updateField('morning', 'supplements', e.target.checked)} points={5} />
            <CheckboxItem label="Had Premier Protein shake" checked={today.morning.proteinShake} onChange={(e) => updateField('morning', 'proteinShake', e.target.checked)} points={5} />
          </div>
        </div>

        {/* Work */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">💼</div>
            Work Productivity (25 pts)
          </h2>
          <div className="space-y-2">
            <CheckboxItem label="Deep Work Block 1 (7:00-9:00 AM)" checked={today.work.deepWork1} onChange={(e) => updateField('work', 'deepWork1', e.target.checked)} points={10} />
            <CheckboxItem label="Deep Work Block 2 (9:15 AM-12:00 PM)" checked={today.work.deepWork2} onChange={(e) => updateField('work', 'deepWork2', e.target.checked)} points={10} />
            <CheckboxItem label="No social media during work" checked={today.work.noSocialMedia} onChange={(e) => updateField('work', 'noSocialMedia', e.target.checked)} points={5} />
          </div>
        </div>

        {/* Nutrition */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">🥗</div>
            Nutrition (25 pts)
          </h2>
          <div className="space-y-2">
            <CheckboxItem label="Hit 200g protein target" checked={today.meals.proteinTarget} onChange={(e) => updateField('meals', 'proteinTarget', e.target.checked)} points={10} />
            <CheckboxItem label="Stayed within calorie target" checked={today.meals.calorieTarget} onChange={(e) => updateField('meals', 'calorieTarget', e.target.checked)} points={10} />
            <CheckboxItem label="No unplanned snacks" checked={today.meals.noSnacks} onChange={(e) => updateField('meals', 'noSnacks', e.target.checked)} points={5} />
          </div>
        </div>

        {/* Workout */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">💪</div>
            Workout (20 pts)
          </h2>
          <div className="space-y-2">
            <CheckboxItem label="Completed full workout" checked={today.workout.completed} onChange={(e) => updateField('workout', 'completed', e.target.checked)} points={15} />
            <CheckboxItem label="Took pre/post workout supplements" checked={today.workout.supplements} onChange={(e) => updateField('workout', 'supplements', e.target.checked)} points={5} />
          </div>
        </div>

        {/* Evening */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">🌙</div>
            Evening Routine (15 pts)
          </h2>
          <div className="space-y-2">
            <CheckboxItem label="Took evening peptides" checked={today.evening.peptides} onChange={(e) => updateField('evening', 'peptides', e.target.checked)} points={5} />
            <CheckboxItem label="Prepped for tomorrow" checked={today.evening.prepped} onChange={(e) => updateField('evening', 'prepped', e.target.checked)} points={5} />
            <CheckboxItem label="In bed by 10:45 PM" checked={today.evening.bedtime} onChange={(e) => updateField('evening', 'bedtime', e.target.checked)} points={5} />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Notes</h2>
          <textarea
            value={today.notes}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="How did you feel today?"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none min-h-[100px]"
          />
        </div>

        {/* Export */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Export Data</h2>
          <button
            onClick={copyForGoogleSheets}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            📋 Copy for Google Sheets
          </button>
        </div>

        {/* Motivation */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white text-center mb-6">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold mb-2">Remember Your Why</h3>
          <p className="text-lg opacity-90">Show up, check the boxes, trust the process.</p>
          <p className="mt-4 text-xl font-bold">
            {toGo > 0 ? `${toGo.toFixed(1)} lbs to go!` : 'TARGET REACHED! 🎉'}
          </p>
        </div>
      </div>
    </div>
  );
}
