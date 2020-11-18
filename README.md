# Control Oriented Management (COM)

Used for websocket registration and keep-alive of lvk-vendored IoT devices.

## Common Endpoint

com.lvk.sh/

## Summary

Devices should connect to the websocket endpoint,

Authorize using their ``secret``.

Assign themselves ``label``s

Send Keep-Alive messages on a regular basis

## FLOW

IoT Device performs the following registration workflow

```LCOM
> AUTH <secret>
< 200 OK
> ID <id>
< 200 OK
> LABEL <label>
< 200 OK
```

End user Device performs the following registration workflow

```LCOM
> AUTH <secret>
< 200 OK
```

The End user Device can now send commands to any device by referencing it by its label like so

```LCOM
> FORWARD <label> <command>
```

to which the device receives

```LCOM
< CMD <command>
```

In order for the End User to list devices they can use

```LCOM
> devices
< DEVICE <id> | <label>
```
