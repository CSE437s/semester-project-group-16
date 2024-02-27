import React from 'react';
import styled from 'styled-components';

const StyledPost = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-items: stretch;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font: 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  .category {
    color: grey; // Example styling for category
  }

  .timestamp {
    color: grey; // Example styling for timestamp
  }

  .email {
    color: grey; // Example styling for email
  }

  .completed {
    color: grey; // Example styling for completed status
  }
`;


const TripInfo = styled.div`
  flex: 1;
  font: 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const RouteInfo = styled.div`
  flex: 1;
  margin-left: 20px;
  font: 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const Label = styled.span`
  font-weight: bold;
  font:  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const ApplyButton = styled.button`
  font-size: 16px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #0056b3;
    color: #ffffff;
  }
`;

const Post = ({ trip }) => {

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateString} : ${timeString}`;
  };
  
  const handleApplyStop = () => {
    console.log('applying');
  };

  return (
    <StyledPost>
      <TripInfo>
        <div>
          <Label>From:</Label> {trip.addresses.origin_address}
        </div>
        <div>
          <Label>To:</Label> {trip.addresses.destination_address}
        </div>
        <div className="category">
          {trip.category}
        </div>
      </TripInfo>
      <RouteInfo>
        <div className="email">
          {trip.email.email}
        </div>
        <div className="timestamp">
          {formatTimestamp(trip.timestamp)}
        </div>
        <div className="completed">
          {trip.completed ? 'Completed' : 'Active'}
        </div>
      </RouteInfo>
      <ApplyButton onClick={handleApplyStop}>Join</ApplyButton>
    </StyledPost>
  );
};

export default Post;

