#!/bin/bash

# 加载 NVM 环境
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# 使用指定的 Node 版本
nvm use 22

# 进入项目目录（重要！）
cd /home/ubuntu/starplus/server

# 启动你的应用（保持和现在一样）
exec node server.js