prod:
	docker-compose -f docker-compose.prod.yml up

dev:
	docker-compose -f docker-compose.dev.yml up

ddown:
	docker-compose -f docker-compose.dev.yml down

down:
	docker-compose -f docker-compose.prod.yml down

re:
	make down
	make
