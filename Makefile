init:
	npm i
build:
	npm run build
dev:
	npm run dev
deploy:
	npm run build
	cd public
	git init
	git add .
	git commit -m "auto deployed"
	git push -f git@github.com:Apale7/Apale7.github.io.git master