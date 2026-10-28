#!/bin/sh

export FAC_LED_FUNC=mesh_red_blink
export DEEP_LED_FUNC=mesh_red_blink
export PRESS_LED_FUNC=no_action

mesh_red_blink()
{

	/usr/sbin/ledtool MESH_G off
	/usr/sbin/ledtool MESH_W off
	/usr/sbin/ledtool MESH_B off
	/usr/sbin/ledtool MESH_R blink 13
}
