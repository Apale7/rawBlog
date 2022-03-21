content = open('public/index.html', 'r').read()
content = content.replace('</html>', '<p style="background:none;height: 5%;position:relative;bottom: 0px;width: 100%;text-align: center;"><img style="padding-top:2px;width: 1.5%;" src="/国徽.webp"><a class="banquan" style="color:#000;"href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=备案编号" target="_blank">粤ICP备2022030243号</a></p></html>')
content = content.replace('en-US', 'zh-CN')
open('public/index.html', 'w').write(content)
