start:
	./start.sh

check:
	yarn run lint

test:
	yarn run coverage

.PHONY: start test check install
