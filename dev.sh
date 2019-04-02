#!/usr/bin/env bash
tmux new-session -d -s atlas-dev-session watch make \; \
split-window -d -v npx serve atlas-quill \; \
split-window -d -h npx nodemon dist \; \
set-hook pane-exited "kill-server"
tmux attach
