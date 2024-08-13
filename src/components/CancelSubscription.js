import React, { useState } from 'react';

const CancelSubscription = () => {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    if (e.target.value !== 'Others') {
      setOtherReason(''); // Clear the other reason if "Others" is not selected
    }
  };

  const handleOtherReasonChange = (e) => {
    setOtherReason(e.target.value);
  };

  const handleSubmit = () => {
    const selectedReason = reason === 'Others' ? otherReason : reason;
    console.log('Cancellation reason:', selectedReason);
    // You can add further processing here, such as sending the reason to a backend
  };

  return (
    <div>
      <h1>Reason to Cancel</h1>
      <div>
        <label>
          <input
            type="radio"
            value="Too Expensive"
            checked={reason === 'Too Expensive'}
            onChange={handleReasonChange}
          />
          Too Expensive
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Not Using Enough"
            checked={reason === 'Not Using Enough'}
            onChange={handleReasonChange}
          />
          Not Using Enough
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Technical Issues"
            checked={reason === 'Technical Issues'}
            onChange={handleReasonChange}
          />
          Technical Issues
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Switching to a Competitor"
            checked={reason === 'Switching to a Competitor'}
            onChange={handleReasonChange}
          />
          Switching to a Competitor
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Others"
            checked={reason === 'Others'}
            onChange={handleReasonChange}
          />
          Others
        </label>
        {reason === 'Others' && (
          <textarea
            value={otherReason}
            onChange={handleOtherReasonChange}
            placeholder="Please specify your reason"
          />
        )}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CancelSubscription;
