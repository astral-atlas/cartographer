#!/usr/bin/env bash
tmux new-session -d -s atlas-dev-session watch make \; \
split-window -d -v npx serve atlas-quill \; \
split-window -d -h npx nodemon --signal SIGHUP dist  \; \
set-option mouse on  \; \
set-hook pane-exited "kill-session -t atlas-dev-session"
tmux attach
