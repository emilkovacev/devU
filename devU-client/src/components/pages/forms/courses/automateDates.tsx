import React, { useState, useEffect } from 'react';
import formStyles from './coursesFormPage.scss';

interface AutomateDatesProps {
  onDatesChange: (dates: { startDate: string; endDate: string }) => void;
}

const AutomateDates = ({ onDatesChange }: AutomateDatesProps) => {
  const [season, setSeason] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [session, setSession] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Hardcoded dates for each year, season, and session
  const dateMapping: { [key: string]: { [key: string]: { [key: string]: { start: string; end: string } } } } = {
    2024: {
      Fall: {
        '15 week': { start: '2024-09-01', end: '2024-12-15' },
        '7 week': { start: '2024-09-01', end: '2024-10-20' },
        Custom: { start: '', end: '' },
      },
      Spring: {
        '15 week': { start: '2024-02-01', end: '2024-05-15' },
        '7 week': { start: '2024-02-01', end: '2024-03-20' },
        Custom: { start: '', end: '' },
      },
      Winter: {
        '15 days': { start: '2024-01-02', end: '2024-01-17' },
        '14 days': { start: '2024-01-02', end: '2024-01-16' },
        Custom: { start: '', end: '' },
      },
      Summer: {
        'Summer Session I (J)': { start: '2024-06-01', end: '2024-06-30' },
        'Summer Session II (K)': { start: '2024-07-01', end: '2024-07-31' },
        'Summer Session III (M)': { start: '2024-08-01', end: '2024-08-30' },
        '9 Weeks (L)': { start: '2024-06-01', end: '2024-08-01' },
        '10 Weeks (A)': { start: '2024-06-01', end: '2024-08-10' },
        '12 Weeks (I)': { start: '2024-05-20', end: '2024-08-10' },
        Custom: { start: '', end: '' },
      },
    },
    2025: {
      Fall: {
        '15 week': { start: '2025-09-01', end: '2025-12-15' },
        '7 week': { start: '2025-09-01', end: '2025-10-20' },
        Custom: { start: '', end: '' },
      },
      Spring: {
        '15 week': { start: '2025-02-01', end: '2025-05-15' },
        '7 week': { start: '2025-02-01', end: '2025-03-20' },
        Custom: { start: '', end: '' },
      },
      Winter: {
        '15 days': { start: '2025-01-02', end: '2025-01-17' },
        '14 days': { start: '2025-01-02', end: '2025-01-16' },
        Custom: { start: '', end: '' },
      },
      Summer: {
        'Summer Session I (J)': { start: '2025-06-01', end: '2025-06-30' },
        'Summer Session II (K)': { start: '2025-07-01', end: '2025-07-31' },
        'Summer Session III (M)': { start: '2025-08-01', end: '2025-08-30' },
        '9 Weeks (L)': { start: '2025-06-01', end: '2025-08-01' },
        '10 Weeks (A)': { start: '2025-06-01', end: '2025-08-10' },
        '12 Weeks (I)': { start: '2025-05-20', end: '2025-08-10' },
        Custom: { start: '', end: '' },
      },
    },
    2026: {
      Fall: {
        '15 week': { start: '2026-09-01', end: '2026-12-15' },
        '7 week': { start: '2026-09-01', end: '2026-10-20' },
        Custom: { start: '', end: '' },
      },
      Spring: {
        '15 week': { start: '2026-02-01', end: '2026-05-15' },
        '7 week': { start: '2026-02-01', end: '2026-03-20' },
        Custom: { start: '', end: '' },
      },
      Winter: {
        '15 days': { start: '2026-01-02', end: '2026-01-17' },
        '14 days': { start: '2026-01-02', end: '2026-01-16' },
        Custom: { start: '', end: '' },
      },
      Summer: {
        'Summer Session I (J)': { start: '2026-06-01', end: '2026-06-30' },
        'Summer Session II (K)': { start: '2026-07-01', end: '2026-07-31' },
        'Summer Session III (M)': { start: '2026-08-01', end: '2026-08-30' },
        '9 Weeks (L)': { start: '2026-06-01', end: '2026-08-01' },
        '10 Weeks (A)': { start: '2026-06-01', end: '2026-08-10' },
        '12 Weeks (I)': { start: '2026-05-20', end: '2026-08-10' },
        Custom: { start: '', end: '' },
      },
    },
    2027: {
      Fall: {
        '15 week': { start: '2027-09-01', end: '2027-12-15' },
        '7 week': { start: '2027-09-01', end: '2027-10-20' },
        Custom: { start: '', end: '' },
      },
      Spring: {
        '15 week': { start: '2027-02-01', end: '2027-05-15' },
        '7 week': { start: '2027-02-01', end: '2027-03-20' },
        Custom: { start: '', end: '' },
      },
      Winter: {
        '15 days': { start: '2027-01-02', end: '2027-01-17' },
        '14 days': { start: '2027-01-02', end: '2027-01-16' },
        Custom: { start: '', end: '' },
      },
      Summer: {
        'Summer Session I (J)': { start: '2027-06-01', end: '2027-06-30' },
        'Summer Session II (K)': { start: '2027-07-01', end: '2027-07-31' },
        'Summer Session III (M)': { start: '2027-08-01', end: '2027-08-30' },
        '9 Weeks (L)': { start: '2027-06-01', end: '2027-08-01' },
        '10 Weeks (A)': { start: '2027-06-01', end: '2027-08-10' },
        '12 Weeks (I)': { start: '2027-05-20', end: '2027-08-10' },
        Custom: { start: '', end: '' },
      },
    },
    2028: {
      Fall: {
        '15 week': { start: '2028-09-01', end: '2028-12-15' },
        '7 week': { start: '2028-09-01', end: '2028-10-20' },
        Custom: { start: '', end: '' },
      },
      Spring: {
        '15 week': { start: '2028-02-01', end: '2028-05-15' },
        '7 week': { start: '2028-02-01', end: '2028-03-20' },
        Custom: { start: '', end: '' },
      },
      Winter: {
        '15 days': { start: '2028-01-02', end: '2028-01-17' },
        '14 days': { start: '2028-01-02', end: '2028-01-16' },
        Custom: { start: '', end: '' },
      },
      Summer: {
        'Summer Session I (J)': { start: '2028-06-01', end: '2028-06-30' },
        'Summer Session II (K)': { start: '2028-07-01', end: '2028-07-31' },
        'Summer Session III (M)': { start: '2028-08-01', end: '2028-08-30' },
        '9 Weeks (L)': { start: '2028-06-01', end: '2028-08-01' },
        '10 Weeks (A)': { start: '2028-06-01', end: '2028-08-10' },
        '12 Weeks (I)': { start: '2028-05-20', end: '2028-08-10' },
        Custom: { start: '', end: '' },
      },
    },
    2029: {
      Fall: {
        '15 week': { start: '2029-09-01', end: '2029-12-15' },
        '7 week': { start: '2029-09-01', end: '2029-10-20' },
        Custom: { start: '', end: '' },
      },
      Spring: {
        '15 week': { start: '2029-02-01', end: '2029-05-15' },
        '7 week': { start: '2029-02-01', end: '2029-03-20' },
        Custom: { start: '', end: '' },
      },
      Winter: {
        '15 days': { start: '2029-01-02', end: '2029-01-17' },
        '14 days': { start: '2029-01-02', end: '2029-01-16' },
        Custom: { start: '', end: '' },
      },
      Summer: {
        'Summer Session I (J)': { start: '2029-06-01', end: '2029-06-30' },
        'Summer Session II (K)': { start: '2029-07-01', end: '2029-07-31' },
        'Summer Session III (M)': { start: '2029-08-01', end: '2029-08-30' },
        '9 Weeks (L)': { start: '2029-06-01', end: '2029-08-01' },
        '10 Weeks (A)': { start: '2029-06-01', end: '2029-08-10' },
        '12 Weeks (I)': { start: '2029-05-20', end: '2029-08-10' },
        Custom: { start: '', end: '' },
      },
    },
    2030: {
      Fall: {
        '15 week': { start: '2030-02-01', end: '2030-05-15' },
        '7 week': { start: '2030-02-01', end: '2030-10-20' },
        Custom: { start: '', end: '' },
      },
      Spring: {
        '15 week': { start: '2030-09-01', end: '2030-12-15' },
        '7 week': { start: '2030-09-01', end: '2030-03-20' },
        Custom: { start: '', end: '' },
      },
      Winter: {
        '15 days': { start: '2030-01-02', end: '2030-01-17' },
        '14 days': { start: '2030-01-02', end: '2030-01-16' },
        Custom: { start: '', end: '' },
      },
      Summer: {
        'Summer Session I (J)': { start: '2030-06-01', end: '2030-06-30' },
        'Summer Session II (K)': { start: '2030-07-01', end: '2030-07-31' },
        'Summer Session III (M)': { start: '2030-08-01', end: '2030-08-30' },
        '9 Weeks (L)': { start: '2030-06-01', end: '2030-08-01' },
        '10 Weeks (A)': { start: '2030-06-01', end: '2030-08-10' },
        '12 Weeks (I)': { start: '2030-05-20', end: '2030-08-10' },
        Custom: { start: '', end: '' },
      },
    },
  };

  // Define the session options based on the selected season
  const getSessionOptions = (season: string) => {
    switch (season) {
      case 'Fall':
      case 'Spring':
        return [
          { value: '15 week', label: '15 week' },
          { value: '7 week', label: '7 week' },
          { value: 'Custom', label: 'Custom' },
        ];
      case 'Winter':
        return [
          { value: '15 days', label: '15 days' },
          { value: '14 days', label: '14 days' },
          // { value: '10 days', label: '10 days' },
          { value: 'Custom', label: 'Custom' },
        ];
      case 'Summer':
        return [
          { value: 'Summer Session I (J)', label: 'Summer Session I (J)' },
          { value: 'Summer Session II (K)', label: 'Summer Session II (K)' },
          { value: 'Summer Session III (M)', label: 'Summer Session III (M)' },
          { value: '9 Weeks (L)', label: '9 Weeks (L)' },
          { value: '10 Weeks (A)', label: '10 Weeks (A)' },
          { value: '12 Weeks (I)', label: '12 Weeks (I)' },
          { value: 'Custom', label: 'Custom' },
        ];
      default:
        return [];
    }
  };

  // Update start and end dates based on selected year, season, and session
  const updateDates = () => {
    console.log("year, season, session: ", year, season, session);
    if (dateMapping[year]?.[season]?.[session]) {
      const { start, end } = dateMapping[year][season][session];
      setStartDate(start);
      setEndDate(end);
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  useEffect(() => {
    updateDates();
  }, [season, session, year]);

  // set default session
  useEffect(() => {
    if (season) {
      switch (season) {
        case 'Fall':
        case 'Spring':
          setSession('15 week');
          break;
        case 'Winter':
          setSession('15 days');
          break;
        case 'Summer':
          setSession('Summer Session I (J)');
          break;
        default:
          setSession(''); // Clear session
      }
    }
  }, [season]);

  useEffect(() => {
    onDatesChange({ startDate, endDate });
  }, [startDate, endDate, onDatesChange]);

  return (
    <div className={formStyles.semesterOptions}>
      <div className={formStyles.fieldContainer}>
        <label htmlFor="season">Season</label>
        <select id="season" value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="">Select Season</option>
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
        </select>
      </div>

      <div className={formStyles.fieldContainer}>
        <label htmlFor="year">Year</label>
        <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
          {Array.from({ length: 7 }, (_, i) => (new Date().getFullYear() + i).toString()).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className={formStyles.fieldContainer}>
        <label htmlFor="session">Session</label>
        <select id="session" value={session} onChange={(e) => setSession(e.target.value)}>
          {getSessionOptions(season).map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default AutomateDates;
