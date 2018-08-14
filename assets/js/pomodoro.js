var sessionLength = 25; //Session Length displayed, modified on screen
var breakLength = 25; //Break Length displayed, modified on screen
var tempB = 25; //Break length stored to keep clock moving while breakLength is allowed to change
var tempS = 25; //Session length stored to keep clock moving while breakLength is allowed to change
var clock; //the current clock that is displayed
var paused = false; //If the clock should be paused
var offsetTime = 0; //When clock is paused store the relative time
var offsetValue = 0; //When clock is paused store the clock value (0.0 to 1.0)
var activity = "session"; //What clock should be displayed

//Get all Them events :)
var domSessionLength = document.getElementById("session-length");
var domBreakLength = document.getElementById("break-length");
var sessionPlus = document.getElementById("session-plus");
var sessionMinus = document.getElementById("session-minus");
var breakPlus = document.getElementById("break-plus");
var breakMinus = document.getElementById("break-minus");
var resetButton = document.getElementById("reset");
var header = document.getElementsByTagName("h1")[0];
var pausePlay = document.getElementById("pausePlay");
var pausePlayIcon = document.getElementById("pausePlay").childNodes[0];

//Increase session time by 1 min
sessionPlus.addEventListener("click", function() {
  if (sessionLength < 60) {
    ++sessionLength;
    domSessionLength.innerText = sessionLength;
  }
});

//decrease session time by 1 min
sessionMinus.addEventListener("click", function() {
  if (sessionLength > 0) {
    --sessionLength;
    domSessionLength.innerText = sessionLength;
  }
});

//increase break time by 1 min
breakPlus.addEventListener("click", function() {
  if (breakLength < 60) {
    ++breakLength;
    domBreakLength.innerText = breakLength;
  }
});

//decrease break time by 1 min
breakMinus.addEventListener("click", function() {
  if (breakLength > 0) {
    --breakLength;
    domBreakLength.innerText = breakLength;
  }
});

//Pause the clock
pausePlay.addEventListener("click", function() {
  if (paused) {
    //Store elapsed time in appropriate variable (used when clock is resumed again)
    if (activity === "session")
      offsetTime = Math.round(clock.value() * (tempS * 60));
    else offsetTime = Math.round(clock.value() * (tempB * 60));

    //Store the clock value, When clock is resumed it's created again with this offset value
    offsetValue = clock.value();

    //destroy the old clock
    clock.destroy();
    //call progress to create clock
    progress();
  } else clock.stop();

  //toggle between pause and resume state
  paused = paused === true ? false : true;
  pausePlayIcon.classList.toggle("fa-play");
  pausePlayIcon.classList.toggle("fa-pause");
});

//Reset the timer
resetButton.addEventListener("click", function() {
  //toggle between pause/play icon
  if (pausePlayIcon.classList.contains("fa-play")) {
    pausePlayIcon.classList.toggle("fa-play");
    pausePlayIcon.classList.toggle("fa-pause");
  }

  //default start the clock
  paused = false;
  //store new current timer values
  tempS = sessionLength;
  tempB = breakLength;
  //clear older pause/play offset values
  offsetTime = 0;
  offsetValue = 0;

  //destroy old clock and start new one
  clock.destroy();
  progress();
});

//Creates clock
function progress() {
  //depending on period call appropriate clock generator
  if (activity === "session") {
    clock = sessionClock();
    header.style.color = "#e03e3e";
    header.style.transitionDuration = (sessionLength * 60).toString() + "s"; //session length in 'mins' converted to 'secs'
  } else {
    clock = breakClock();
    header.style.color = "#4682b4";
    header.style.transitionDuration = (breakLength * 60).toString() + "s"; //session length in 'mins' converted to 'secs'
  }

  //if clock is resuming from pause state
  clock.set(offsetValue);
  //start the clock
  clock.animate(1.0, clockHandler);
}

function clockHandler() {
  //1.0 indicate, run till completion also animate takes a callback to run after session/break
  //destroy the clock after running
  clock.destroy();
  //toggle for next state
  activity = activity === "session" ? "break" : "session";
  //reset the offset values
  offsetTime = 0;
  offsetValue = 0;

  //call Progress again to generate next clock for next session
  progress();
}

//Generates clock for session
function sessionClock() {
  var t = tempS; //store the time period in local variable
  var bar = new ProgressBar.Circle("#clock", {
    //session ticking color
    color: "#e03e3e",
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 30,
    trailWidth: 30,
    trailColor: "#4682b4",
    easing: "linear",
    duration: (t * 60 - offsetTime) * 1000, //run clock for reduced time if coming from pause state, else offset will be 0, and convert to miliseconds
    text: {
      style: {
        // Text color.
        // Default: same as stroke color (options.color)
        position: "absolute",
        left: "50%",
        top: "50%",
        padding: 0,
        margin: 0,
        // You can specify styles which will be browser prefixed
        transform: {
          prefix: true,
          value: "translate(-50%, -50%)"
        }
      },
      autoStyleContainer: true,
      alignToBottom: true
    },
    //Set default step function for all animate calls
    step: function(state, circle) {
      //get value of completion of clock
      var value = Math.round(circle.value() * (t * 60));
      //calulate the count down minute
      var min = parseInt(t - value / 60).toString();
      //store seconds count down in value
      value = (60 - value % 60).toString();
      if (value === "60") value = "00";
      //prefix with 0 for single digit
      if (min.length == 1) min = "0" + min;
      if (value.length == 1) value = "0" + value;
      //display the count down time
      circle.setText(min + ":" + value);
    }
  });
  bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
  bar.text.style.fontSize = "40px";
  bar.text.style.color = "white";

  return bar;
}

function breakClock() {
  var t = tempB; //store the time period in local variable
  var bar = new ProgressBar.Circle("#clock", {
    //session ticking color
    color: "#4682b4",
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 30,
    trailWidth: 30,
    trailColor: "#e03e3e",
    easing: "linear",
    duration: (t * 60 - offsetTime) * 1000, //run clock for reduced time if coming from pause state, else offset will be 0, and convert to miliseconds
    text: {
      style: {
        // Text color.
        // Default: same as stroke color (options.color)
        position: "absolute",
        left: "50%",
        top: "50%",
        padding: 0,
        margin: 0,
        // You can specify styles which will be browser prefixed
        transform: {
          prefix: true,
          value: "translate(-50%, -50%)"
        }
      },
      autoStyleContainer: true,
      alignToBottom: true
    },
    // Set default step function for all animate calls
    step: function(state, circle) {
      //get value of completion of clock
      var value = Math.round(circle.value() * (t * 60));
      //calulate the count down minute
      var min = parseInt(t - value / 60).toString();
      //store seconds count down in value
      value = (60 - value % 60).toString();
      if (value === "60") value = "00";
      //prefix with 0 for single digit
      if (min.length == 1) min = "0" + min;
      if (value.length == 1) value = "0" + value;
      //display the count down time
      circle.setText(min + ":" + value);
    }
  });
  bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
  bar.text.style.fontSize = "40px";
  bar.text.style.color = "white";

  return bar;
}

progress();
