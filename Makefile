prod:
	docker-compose -f docker-compose.prod.yml up

dev:
	docker-compose -f docker-compose.dev.yml up

down:
	docker-compose -f docker-compose.dev.yml down

pdown:
	docker-compose -f docker-compose.prod.yml down

re:
	make pdown
	make
