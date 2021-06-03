SHELL := /bin/bash

up:
	docker-compose up -d --build

down:
	docker-compose down

logs:
	docker-compose logs --tail 100 -f

reset:
	docker-compose down --volumes --remove-orphans
	docker-compose up -d --build

delete:
	docker-compose down --volumes --remove-orphans

start:
	docker-compose start

stop:
	docker-compose stop

restart:
	docker-compose restart	

