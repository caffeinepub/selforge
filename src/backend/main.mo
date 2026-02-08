actor {
  type Time = {
    seconds_since_epoch : Int;
    timezone_offset : Int;
  };

  func computetimeofday(time : Time) : Time {
    let seconds_in_day : Int = 86400;
    let proper_time = time.seconds_since_epoch + (time.timezone_offset * 60);
    {
      seconds_since_epoch = proper_time % seconds_in_day;
      timezone_offset = time.timezone_offset;
    };
  };
};
