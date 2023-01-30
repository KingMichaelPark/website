+++
title = "Gaming on Xbox with OpenWRT"
date = 2022-09-13

[taxonomies]
tags = ["guide", "xbox", "openwrt"]
categories = ["gaming", "help"]
+++

## Background

If you are like me and decided to switch their router firmware
to the much praised [OpenWRT](https://openwrt.org/) you may - like me -
found the lag in FPS games pretty unbreable after switching the firmware.

<!-- more -->

## Update 2023-01-30

I have switched to a mesh router system as certain parts of my flat weren't
getting the coverage I wanted, however, the default on the router I got was
that upnp was enabled. You can disable that and follow the same steps as
before.

## Background cont...

There are two possible reason for this, the first of thought of was
the lack of hardware acceleration that is missing in openwrt as opposed to
the stock firmware which does enable this. However, because I am on a 150 Mbps
up/down connection, the router I have, (an Archer C7) should be able to
handle this level of speed no problem. I also thought that it could be
[bufferbloat](https://openwrt.org/docs/guide-user/network/traffic-shaping/sqm?s[]=bufferbloat)
but this also didn't seem to be an issue after some testing.

## Actual Issue Identification Method

In your Xbox, go to `Settings > Network Options > Test NAT Type` and you will,
like me probably see Moderate NAT and recommends you use Open NAT using
[UPnP](https://openwrt.org/docs/guide-user/firewall/upnp/upnp_setup) which has security
concerns for reasons beyond my care to properly understand. (I am no networking guru).

My previous TPLink firmware may have had that enabled and forwarded traffic
using UPnP (which seems to be the case
[here](https://community.tp-link.com/en/home/forum/topic/168302)). OpenWRT
doesn't recommend doing this and recommends port forwarding instead.

## Actual Fix

### On the Xbox

This is actually really easy to do. On your Xbox, go to
`Settings > Network Options > Advanced Network Settings > Something Something
Port` and set one of the 8 ports explicitly.

Take note of these 8 ports.

### In OpenWRT Admin

In the OpenWRT [admin](http://192.168.1.1)

1. Scroll down and find the XBOX device, set the ip for this device to static (you may not
   need to do this but I like to make it so this local ip stays set for the next step.
2. Go to Network
3. Go to Firewall
4. Go to Port Forwards
5. Add UDP WAN forwarding of the 8 ports above (there will be 8 rules to add) to the XBOX
   lan address. The same port external and internal.
6. Save and Apply

Now Reboot your Xbox, quit the game you had open, and go back to settings and run the
NAT test type and you should see NAT Type **Open**.

Gaming should now be very smooth. (Tested with Halo Infinite).
