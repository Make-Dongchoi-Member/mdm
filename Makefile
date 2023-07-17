dev:
	export NODE_ENV=development
	docker-compose -f docker-compose.dev.yml up

prod:
	export NODE_ENV=production
	docker-compose -f docker-compose.prod.yml up

down:
ifeq ($(NODE_ENV),production)
	docker-compose -f docker-compose.prod.yml down
else
	docker-compose -f docker-compose.dev.yml down
endif

