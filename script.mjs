#!/usr/bin/env zx
import 'zx/globals'
import { $ } from 'zx';

await $`echo "Hello, world!"`;


const move_front = await $`cd /var/www/example.org/tudeli && git reset --hard && git pull && npm run build`


