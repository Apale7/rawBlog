---
title: go一键安装脚本(linux)
date: 2021-08-28
tags:
 - golang
 - linux

categories:
 - Go

---

```bash
wget https://golang.google.cn/dl/go1.17.linux-amd64.tar.gz      #安装
tar -zxvf go1.17.linux-amd64.tar.gz -C /usr/local/              #解压

if [[ -f ".bashrc" ]]; then
    echo "PATH=\$PATH:/usr/local/go/bin" >> ~/.bashrc            #将go所在目录添加到环境变量
    source ~/.bashrc
fi
if [[ -f ".zshrc" ]]; then
    echo "PATH=\$PATH:/usr/local/go/bin" >> ~/.zshrc             #将go所在目录添加到环境变量
    source ~/.zshrc
fi

/usr/local/go/bin/go env -w GOPROXY=https://goproxy.cn,direct   #换国内源
/usr/local/go/bin/go env -w GO111MODULE="auto"                  #开启go module

go install github.com/uudashr/gopkgs/v2/cmd/gopkgs@latest       #实用的插件
go install github.com/ramya-rao-a/go-outline@latest             #实用的插件
go install github.com/cweill/gotests/gotests@latest             #实用的插件
go install github.com/fatih/gomodifytags@latest                 #实用的插件
go install github.com/josharian/impl@latest                     #实用的插件
go install github.com/haya14busa/goplay/cmd/goplay@latest       #实用的插件
go install github.com/go-delve/delve/cmd/dlv@latest             #实用的插件
go install github.com/go-delve/delve/cmd/dlv@latest             #实用的插件
go install honnef.co/go/tools/cmd/staticcheck@latest            #实用的插件
go install golang.org/x/tools/gopls@latest                      #实用的插件
```

