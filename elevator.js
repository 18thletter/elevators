{
  elevatorIsFull: function(elevator) {
    return elevator.loadFactor() > 0.9;
  },
  elevatorIsIdle: function(elevator) {
    return elevator.destinationQueue === 0;
  },
  floorsNeedingPickup: [],
  floorsNeedingPickupGoingUp: [],
  floorsNeedingPickupGoingDown: [],
  init: function(elevators, floors) {
    var bottomFloor = 0;
    var topFloor = floors.length - 1;

    // set the elevator events
    for (var i = 0; i < elevators.length; i++) {
      // when an elevator is idle, stop it
      elevators[i].on('idle', function() {
        this.stop();
        this.goingUpIndicator(false);
        this.goingDownIndicator(false);

        // check the floors needing pick up
        var nextFloor = floorsNeedingPickup.shift();
        if (nextFloor === undefined) {
          return;
        }

        if
      });
      elevators[i].on('floor_button_pressed', function(floorNum) {
        // is the floor pressed above or below the current floor?
        var requestedFloorIsAbove = floorNum > this.currentFloor();
        // if the elevator is idle, just go to that floor
        if (elevatorIsIdle(this)) {
          this.destinationQueue = [floorNum];
          if (requestedFloorIsAbove) {
            this.goingUpIndicator(true);
            this.goingDownIndicator(false);
          }
          this.checkDestinationQueue();
        } else if (this.goingUpIndicator() === true && )
        if(!_.contains(this.destinationQueue, floorNum) && ) {

        }
      });
      elevators[i].on('stopped_at_floor', function(floorNum) {
        console.log('Elevator ' + i + ' stopped at floor ' + floorNum);
        // clear the pickup queues
        floorsNeedingPickup = _.without(floorsNeedingPickup, floorNum);
        floorsNeedingPickupGoingUp = _.without(floorsNeedingPickupGoingUp, floorNum);
        floorsNeedingPickupGoingDown = _.without(floorsNeedingPickupGoingDown, floorNum);
      });
    }

    // set the floor events
    for (var floorNum = 0; floorNum < floors.length; floorNum++) {
      floors[floorNum].on('up_button_pressed', function() {
        console.log('Up button pressed on floor ' + floorNum);
        floorsNeedingPickup.push(floorNum);
        floorsNeedingPickup.sort();
        floorsNeedingPickup = _.uniq(floorsNeedingPickup, true);
        floorsNeedingPickupGoingUp.push(floorNum);
        floorsNeedingPickupGoingUp.sort();
        floorsNeedingPickupGoingUp = _.uniq(floorsNeedingPickupGoingUp, true);

        // do we even need to send an elevator?
        // if an elevator is already heading there, do nothing
        if (_.some(elevators, function(elevator) {
          return _.contains(elevator.destinationQueue, floorNum);
        })) {
          return;
        }

        // are any elevators idle?
        // tell the first non-idle elevator to go to that floor
        var firstIdleElevator = _.find(elevators, function(elevator) {
          return elevatorIsIdle(elevator);
        });
        if (firstIdleElevator !== undefined) {
          firstIdleElevator.goToFloor(floorNum);
          if (floorNum < firstIdleElevator.currentFloor()) {
            firstIdleElevator.goingDownIndicator(true);
          } else {
            firstIdleElevator.goingUpIndicator(true);
          }
          console.log('Idle elevator sent to floor ' + floorNum);
          return;
        }

        // there are no idle elevators at this point
        // the idle or passing_floor events will handle it
      });
      floors[floorNum].on('down_button_pressed', function() {
        console.log('Down button pressed on floor ' + floorNum);
        floorsNeedingPickup.push(floorNum);
        floorsNeedingPickup.sort();
        floorsNeedingPickup = _.uniq(floorsNeedingPickup, true);
        floorsNeedingPickupGoingDown.push(floorNum);
        floorsNeedingPickupGoingDown.sort();
        floorsNeedingPickupGoingDown = _.uniq(floorsNeedingPickupGoingDown, true);

        // do we even need to send an elevator?
        // if an elevator is already heading there, do nothing
        if (_.some(elevators, function(elevator) {
          return _.contains(elevator.destinationQueue, floorNum);
        })) {
          return;
        }

        // are any elevators idle?
        // tell the first non-idle elevator to go to that floor
        var firstIdleElevator = _.find(elevators, function(elevator) {
          return elevatorIsIdle(elevator);
        });
        if (firstIdleElevator !== undefined) {
          firstIdleElevator.goToFloor(floorNum);
          if (floorNum > firstIdleElevator.currentFloor()) {
            firstIdleElevator.goingUpIndicator(true);
          } else {
            firstIdleElevator.goingDownIndicator(true);
          }
          console.log('Idle elevator sent to floor ' + floorNum);
          return;
        }

        // there are no idle elevators at this point
        // the idle or passing_floor events will handle it
      });
    }
  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
