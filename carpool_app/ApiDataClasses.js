class TripClass {
  constructor(response) {
    this.stops = this.getStops(response.stops);
    this.route = new RouteClass(response.route);
    this.tripId = response.trip.trip_id;
    this.category = response.trip.category;
    this.tripUserId = response.trip.user_id;
    this.tripUserEmail = response.email;
    this.timestamp = response.trip.timestamp;
    this.completed = response.trip.completed;
  }

  isPast() {
    const tripDate = new Date(this.timestamp);
    const currentDate = new Date();
    return tripDate < currentDate;
  }

  getStops(data) {
    stopsList = [];
    data.forEach((stop) => {
      stopsList.push(new StopClass(stop));
    });
    return stopsList;
  }

  getStopIdWithUserId(userId) {
    for (const stop of this.stops) {
      if (stop.userId === userId) {
        return stop.stopId;
      }
    }
    return -1;
  }
  //Timestamp conversion functions here instead
}

class RouteClass {
  constructor(response) {
    this.routeId = response.route_id;
    this.originCoordinates = new CoordinateClass(
      response.origin_latitude,
      response.origin_longitude
    );
    this.destinationCoordinates = new CoordinateClass(
      response.destination_latitude,
      response.destination_longitude
    );
    this.originAddress = response.origin_address;
    this.destinationAddress = response.destination_address;
    this.routeTime = response.route_time;
    this.routePolyline = response.route_polyline;
  }
}

class CoordinateClass {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

class StopClass {
  constructor(response) {
    this.stopId = response.stop_id;
    this.stopCoordinates = new CoordinateClass(
      response.latitude,
      response.longitude,
      0,
      0
    );
    this.userId = response.user_id;
    this.userEmail = response.email;
    this.tripId = response.trip_id;
  }
}

class RideRequestClass {
  constructor(
    rideRequestId,
    incomingUserId,
    outgoingUserId,
    stopId,
    tripId,
    outgoing_full_name,
    outgoing_user_email,
    origin_address,
    destination_address,
    timestamp
  ) {
    this.rideRequestId = rideRequestId;
    this.incomingUserId = incomingUserId;
    this.outgoingUserId = outgoingUserId;
    this.stopId = stopId;
    this.tripId = tripId;
    this.userFullName = outgoing_full_name;
    this.userEmail = outgoing_user_email;
    this.originAddress = origin_address;
    this.destinationAddress = destination_address;
    this.timestamp = timestamp;
  }
}
export { TripClass, RouteClass, CoordinateClass, StopClass, RideRequestClass };
