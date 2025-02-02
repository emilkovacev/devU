
import React from 'react';
import styles from './scoreboard.scss';

interface ScoreboardProps {
    courseId: string;
    assignmentId: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ courseId, assignmentId }) => {
    // Dummy scoreboard data
    const scoreboardData = [
        { UBit: 'ashwa', score: 95, runtime: '1.2s' },
        { UBit: 'yessicaq', score: 88, runtime: '1.5s' },
        { UBit: 'neemo', score: 76, runtime: '2.1s' },
        { UBit: 'alex', score: 29, runtime: '17.2s' },
        { UBit: 'jesse', score: 56, runtime: '9.5s' },
        { UBit: 'kevin', score: 7, runtime: '100s' },

    ];

    return (
        <div>
            <h3>{`Scoreboard for Assignment ${assignmentId} in Course ${courseId}`}</h3>
            <table className={styles.scoreboardTable}>
                <thead>
                <tr>
                    <th>UBit</th>
                    <th>Score</th>
                    <th>Runtime</th>
                </tr>
                </thead>
                <tbody>
                {scoreboardData.map((entry) => (
                    <tr key={entry.UBit}>
                        <td>{entry.UBit}</td>
                        <td>{entry.score}</td>
                        <td>{entry.runtime}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
export default Scoreboard;
