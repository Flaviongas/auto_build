#!/usr/bin/env zx
import 'zx/globals'


const move_front = await $`cd /var/www/example.org/tudeli`
const pull_front = await $`git pull`
const build_front = await $`bash -c "npm run build"`


