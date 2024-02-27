import React from 'react';
import styled from 'styled-components';

const StyledPost = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font: 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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

const Post = ({ trip }) => {
  return (
    <StyledPost>
      <TripInfo>
        <div>
          <Label>Trip ID:</Label> {trip.trip_id}
        </div>
        <div>
          <Label>User ID:</Label> {trip.user_id}
        </div>
        <div>
          <Label>Timestamp:</Label> {trip.timestamp}
        </div>
      </TripInfo>
      <RouteInfo>
        <div>
          <Label>Route ID:</Label> {trip.route_id}
        </div>
        <div>
          <Label>Category:</Label> {trip.category}
        </div>
        <div>
          <Label>Completed:</Label> {trip.completed ? 'Yes' : 'No'}
        </div>
      </RouteInfo>
    </StyledPost>
  );
};

export default Post;

