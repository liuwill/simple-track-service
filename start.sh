#!/usr/bin/env bash

env_str=""
env_line=""

if [ ! -f ".env" ];then
  echo "配置文件不存在"
  exit 1
fi

for line in $(cat .env)
do
  if [ -z "$env_str" ];then
    env_str="export $line "
  else
    env_str="$env_str && export $line "
  fi
  env_line="$env_line$line "

  if [ -n "$line" ];then
    export "$line"
  fi
done

if [ ! -n "$env_str" ]; then
  echo "环境变量加载失败"
  exit 1
fi
if [ ! -n "$LEAN_APP_ID" ]; then
  echo "环境变量加载失败"
  exit 1
fi

if [ ! -f "index.js" ]; then
  echo "服务器代码不存在"
  exit 1
fi

if [ ! `which npm` ]; then
  echo "请先安装node.js"
  exit 1
fi

if [ ! `which yarn` ]; then
  npm install -g yarn
fi

command="yarn start"
echo "$command"
$command
