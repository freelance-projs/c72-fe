.PHONY: build
build:
	docker build -t ngoctd/c72-fe:latest .

.PHONY: run
run:
	docker run -d -p 5081:5081 --name c72-fe ngoctd/c72-fe:latest

.PHONY: push
push:
	docker push ngoctd/c72-fe
