{
  init: function(elevators, floors) {
    var bottomFloor = 0,
    topFloor = floors.length - 1,
    elevatorIsFull = function(elevator) {
      return elevator.loadFactor() > 0.9;
    },
    elevatorIsIdle = function(elevator) {
      return elevator.destinationQueue === [NaN];
    },
    floorHasAnElevatorGoingToIt = function(floorNum) {
      return _.some(elevators, function(elevator) {
        return _.contains(elevator.destinationQueue, floorNum);
      });
    },
    goToFloor = function(elevator, floorNum) {
      elevator.goToFloor(floorNum);
      var firstQueuedFloor = elevator.destinationQueue[0];
      var currentFloor = elevator.currentFloor();
      if (currentFloor > firstQueuedFloor) {
        elevator.goingDownIndicator(true);
        elevator.goingUpIndicator(false);
      } else if (currentFloor < firstQueuedFloor) {
        elevator.goingDownIndicator(false);
        elevator.goingUpIndicator(true);
      }
      console.log('Elevator ' + elevator.num + ' sent to floor ' + floorNum);
    },
    floorsNeedingPickup = [],
    floorsNeedingPickupGoingUp = [],
    floorsNeedingPickupGoingDown = [],
    addToSet = function(set, val) {
      set.push(val);
      set.sort();
      set = _.uniq(set, true);
    },
    findClosestFloor = function(elevator) {
      var currentFloor = elevator.currentFloor();
      var differences = [];
      floorsNeedingPickup.forEach(function(floor) {
        differences.push({
          floor: floor,
          abs: Math.abs(currentFloor - floor)
        });
      });
      differences.sort(function(diff1, diff2) {
        return diff1.abs < diff2.abs;
      });
      if (differences.length === 0) {
        return currentFloor;
      } else {
        return differences[0].floor;
      }
    };

    // set the elevator events
    var elevatorNumber = 0;
    elevators.forEach(function(elevator) {
      // put a number on the elevator
      elevator.num = elevatorNumber++;

      // when an elevator is idle, stop it
      elevator.on('idle', function() {
        console.log('Elevator ' + elevator.num + ' is idle');
        this.goingUpIndicator(false);
        this.goingDownIndicator(false);

        goToFloor(elevator, findClosestFloor(elevator));
      });

      elevator.on('floor_button_pressed', function(floorNum) {
        // is the floor pressed above or below the current floor?
        //var requestedFloorIsAbove = floorNum > this.currentFloor();
        //// if the elevator is idle, just go to that floor
        //if (elevatorIsIdle(this)) {
          //this.destinationQueue = [floorNum];
          //if (requestedFloorIsAbove) {
            //this.goingUpIndicator(true);
            //this.goingDownIndicator(false);
          //}
          //this.checkDestinationQueue();
        //} else if (this.goingUpIndicator() === true && )
        //if(!_.contains(this.destinationQueue, floorNum) && ) {

        //}
      });

      elevator.on('stopped_at_floor', function(floorNum) {
        console.log('Elevator ' + elevator.num + ' stopped at floor ' + floorNum);
        // clear the sets
      });
    });

    // set the floor events
    floors.forEach(function(floor) {
      var floorNum = floor.floorNum();
      floor.on('up_button_pressed', function() {
        console.log('Up button pressed on floor ' + floorNum);
        addToSet(floorsNeedingPickup, floorNum);
        addToSet(floorsNeedingPickupGoingUp, floorNum);

        // do we even need to send an elevator?
        // if an elevator is already heading there, do nothing
        if (floorHasAnElevatorGoingToIt(elevators, floorNum)) {
          return;
        }

        // are any elevators idle?
        // tell the first idle elevator to go to that floor
        var firstIdleElevator = _.find(elevators, function(elevator) {
          return elevatorIsIdle(elevator);
        });
        if (firstIdleElevator === undefined) {
          return;
        }
        goToFloor(firstIdleElevator, floorNum);

        // there are no idle elevators at this point
        // the idle or passing_floor events will handle it
      });

      floor.on('down_button_pressed', function() {
        console.log('Down button pressed on floor ' + floorNum);
        addToSet(floorsNeedingPickup, floorNum);
        addToSet(floorsNeedingPickupGoingDown, floorNum);

        // do we even need to send an elevator?
        // if an elevator is already heading there, do nothing
        if (floorHasAnElevatorGoingToIt(elevators, floorNum)) {
          return;
        }

        // are any elevators idle?
        // tell the first idle elevator to go to that floor
        var firstIdleElevator = _.find(elevators, function(elevator) {
          return elevatorIsIdle(elevator);
        });
        if (firstIdleElevator === undefined) {
          return;
        }
        goToFloor(firstIdleElevator, floorNum);

        // there are no idle elevators at this point
        // the idle or passing_floor events will handle it
      });
    });
  },

  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
