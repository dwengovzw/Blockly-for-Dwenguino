# Airo Gripper Protocol (AGP) v1

BLE protocol between a Halberd-driven gripper (peripheral) and airo-mono (central).

## Identity & discovery

- The gripper advertises the AGP service UUID.
- The **user-assigned name** (set in the sketch via `gripper.begin("gripper-left")`) is the
  primary identity. It is advertised as the BLE local name (scan response).
- The nRF52840 factory device ID is exposed in the descriptor (`deviceId`) as a stable
  tiebreaker. Clients MUST fail loudly when a name filter matches multiple devices and
  suggest connecting by `deviceId` instead.
- While a central is connected the peripheral does not advertise, so a connected gripper
  cannot be claimed by a second client.

## GATT layout

Base UUID: `9B8Exxxx-5C3A-4F1B-B4A2-6C9D0A7E5D10`

| UUID (xxxx) | Name       | Properties        | Purpose |
|-------------|------------|-------------------|---------|
| `0001`      | Service    | -                 | AGP service |
| `0002`      | Descriptor | Read              | JSON self-description (read once after connect) |
| `0003`      | Command    | Write, Write w/o resp | Commands from central |
| `0004`      | State      | Notify            | Rate-limited full state snapshots |
| `0005`      | Event      | Notify            | Command lifecycle + discrete events |
| `0006`      | Sensor     | Notify            | Rate-limited sensor value snapshots |

## Descriptor (JSON, UTF-8)

```json
{
  "protocol": 1,
  "name": "gripper-left",
  "deviceId": "E663E8A1C2D4F5B6",
  "profile": "parallel",
  "axes": [
    {"id": 0, "unit": "m", "min": 0.0, "max": 0.085, "maxSpeed": 0.15}
  ],
  "poses": ["open", "closed"],
  "sensors": [
    {"id": 0, "name": "force", "unit": "N", "min": 0.0, "max": 250.0}
  ]
}
```

- `profile` is `"parallel"` for standard two-finger grippers (axis 0 = finger opening in
  meters, mapping 1:1 to airo-mono `ParallelPositionGripperSpecs`), `"generic"` otherwise.
- Exotic grippers declare multiple axes; `open`/`closed` poses keep `open()`/`close()`
  working without the client knowing the kinematics.

## Command frames (Central -> Command characteristic)

All values little-endian. `f32` = IEEE-754 float.

```
[seq:u8][opcode:u8][payload...]
```

| Opcode | Name       | Payload |
|--------|------------|---------|
| `0x01` | MOVE_AXES  | `[count:u8]` then `count` x `[axisId:u8][target:f32]` |
| `0x02` | MOVE_POSE  | `[nameLen:u8][name:bytes]` |
| `0x03` | SET_SPEED  | `[axisId:u8][speed:f32]` |
| `0x04` | SET_EFFORT | `[axisId:u8][effort:f32]` |
| `0x05` | STOP       | - |
| `0x06` | PING       | - |
| `0x07` | IDENTIFY   | - (target blinks its LED for ~2 s) |

`seq` is chosen by the central and echoed in events. One motion command is in flight at a
time; a new motion command preempts the previous one (which is FAILED with reason
`PREEMPTED`).

## Event frames (Event characteristic -> Central)

```
[type:u8][seq:u8][payload...]
```

| Type   | Name     | Payload | Meaning |
|--------|----------|---------|---------|
| `0x01` | ACK      | -       | Command parsed and accepted |
| `0x02` | DONE     | -       | Motion/command completed |
| `0x03` | FAILED   | `[reason:u8]` | See reasons below |
| `0x10` | GRASPED  | - (`seq`=0) | Object grasp detected |
| `0x11` | RELEASED | - (`seq`=0) | Object no longer grasped |

Failure reasons: `0x01` bad frame, `0x02` preempted, `0x03` unknown pose/axis,
`0x04` rejected by firmware, `0x05` out of range.

Command lifecycle: `ACK(seq)` immediately, then later exactly one of `DONE(seq)` /
`FAILED(seq, reason)`. This two-phase reply maps directly onto airo-mono's
`AwaitableAction`.

## State frames (State characteristic -> Central, notify)

```
[flags:u8][axisCount:u8][position:f32 x axisCount]
```

Flags: bit0 = moving, bit1 = object grasped. Snapshots are full state (idempotent), sent
on change and rate-limited to ~20 Hz, so a lost notification never corrupts client state.

## Sensor frames (Sensor characteristic -> Central, notify)

```
[sensorCount:u8][value:f32 x sensorCount]
```

Values appear in ascending sensor-id order, matching the `sensors` array in the
descriptor. Like state frames, sensor frames are full snapshots (idempotent), sent on
change and rate-limited (default ~20 Hz, configurable in firmware up to ~50 Hz). Sensor
data is a separate characteristic so a client can subscribe to sensors, state, or both
independently, and so high-rate sensors do not inflate the state channel.

Sensor semantics (what "force" or "pressure" means physically) are conveyed by the
descriptor's `name`/`unit`/`min`/`max` fields; the protocol itself is agnostic, which
keeps exotic sensing (tactile arrays, proximity, temperature) inside the same mechanism:
one sensor id per scalar channel.
