import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SessionRecord {
    topic: string;
    duration: bigint;
    subject: string;
    timestamp: bigint;
}
export interface backendInterface {
    addSession(subject: string, topic: string, duration: bigint, timestamp: bigint): Promise<bigint>;
    getAllSessions(): Promise<Array<SessionRecord>>;
    getSession(id: bigint): Promise<SessionRecord | null>;
}
