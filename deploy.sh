# npm run build
SERVER_PATH="apale@apale7.cn:/home/apale/blog/blog"
scp -r public $SERVER_PATH #拷贝到服务器
cd public
git init
git add .
git commit -m "auto deployed"
git push -f git@github.com:Apale7/Apale7.github.io.git master #发布到github pages
cd ..