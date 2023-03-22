import React, { useState, useEffect } from 'react';
import './styles.css';

const RewardPoints = () => {
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({});
  const [filterCustomerId, setFilterCustomerId] = useState('');

  // Simulate an asynchronous API call to fetch data
  useEffect(() => {
    const fetchTransactions = async () => {
      // const response = await fetch('/api/transactions');
      // const data = await response.json();
      const data = [
  { id: 1, customerId: '123', amount: 120, date: '2022-01-02' },
  { id: 2, customerId: '123', amount: 75, date: '2022-03-02' },
  { id: 3, customerId: '123', amount: 50, date: '2022-01-03' },
  { id: 4, customerId: '345', amount: 80, date: '2022-02-02' },
  { id: 5, customerId: '345', amount: 110, date: '2022-02-02' },
  { id: 6, customerId: '345', amount: 90, date: '2022-02-03' }]
      setTransactions(data);
    };
    fetchTransactions();
  }, []);

  // Calculate reward points earned for each customer per month and total
  useEffect(() => {
    const calculateRewards = () => {
      const rewardsByCustomer = {};
      transactions.forEach((transaction) => {
        const { customerId, amount, date } = transaction;
        const month = new Date(date).toLocaleString('default', { month: 'long' });
        const points = calculatePoints(amount);
        if (!rewardsByCustomer[customerId]) {
          rewardsByCustomer[customerId] = { monthly: {}, total: 0 };
        }
        if (!rewardsByCustomer[customerId].monthly[month]) {
          rewardsByCustomer[customerId].monthly[month] = 0;
        }
        rewardsByCustomer[customerId].monthly[month] += points;
        rewardsByCustomer[customerId].total += points;
      });
      setRewards(rewardsByCustomer);
    };
    const calculatePoints = (amount) => {
      let points = 0;
      if (amount > 100) {
        points += (amount - 100) * 2;
        points += 50;
      } else if (amount >= 50) {
        points += (amount - 50);
      }
      return points;
    };
    calculateRewards();
  }, [transactions]);
// Filter rewards by customer ID
const filteredRewards = filterCustomerId
  ? { [filterCustomerId]: rewards[filterCustomerId] }
  : rewards;

// Render the reward points table and filter textbox
return (
  <div>
    <h2>Reward Points Calculator</h2>
    <input
      type="text"
      placeholder="Filter by Customer ID"
      value={filterCustomerId}
      onChange={(e) => setFilterCustomerId(e.target.value)}
    />
    <table>
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Total Rewards</th>
          <th>Rewards by Month</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(filteredRewards).map((customerId) => (
          <tr key={customerId}>
            <td>{customerId}</td>
            <td>{filteredRewards[customerId]?.total || 0}</td>
            <td>
              {Object.keys(filteredRewards[customerId]?.monthly || {}).map((month) => (
                <div key={`${customerId}-${month}`}>
                  {month}: {filteredRewards[customerId].monthly[month]}
                </div>
              ))}
            </td>
          </tr>
        ))}
        {Object.keys(filteredRewards).length === 0 && (
          <tr>
            <td colSpan={3}>No results found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
}

export default RewardPoints;
