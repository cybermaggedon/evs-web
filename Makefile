
VERSION=$(shell git describe | sed 's/^v//')

REPO=docker.io/cybermaggedon/evs-web
DOCKER=docker

all: container

.npm: package.json package-lock.json
	npm install
	touch .npm

container: .npm
	PATH=$${PATH}:$$(pwd)/node_modules/bin ng build --prod
	${DOCKER} build -t ${REPO}:${VERSION} -f Dockerfile .
	${DOCKER} tag ${REPO}:${VERSION} ${REPO}:latest

push: container
	${DOCKER} push ${REPO}:${VERSION}
	${DOCKER} push ${REPO}:latest

