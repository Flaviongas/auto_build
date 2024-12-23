#!/usr/bin/env zx
import 'zx/globals'


const move_front = await $`cd /var/www/example.org/tudeli && git reset --hard && git pull && npm run build`


