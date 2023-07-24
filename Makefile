dev:
	docker-compose -f docker-compose.dev.yml up

prod:
	docker-compose -f docker-compose.prod.yml up

down:
	docker-compose -f docker-compose.dev.yml down

pdown:
	docker-compose -f docker-compose.prod.yml down