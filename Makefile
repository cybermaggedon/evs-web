
VERSION=$(shell git describe | sed 's/^v//')

REPO=docker.io/cybermaggedon/evs-web

all: container

.npm: package.json package-lock.json
	npm install
	touch .npm

container: .npm
	PATH=$${PATH}:$$(pwd)/node_modules/bin ng build --prod
	docker build -t ${REPO}:${VERSION} -f Dockerfile .

push: container
	docker push ${REPO}:${VERSION}
	docker push ${REPO}:latest

