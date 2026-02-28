import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

actor {
  type SessionRecord = {
    subject : Text;
    topic : Text;
    duration : Nat; // Duration in seconds
    timestamp : Int; // Unix timestamp
  };

  let sessions = Map.empty<Nat, SessionRecord>();
  var nextId = 0;

  public shared ({ caller }) func addSession(subject : Text, topic : Text, duration : Nat, timestamp : Int) : async Nat {
    let session : SessionRecord = {
      subject;
      topic;
      duration;
      timestamp;
    };
    sessions.add(nextId, session);
    nextId += 1;
    nextId - 1;
  };

  public query ({ caller }) func getAllSessions() : async [SessionRecord] {
    sessions.toArray().map(func((_, session)) { session });
  };

  public query ({ caller }) func getSession(id : Nat) : async ?SessionRecord {
    sessions.get(id);
  };
};
