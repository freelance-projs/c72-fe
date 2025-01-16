.PHONY: build
build:
	docker build -t ngoctd/c72-fe:latest .

.PHONY: push
push:
	docker push ngoctd/c72-fe
